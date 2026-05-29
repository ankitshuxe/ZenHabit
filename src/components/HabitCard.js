import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Title, Caption } from './Typography';
import { IconMap } from './IconMap';

function HabitCard({ habit, theme, dateStr, onToggle, onLongPress }) {
  const current = habit.completions[dateStr] || 0;
  const isCompleted = current > 0;
  const streak = habit.currentStreak || 0;
  const isBreak = habit.goalType === 'break';
  const IconComp = IconMap[habit.icon] || IconMap['Activity'];

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { borderBottomColor: theme.border },
        isBreak && !isCompleted && { backgroundColor: theme.danger + '08' } // very subtle red tint for break habits
      ]} 
      activeOpacity={0.7}
      onLongPress={() => onLongPress(habit.id)}
      onPress={() => onToggle(habit.id)}
    >
      <View style={styles.leftGroup}>
        <View style={styles.titleRow}>
          <IconComp color={isBreak ? theme.danger : theme.text} size={18} style={{ marginRight: 10, opacity: isCompleted ? 0.5 : 1 }} strokeWidth={2.5} />
          <Title style={[styles.name, { color: isBreak ? theme.danger : theme.text, opacity: isCompleted ? 0.5 : 1, textDecorationLine: isCompleted ? 'line-through' : 'none' }]}>
            {habit.name}
          </Title>
        </View>
        <Caption style={{ color: theme.textSecondary, marginLeft: 28 }}>
          STREAK • {streak} {streak === 1 ? 'DAY' : 'DAYS'}
        </Caption>
      </View>

      <View style={styles.rightGroup}>
        {isCompleted ? (
          <View style={[styles.badge, { backgroundColor: isBreak ? theme.danger : theme.accent }]}>
            <Caption style={styles.badgeText}>{isBreak ? 'RESISTED' : 'DONE'}</Caption>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(HabitCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    paddingHorizontal: 8,
    marginHorizontal: -8, // compensate for padding to keep alignment
    borderRadius: 8,
  },
  leftGroup: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
  }
});
