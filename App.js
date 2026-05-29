import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, View, DeviceEventEmitter } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import HomeScreen from './src/screens/HomeScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SplashScreen from './src/screens/SplashScreen';
import BottomTabBar from './src/components/BottomTabBar';
import AddHabitModal from './src/components/AddHabitModal';
import PopupSheet from './src/components/PopupSheet';
import LoginScreen from './src/screens/LoginScreen';
import { colors } from './src/theme/colors';
import { useHabitStore } from './src/store/useHabitStore';
import { supabase } from './src/lib/supabase';

export default function App() {
  const systemColorScheme = useColorScheme();
  const themePreference = useHabitStore((state) => state.themePreference);
  const activeScheme = themePreference === 'system' ? (systemColorScheme || 'light') : themePreference;
  const theme = colors[activeScheme] || colors.light;
  const isDarkMode = activeScheme === 'dark';
  
  const hasHabits = useHabitStore((state) => state.habits.length > 0);
  const isLoggedIn = useHabitStore((state) => state.isLoggedIn);
  const setLoggedIn = useHabitStore((state) => state.setLoggedIn);
  const hasSeenOnboarding = useHabitStore((state) => state.hasSeenOnboarding);
  const setHasSeenOnboarding = useHabitStore((state) => state.setHasSeenOnboarding);
  
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const habitModal = useHabitStore((state) => state.habitModal);
  const openHabitModal = useHabitStore((state) => state.openHabitModal);
  const closeHabitModal = useHabitStore((state) => state.closeHabitModal);

  useEffect(() => {
    // Check initial Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setLoggedIn(true);
        useHabitStore.getState().fetchCloudData();
      }
      setIsReady(true);
    });

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || session) {
        setLoggedIn(true);
        useHabitStore.getState().fetchCloudData();
      } else if (event === 'SIGNED_OUT') {
        setLoggedIn(false);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // 1. Listen for deep links when app is cold started or in background
    const { Linking } = require('react-native');

    const handleUrl = async (url) => {
      if (url && url.includes('zenHabitWidget://checkoff/')) {
        const match = url.match(/checkoff\/(.+)/);
        if (match && match[1]) {
          const habitId = match[1];
          const today = format(new Date(), 'yyyy-MM-dd');
          useHabitStore.getState().toggleCompletion(habitId, today);
        }
      }
    };

    // Check initial URL (cold start)
    Linking.getInitialURL().then(handleUrl);
    
    // Listen for URLs while app is open
    const linkingSub = Linking.addEventListener('url', ({ url }) => handleUrl(url));

    // 2. Listen for widget clicks natively over the bridge (if module triggers it)
    const subscription = DeviceEventEmitter.addListener('widgetClick', (event) => {
      if (event && event.actionUrl) {
        handleUrl(event.actionUrl);
      }
    });
    
    return () => {
      subscription.remove();
      linkingSub.remove();
    };
  }, []);

  if (!isReady) {
    return (
      <SafeAreaProvider>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <SplashScreen theme={theme} />
      </SafeAreaProvider>
    );
  }

  if (!isLoggedIn) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: theme.background }}>
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          <LoginScreen theme={theme} />
          <PopupSheet theme={theme} />
        </View>
      </SafeAreaProvider>
    );
  }

  if (!hasSeenOnboarding) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: theme.background }}>
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          <WelcomeScreen theme={theme} onStart={() => {
            setHasSeenOnboarding(true);
            openHabitModal(); // Open modal right away to add first habit
          }} />
          <AddHabitModal visible={habitModal?.visible} onClose={closeHabitModal} theme={theme} habitId={habitModal?.habitId} />
          <PopupSheet theme={theme} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <View style={{ flex: 1 }}>
          {activeTab === 'Home' && <HomeScreen theme={theme} />}
          {activeTab === 'Stats' && <StatsScreen theme={theme} />}
          {activeTab === 'Settings' && <SettingsScreen theme={theme} />}
        </View>
        <BottomTabBar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          theme={theme} 
          onAddPress={() => openHabitModal()} 
        />
        <AddHabitModal visible={habitModal?.visible} onClose={closeHabitModal} theme={theme} habitId={habitModal?.habitId} />
        <PopupSheet theme={theme} />
      </View>
    </SafeAreaProvider>
  );
}
