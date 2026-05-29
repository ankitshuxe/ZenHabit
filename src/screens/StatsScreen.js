import React from 'react';
import { View, StyleSheet, ScrollView, Platform, StatusBar as RNStatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHabitStore } from '../store/useHabitStore';
import { Flame, Star } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import HabitDetailModal from '../components/HabitDetailModal';
import { Heading, Title, Body, Caption } from '../components/Typography';
import { IconMap } from '../components/IconMap';

export default function StatsScreen({ theme }) {
  const [selectedDetailHabitId, setSelectedDetailHabitId] = React.useState(null);
  const insets = useSafeAreaInsets();
  const habits = useHabitStore((state) => state.habits);

  const totalCompletions = habits.reduce((acc, h) => acc + (h.totalCompletions || 0), 0);
  const bestStreak = Math.max(...habits.map(h => h.bestStreak || 0), 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: Math.max(insets.top, 20) }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Heading color={theme.text} style={{ marginBottom: 24, marginTop: 10 }}>Statistics</Heading>
        
        <View style={styles.statsHeaderRow}>
          <View style={[styles.growthChip, { backgroundColor: theme.card }]}>
            <Caption color={theme.textSecondary} style={{ marginBottom: 12 }}>BEST STREAK</Caption>
            <View style={styles.streakBadge}>
              <Heading color="#F3EFE9" style={{ fontSize: 36, letterSpacing: -1 }}>{bestStreak}</Heading>
              <Flame color={theme.tags?.Patience || theme.danger} size={28} fill={theme.tags?.Patience || theme.danger} strokeWidth={0} />
            </View>
          </View>
          
          <View style={[styles.growthChip, { backgroundColor: theme.card }]}>
            <Caption color={theme.textSecondary} style={{ marginBottom: 12 }}>TOTAL DONE</Caption>
            <View style={styles.streakBadge}>
              <Heading color="#F3EFE9" style={{ fontSize: 36, letterSpacing: -1 }}>{totalCompletions}</Heading>
              <Star color={theme.tags?.Consistency || theme.primary} size={28} fill={theme.tags?.Consistency || theme.primary} strokeWidth={0} />
            </View>
          </View>
        </View>

        <Title color={theme.text} style={{ marginBottom: 16 }}>Habit Performance</Title>
        {habits.map(habit => {
          const streak = habit.currentStreak || 0;
          const isBreak = habit.goalType === 'break';
          const IconComp = IconMap[habit.icon] || IconMap['Activity'];
          
          return (
            <TouchableOpacity 
              key={habit.id} 
              style={[
                styles.habitRow, 
                { borderBottomColor: theme.border },
                isBreak && { backgroundColor: theme.danger + '08' }
              ]}
              onPress={() => setSelectedDetailHabitId(habit.id)}
              activeOpacity={0.7}
            >
              <View style={styles.titleRow}>
                <IconComp color={isBreak ? theme.danger : theme.text} size={18} style={{ marginRight: 10 }} strokeWidth={2.5} />
                <View>
                  <Title color={isBreak ? theme.danger : theme.text} style={{ fontSize: 16, marginBottom: 4 }}>{habit.name}</Title>
                  <Caption color={theme.textSecondary}>{isBreak ? 'Break' : 'Build'} habit</Caption>
                </View>
              </View>
              <View style={styles.habitScore}>
                <Flame color={isBreak ? theme.danger : (theme.tags?.Patience || theme.primary)} size={16} />
                <Heading color={isBreak ? theme.danger : (theme.tags?.Patience || theme.primary)} style={{ fontSize: 16 }}>{streak}</Heading>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <HabitDetailModal 
        visible={!!selectedDetailHabitId} 
        onClose={() => setSelectedDetailHabitId(null)} 
        habitId={selectedDetailHabitId} 
        theme={theme} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 50,
  },
  scroll: { padding: 24, paddingBottom: 100 },
  statsHeaderRow: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  growthChip: { flex: 1, paddingVertical: 20, paddingHorizontal: 20, borderRadius: 16 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  habitRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 16, 
    borderBottomWidth: 1,
    paddingHorizontal: 8,
    marginHorizontal: -8,
    borderRadius: 8
  },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  habitScore: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
