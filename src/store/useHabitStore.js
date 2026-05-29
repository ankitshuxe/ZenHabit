import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { format } from 'date-fns';
import { NativeModules } from 'react-native';
import { supabase } from '../lib/supabase';

const storage = createMMKV();
let syncTimeout = null;

const calculateStats = (completions) => {
  const dates = Object.keys(completions).sort();
  const totalCompletions = dates.length;
  if (totalCompletions === 0) return { currentStreak: 0, bestStreak: 0, totalCompletions: 0 };

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  
  let prevDate = null;
  for (let i = 0; i < dates.length; i++) {
    const d = new Date(dates[i]);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diff = Math.round((d - prevDate) / 86400000);
      if (diff === 1) {
        tempStreak++;
      } else if (diff > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > bestStreak) bestStreak = tempStreak;
    prevDate = d;
  }

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
  
  if (completions[todayStr] || completions[yesterdayStr]) {
    let checkDateStr = completions[todayStr] ? todayStr : yesterdayStr;
    currentStreak = 0;
    while (completions[checkDateStr]) {
      currentStreak++;
      const prev = new Date(checkDateStr);
      prev.setDate(prev.getDate() - 1);
      checkDateStr = format(prev, 'yyyy-MM-dd');
    }
  }

  return { currentStreak, bestStreak, totalCompletions };
};

const zustandStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.delete(name);
  },
};

const initialHabits = [
  {
    id: 'habit-1',
    name: 'Drink 8 glasses of water',
    goalType: 'build',
    icon: 'GlassWater',
    tags: ['Consistency'],
    completions: {},
    currentStreak: 0,
    bestStreak: 0,
    totalCompletions: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-2',
    name: 'Code for 3 h',
    goalType: 'build',
    icon: 'Code',
    tags: ['Discipline', 'Consistency', 'Awareness'],
    completions: {},
    currentStreak: 0,
    bestStreak: 0,
    totalCompletions: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-3',
    name: 'Junk eating',
    goalType: 'break',
    icon: 'Pizza',
    tags: ['Self-control', 'Awareness'],
    completions: {},
    currentStreak: 0,
    bestStreak: 0,
    totalCompletions: 0,
    createdAt: new Date().toISOString(),
  }
];

