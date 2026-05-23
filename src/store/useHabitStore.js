import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { SharedWidget } from 'react-native-home-widget';
import { format } from 'date-fns';

const storage = new MMKV();

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

// Seed Data
const initialHabits = [
  {
    id: 'habit-1',
    name: 'Brush + Bath',
    type: 'checkoff',
    icon: 'Droplets', // Lucide icon
    color: '#3b82f6', // Blue
    completions: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-2',
    name: 'No Masturbation',
    type: 'checkoff',
    icon: 'Ban', 
    color: '#3b82f6', // Blue
    completions: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-3',
    name: 'Running',
    type: 'checkoff',
    icon: 'Activity',
    color: '#f97316', // Orange
    completions: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-4',
    name: 'Drink water',
    type: 'target',
    icon: 'GlassWater',
    color: '#22c55e', // Green
    target: 3,
    unit: 'litre',
    completions: {},
    createdAt: new Date().toISOString(),
  }
];

export const useHabitStore = create(
  persist(
    (set, get) => ({
      habits: initialHabits,
      
      addHabit: (habit) => set((state) => {
        const newHabits = [...state.habits, { ...habit, id: `habit-${Date.now()}`, completions: {}, createdAt: new Date().toISOString() }];
        return { habits: newHabits };
      }),
      
      updateHabit: (id, updates) => set((state) => {
        const newHabits = state.habits.map(h => h.id === id ? { ...h, ...updates } : h);
        return { habits: newHabits };
      }),
      
      deleteHabit: (id) => set((state) => {
        const newHabits = state.habits.filter(h => h.id !== id);
        return { habits: newHabits };
      }),
      
      toggleCompletion: (id, dateStr) => set((state) => {
        // dateStr format: 'yyyy-MM-dd'
        const newHabits = state.habits.map(h => {
          if (h.id === id) {
            const current = h.completions[dateStr] || 0;
            const newCompletions = { ...h.completions };
            
            if (h.type === 'checkoff') {
              if (current > 0) delete newCompletions[dateStr];
              else newCompletions[dateStr] = 1;
            } else if (h.type === 'target') {
              // For target based, toggle could mean adding 1 until target, then reset?
              // For simplicity, let's say tapping adds 1. If >= target, resets to 0.
              if (current >= h.target) {
                delete newCompletions[dateStr];
              } else {
                newCompletions[dateStr] = current + 1;
              }
            }
            return { ...h, completions: newCompletions };
          }
          return h;
        });
        return { habits: newHabits };
      }),
      
      syncToWidget: async () => {
        // Sync the first 4 habits to react-native-home-widget so the Android AppWidget can read them
        const { habits } = get();
        const topHabits = habits.slice(0, 4);
        const today = format(new Date(), 'yyyy-MM-dd');
        
        const widgetData = topHabits.map(h => ({
          id: h.id,
          name: h.name,
          color: h.color,
          type: h.type,
          target: h.target,
          current: h.completions[today] || 0,
        }));
        
        try {
          await SharedWidget.setItem('widgetData', JSON.stringify(widgetData));
          // If we had a native widget provider set up, we could trigger an update here.
          // e.g. SharedWidget.reloadAll(); (iOS) or Android equivalent
        } catch (e) {
          console.error("Failed to sync widget data", e);
        }
      }
    }),
    {
      name: 'habito-storage',
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => (state) => {
        // State hydrated, we can sync to widget
        if (state) state.syncToWidget();
      }
    }
  )
);
