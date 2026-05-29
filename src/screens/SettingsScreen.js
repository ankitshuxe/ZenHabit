import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHabitStore } from '../store/useHabitStore';
import { Heading, Title, Body, Caption } from '../components/Typography';

export default function SettingsScreen({ theme }) {
  const insets = useSafeAreaInsets();
  const clearAllData = useHabitStore((state) => state.clearAllData);
  const themePreference = useHabitStore((state) => state.themePreference);
  const setThemePreference = useHabitStore((state) => state.setThemePreference);
  const setLoggedIn = useHabitStore((state) => state.setLoggedIn);
  const showPopup = useHabitStore((state) => state.showPopup);

  const handleDeleteData = () => {
    showPopup(
      "Delete All Data",
      "Are you sure you want to erase all your habits and history? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: clearAllData }
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
            <Title color={theme.danger} style={{ fontSize: 16, marginBottom: 4 }}>Delete All Data</Title>
            <Body color={theme.textSecondary}>Erase all from device.</Body>
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
                { text: "Log Out", style: "destructive", onPress: () => setLoggedIn(false) }
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
});

