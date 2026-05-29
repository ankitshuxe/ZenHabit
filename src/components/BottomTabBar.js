import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { Home, BarChart2, Settings, Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BottomTabBar({ activeTab, setActiveTab, theme, onAddPress }) {
  const insets = useSafeAreaInsets();
  const tabs = [
    { id: 'Home', label: 'Home', Icon: Home },
    { id: 'Stats', label: 'Stats', Icon: BarChart2 },
    { id: 'Settings', label: 'Settings', Icon: Settings },
  ];

  return (
    <View style={{ backgroundColor: theme.background, paddingBottom: Math.max(insets.bottom, 10) }}>
      <View style={[styles.tabBar, { backgroundColor: theme.background, borderTopWidth: 0 }]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const color = isActive ? (theme.accent || theme.danger) : theme.textSecondary;

          return (
            <TouchableOpacity 
              key={tab.id} 
              onPress={() => setActiveTab(tab.id)} 
              style={styles.tabItem}
            >
              <tab.Icon color={color} size={24} strokeWidth={isActive ? 2.5 : 1.5} />
              {isActive && <Text style={[styles.tabLabel, { color }]}>{tab.label}</Text>}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: theme.primary }]} 
          onPress={onAddPress}
          activeOpacity={0.8}
        >
          <Plus color={theme.primaryText} size={28} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 70,
    paddingHorizontal: 20,
    paddingTop: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 24
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    right: 24,
    top: -24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
