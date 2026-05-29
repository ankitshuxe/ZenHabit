import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHabitStore } from '../store/useHabitStore';
import { Heading, Title, Body, Caption } from '../components/Typography';
import { supabase } from '../lib/supabase';
import { User, Cloud, CloudOff } from 'lucide-react-native';

export default function SettingsScreen({ theme }) {
  const insets = useSafeAreaInsets();
  const clearAllData = useHabitStore((state) => state.clearAllData);
  const deleteUserAccount = useHabitStore((state) => state.deleteUserAccount);
  const isLoggedIn = useHabitStore((state) => state.isLoggedIn);
  const userName = useHabitStore((state) => state.userName);
  const themePreference = useHabitStore((state) => state.themePreference);
  const setThemePreference = useHabitStore((state) => state.setThemePreference);
  const setLoggedIn = useHabitStore((state) => state.setLoggedIn);
  const logout = useHabitStore((state) => state.logout);
  const showPopup = useHabitStore((state) => state.showPopup);

  const isRealUser = isLoggedIn && userName !== 'Guest';
  
  const [email, setEmail] = React.useState('');
  const [isSyncing, setIsSyncing] = React.useState(false);

  React.useEffect(() => {
    if (isRealUser) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) setEmail(user.email);
      });
      
      const interval = setInterval(() => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 1500);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isRealUser]);

  const handleDeleteData = () => {
    showPopup(
      isRealUser ? "Delete Account" : "Delete All Data",
      isRealUser ? "Are you sure you want to delete your account and all history? This cannot be undone." : "Are you sure you want to erase all your habits and history? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: isRealUser ? deleteUserAccount : clearAllData }
      ]
    );
  };

  const handleExport = () => {
    showPopup("Export Data", "Your data has been exported to your device.");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: Math.max(insets.top, 20) }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Heading color={theme.text} style={{ marginBottom: 24, marginTop: 10 }}>Settings</Heading>

        <Title color={theme.text} style={{ marginBottom: 12 }}>Profile</Title>
        <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.card, borderWidth: 1 }]}>
          <View style={styles.textWrap}>
            <Title color="#F3EFE9" style={{ fontSize: 18, marginBottom: 4 }}>{userName ? userName.trim().split(' ')[0] : 'User'}</Title>
            <Body color="#F3EFE9" style={{ opacity: 0.8 }}>{isRealUser ? email : 'Local Guest Account'}</Body>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {!isRealUser ? (
              <CloudOff size={24} color="#F3EFE9" opacity={0.6} />
            ) : isSyncing ? (
              <Cloud size={24} color="#F3EFE9" />
            ) : (
              <Cloud size={24} color={theme.accent} />
            )}
            <Caption style={{ color: !isRealUser ? '#F3EFE9' : (isSyncing ? '#F3EFE9' : theme.accent), opacity: !isRealUser ? 0.6 : 1, marginTop: 4, fontWeight: 'bold' }}>
              {!isRealUser ? 'Not Synced' : (isSyncing ? 'Syncing...' : 'Synced')}
            </Caption>
          </View>
        </View>

        <Title color={theme.text} style={{ marginBottom: 12 }}>Appearance</Title>
        <View style={[styles.row, { borderBottomColor: theme.border, borderBottomWidth: 1, flexDirection: 'column', alignItems: 'stretch' }]}>
          <View style={[styles.textWrap, { marginBottom: 16 }]}>
            <Title color={theme.text} style={{ fontSize: 16, marginBottom: 4 }}>Theme</Title>
            <Body color={theme.textSecondary}>Choose your preferred app appearance.</Body>
          </View>
          <View style={[styles.segmentContainer, { borderColor: theme.border }]}>
            {['system', 'light', 'dark'].map((mode, index) => (
              <TouchableOpacity 
                key={mode}
                style={[
                  styles.segmentButton, 
                  themePreference === mode && { backgroundColor: theme.primary },
                  { borderColor: theme.border },
                  index === 2 && { borderRightWidth: 0 } // remove right border on last item
                ]}
                onPress={() => setThemePreference(mode)}
              >
                <Title style={[
                  styles.segmentText,
                  { color: themePreference === mode ? theme.primaryText : theme.text }
                ]}>
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Title>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Title color={theme.text} style={{ marginTop: 32, marginBottom: 12 }}>Manage Data</Title>
        <TouchableOpacity style={[styles.row, { borderBottomColor: theme.border }]} onPress={handleExport}>
          <View style={styles.textWrap}>
            <Title color={theme.text} style={{ fontSize: 16, marginBottom: 4 }}>Export Data</Title>
            <Body color={theme.textSecondary}>Download habit history.</Body>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.row, { borderBottomColor: theme.border, borderBottomWidth: 1 }]} onPress={handleDeleteData}>
          <View style={styles.textWrap}>
            <Title color={theme.danger} style={{ fontSize: 16, marginBottom: 4 }}>
              {isRealUser ? "Delete Account & Data" : "Delete All Data"}
            </Title>
            <Body color={theme.textSecondary}>
              {isRealUser ? "Erase account and device data." : "Erase all from device."}
            </Body>
          </View>
        </TouchableOpacity>

        <Title color={theme.text} style={{ marginTop: 32, marginBottom: 12 }}>Account</Title>
        <TouchableOpacity 
          style={[styles.row, { borderBottomWidth: 1, borderBottomColor: theme.border }]} 
          onPress={() => {
            showPopup(
              "Log Out",
              "Are you sure you want to log out of your account?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Log Out", style: "destructive", onPress: logout }
              ]
            );
          }}
        >
          <View style={styles.textWrap}>
            <Title color={theme.danger} style={{ fontSize: 16, marginBottom: 4 }}>Log Out</Title>
            <Body color={theme.textSecondary}>Sign out of your account.</Body>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 50,
  },
  content: { padding: 24, paddingBottom: 100 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  textWrap: { flex: 1, paddingRight: 10 },
  segmentContainer: { flexDirection: 'row', borderRadius: 8, borderWidth: 1, overflow: 'hidden' },
  segmentButton: { flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1 },
  segmentText: { fontSize: 14, fontWeight: '700' },
  profileCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
});