export const useHabitStore = create(
  persist(
    (set, get) => ({
      userName: 'User',
      habits: initialHabits,
      themePreference: 'system',
      isLoggedIn: true,
      hasSeenOnboarding: false,
      popup: { visible: false, title: '', message: '', actions: [] },
      habitModal: { visible: false, habitId: null },
      
      showPopup: (title, message, actions = []) => set({ popup: { visible: true, title, message, actions } }),
      hidePopup: () => set((state) => ({ popup: { ...state.popup, visible: false } })),
      setHasSeenOnboarding: (status) => set({ hasSeenOnboarding: status }),
      
      openHabitModal: (habitId = null) => set({ habitModal: { visible: true, habitId } }),
      closeHabitModal: () => set({ habitModal: { visible: false, habitId: null } }),
      setLoggedIn: (status) => set({ isLoggedIn: status }),
      setThemePreference: (pref) => set({ themePreference: pref }),
      
      setUserName: (name) => set({ userName: name }),
      
      addHabit: async (habit) => {
        const newHabit = { 
          ...habit, 
          id: `habit-${Date.now()}`, 
          completions: {}, 
          currentStreak: 0, 
          bestStreak: 0, 
          totalCompletions: 0, 
          createdAt: new Date().toISOString() 
        };
        // Optimistic UI Update
        set((state) => ({ habits: [...state.habits, newHabit] }));
        get().syncToWidget();
        
        // Background Cloud Sync
        if (get().isLoggedIn && get().userName !== 'Guest') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('habits').insert({
              id: newHabit.id,
              user_id: user.id,
              name: newHabit.name,
              goal_type: newHabit.goalType,
              icon: newHabit.icon,
              tags: newHabit.tags,
              created_at: newHabit.createdAt
            });
          }
        }
      },
      
      updateHabit: async (id, updates) => {
        set((state) => ({ habits: state.habits.map(h => h.id === id ? { ...h, ...updates } : h) }));
        get().syncToWidget();

        // Background Cloud Sync
        if (get().isLoggedIn && get().userName !== 'Guest') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('habits').upsert({
              id: id,
              user_id: user.id,
              name: updates.name,
              goal_type: updates.goalType,
              icon: updates.icon,
              tags: updates.tags
            });
          }
        }
      },
      
      deleteHabit: async (id) => {
        set((state) => ({ habits: state.habits.filter(h => h.id !== id) }));
        get().syncToWidget();

        // Background Cloud Sync
        if (get().isLoggedIn && get().userName !== 'Guest') {
          await supabase.from('habits').delete().eq('id', id);
        }
      },
      
      clearAllData: () => {
        set({ habits: [] });
        get().syncToWidget();
      },
      
      toggleCompletion: async (id, dateStr) => {
        let wasAdded = false;
        
        // Optimistic UI Update
        set((state) => {
          const newHabits = state.habits.map(h => {
            if (h.id === id) {
              const current = h.completions[dateStr] || 0;
              const newCompletions = { ...h.completions };
              
              if (current > 0) {
                delete newCompletions[dateStr];
                wasAdded = false;
              } else {
                newCompletions[dateStr] = 1;
                wasAdded = true;
              }
              
              const stats = calculateStats(newCompletions);
              return { ...h, completions: newCompletions, ...stats };
            }
            return h;
          });
          return { habits: newHabits };
        });
        get().syncToWidget();

        // Background Cloud Sync
        if (get().isLoggedIn && get().userName !== 'Guest') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            if (wasAdded) {
              await supabase.from('habit_completions').insert({
                habit_id: id,
                user_id: user.id,
                completion_date: dateStr
              });
            } else {
              await supabase.from('habit_completions')
                .delete()
                .eq('habit_id', id)
                .eq('user_id', user.id)
                .eq('completion_date', dateStr);
            }
          }
        }
      },

      fetchCloudData: async () => {
        // Only fetch if logged in as a real user
        if (!get().isLoggedIn || get().userName === 'Guest') return;
        
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          // Fetch habits and their completions efficiently
          const [habitsRes, completionsRes] = await Promise.all([
            supabase.from('habits').select('*').eq('user_id', user.id),
            supabase.from('habit_completions').select('habit_id, completion_date').eq('user_id', user.id)
          ]);

          if (habitsRes.error) throw habitsRes.error;
          if (completionsRes.error) throw completionsRes.error;

          // Transform cloud data into local state shape
          const cloudHabits = habitsRes.data.map(h => {
            const completions = {};
            completionsRes.data
              .filter(c => c.habit_id === h.id)
              .forEach(c => {
                completions[c.completion_date] = 1;
              });
              
            const stats = calculateStats(completions);
            return {
              id: h.id,
              name: h.name,
              goalType: h.goal_type,
              icon: h.icon,
              tags: h.tags,
              createdAt: h.created_at,
              completions,
              ...stats
            };
          });

          // Replace local habits with cloud source of truth
          set({ habits: cloudHabits });
          get().syncToWidget();
        } catch (error) {
          console.error('Failed to fetch cloud data:', error);
        }
      },
      
      syncToWidget: () => {
        if (syncTimeout) clearTimeout(syncTimeout);
        syncTimeout = setTimeout(() => {
          try {
            const habitsData = get().habits.slice(0, 4).map(h => {
              const completions = h.totalCompletions || 0;
              return {
                id: h.id,
                name: h.name,
                type: h.goalType === 'break' ? 'avoid' : 'checkoff',
                current: completions,
                target: 0,
                icon: h.icon
              };
            });
            
            if (NativeModules.WidgetBridge) {
              NativeModules.WidgetBridge.setWidgetData(JSON.stringify(habitsData));
            } else {
              console.warn('WidgetBridge native module is not available yet.');
            }
          } catch (error) {
            console.log('Widget sync failed:', error);
          }
        }, 1000);
      }
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ habits: state.habits, themePreference: state.themePreference, userName: state.userName, isLoggedIn: state.isLoggedIn, hasSeenOnboarding: state.hasSeenOnboarding }),
      onRehydrateStorage: () => (state) => {
        if (state) state.syncToWidget();
      }
    }
  )
);
