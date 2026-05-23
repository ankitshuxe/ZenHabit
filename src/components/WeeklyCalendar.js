import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { startOfWeek, addDays, format, isSameDay } from 'date-fns';

export default function WeeklyCalendar({ selectedDate, onSelectDate, theme }) {
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 }); // Sunday
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [selectedDate]);

  return (
    <View style={[styles.container, { borderBottomColor: theme.border }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <TouchableOpacity 
              key={day.toISOString()} 
              style={[
                styles.dayContainer, 
                isSelected && [styles.selectedDay, { backgroundColor: theme.primary }]
              ]}
              onPress={() => onSelectDate(day)}
            >
              <Text style={[
                styles.dayName, 
                { color: isSelected ? '#FFFFFF' : theme.textSecondary }
              ]}>
                {format(day, 'EEE')}
              </Text>
              <Text style={[
                styles.dayNumber, 
                { color: isSelected ? '#FFFFFF' : theme.text }
              ]}>
                {format(day, 'd')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  scrollContent: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 60,
    borderRadius: 12,
  },
  selectedDay: {
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});
