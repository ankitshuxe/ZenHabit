import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Icons from 'lucide-react-native';

export default function HabitCard({ habit, theme, dateStr, onToggle }) {
  const IconComponent = Icons[habit.icon] || Icons.Activity;
  const current = habit.completions[dateStr] || 0;
  
  let isCompleted = false;
  let statusText = '';
  
  if (habit.type === 'checkoff') {
    isCompleted = current > 0;
    statusText = isCompleted ? 'Completed today' : 'Pending';
  } else {
    isCompleted = current >= habit.target;
    statusText = `${current}/${habit.target} ${habit.unit}`;
  }

  // Calculate streak
  // A simple implementation: just counting total completions across all days for now
  const totalDays = Object.values(habit.completions).reduce((sum, val) => {
    if (habit.type === 'checkoff') return sum + (val > 0 ? 1 : 0);
    return sum + (val >= habit.target ? 1 : 0);
  }, 0);

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]} 
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: habit.color + '20' }]}>
        <IconComponent color={habit.color} size={24} />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.name, { color: theme.text }]}>{habit.name}</Text>
        <Text style={[styles.status, { color: theme.textSecondary }]}>
          {statusText} • Total Days: {totalDays}
        </Text>
      </View>

      <View style={[
        styles.checkbox, 
        { borderColor: theme.border },
        isCompleted && { backgroundColor: habit.color, borderColor: habit.color }
      ]}>
        {isCompleted && <Icons.Check color="#FFF" size={16} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  status: {
    fontSize: 13,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  }
});
