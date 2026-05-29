import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { IconMap } from './IconMap';
import { Caption } from './Typography';

const BUILD_ICONS = [
  'Activity', 'Star', 'Heart', 'Smile', 'Book', 'Code', 'Apple', 'Sun', 
  'Briefcase', 'Camera', 'Car', 'Plane', 'Droplets', 'Dumbbell', 'Target', 'Trophy'
];

const BREAK_ICONS = [
  'Wine', 'Coffee', 'Pizza', 'Gamepad2', 'Smartphone', 'Tv', 'Cigarette', 'Pill', 'Cake', 'Moon', 'Flame', 'Ban', 'XCircle'
];

export default function IconSelector({ selectedIcon, onSelectIcon, theme, isBreak }) {
  const iconsToUse = isBreak ? BREAK_ICONS : BUILD_ICONS;

  return (
    <View style={styles.container}>
      <Caption style={[styles.label, { color: theme.textSecondary }]}>Icon</Caption>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {iconsToUse.map(iconName => {
          // Fallback just in case iconName doesn't exist
          const IconComp = IconMap[iconName] || IconMap['Activity'];
          const isSelected = selectedIcon === iconName;
          
          return (
            <TouchableOpacity 
              key={iconName}
              style={[
                styles.iconBtn,
                { 
                  backgroundColor: isSelected ? theme.primary : 'transparent',
                  borderColor: isSelected ? theme.primary : theme.border
                }
              ]}
              onPress={() => onSelectIcon(iconName)}
            >
              <IconComp color={isSelected ? theme.primaryText : theme.text} size={24} strokeWidth={2} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  label: { marginBottom: 8, marginTop: 16 },
  scroll: { gap: 12, paddingVertical: 4 },
  iconBtn: {
    padding: 12,
    borderRadius: 8, // Flatten from 16 to 8
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
