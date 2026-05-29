import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { startOfWeek, addDays, format, isSameDay } from 'date-fns';
import { Caption, Title } from './Typography';

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
              style={styles.dayContainer}
              onPress={() => onSelectDate(day)}
            >
              <Caption style={[
                styles.dayName, 
                { color: isSelected ? theme.primary : theme.textSecondary }
              ]}>
                {format(day, 'EEE')}
              </Caption>
              <Title style={[
                styles.dayNumber, 
                { color: isSelected ? (theme.accent || theme.danger) : theme.textSecondary },
                isSelected && { fontSize: 22, fontWeight: '900' }
              ]}>
                {format(day, 'd')}
              </Title>
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
    borderBottomWidth: 0,
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
  },
  dayName: {
    marginBottom: 6,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
  }
});
