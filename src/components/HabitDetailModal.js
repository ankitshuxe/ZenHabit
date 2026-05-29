import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Text } from 'react-native';
import { X, ChevronDown } from 'lucide-react-native';
import { IconMap } from './IconMap';
import { subDays, startOfWeek, eachDayOfInterval, format, startOfMonth, subMonths, isSameMonth } from 'date-fns';
import BottomSheet from './BottomSheet';
import SegmentedControl from './SegmentedControl';
import { useHabitStore } from '../store/useHabitStore';
import { Heading, Title, Body, Caption } from './Typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HabitDetailModal({ visible, onClose, habitId, theme }) {
  const habits = useHabitStore((state) => state.habits);
  const habit = habits.find(h => h.id === habitId);
  const [range, setRange] = useState('Year');
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  
  // Animation value for the chevron rotation
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isHistoryExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isHistoryExpanded]);

  const IconComponent = IconMap[habit?.icon] || IconMap.Activity;
  const isBreak = habit?.goalType === 'break';
  const accentColor = isBreak ? theme.danger : (theme.tags?.Consistency || theme.primary);

  // Generate Calendar Days
  const today = new Date();
  const daysToGenerate = range === 'Week' ? 7 : range === 'Month' ? 30 : 365;
  const startDate = startOfWeek(subDays(today, daysToGenerate - 1));
  const days = eachDayOfInterval({ start: startDate, end: today });

  // Stats
  const totalDays = habit?.totalCompletions || 0;
  // Simple completion % based on days since created (fallback to 1 if just created)
  const daysSinceCreated = Math.max(1, Math.floor((today - new Date(habit?.createdAt || today)) / (1000 * 60 * 60 * 24)));
  const completionPercent = Math.min(100, Math.round((totalDays / daysSinceCreated) * 100));

  // Generate Last 6 Months for History
  const historyMonths = Array.from({ length: 6 }).map((_, i) => startOfMonth(subMonths(today, i)));

  const dayStreaks = React.useMemo(() => {
    if (!habit) return {};
    const streaks = {};
    const dates = Object.keys(habit.completions).sort();
    let tempStreak = 0;
    let prevDate = null;
    for (let i = 0; i < dates.length; i++) {
      const dStr = dates[i];
      const d = new Date(dStr);
      if (!prevDate) {
        tempStreak = 1;
      } else {
        const diff = Math.round((d - prevDate) / 86400000);
        if (diff === 1) tempStreak++;
        else if (diff > 1) tempStreak = 1;
      }
      streaks[dStr] = tempStreak;
      prevDate = d;
    }
    return streaks;
  }, [habit]);

  const heatmapGrid = React.useMemo(() => {
    if (!habit) return null;
    return days.map((day, i) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const isCompleted = habit.completions[dateStr] > 0;
      return (
        <View 
          key={dateStr} 
          style={[
            styles.dayBox, 
            { backgroundColor: isCompleted ? accentColor : (theme.border + '80') } // softer background for empty boxes
          ]} 
        />
      );
    });
  }, [days, habit, accentColor, theme.border]);

  if (!habit) return null;

  return (
    <BottomSheet visible={visible} onClose={onClose} theme={theme}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="always">
        
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { borderColor: theme.border }]}>
            <X color={theme.text} size={20} />
          </TouchableOpacity>
          <View style={styles.segmentWrap}>
            <SegmentedControl options={['Week', 'Month', 'Year']} selected={range} onSelect={setRange} theme={theme} />
          </View>
        </View>

        <Title color={theme.text} style={{ marginBottom: 16 }}>Stats</Title>
        
        <View style={styles.flatCard}>
          <View style={styles.habitHeader}>
            <View style={[styles.iconWrap, { backgroundColor: 'transparent' }]}>
              <IconComponent color={accentColor} size={24} strokeWidth={2.5} />
            </View>
            <View>
              <Heading color={theme.text} style={{ fontSize: 24, marginBottom: 4 }}>{habit.name}</Heading>
              <Caption color={theme.textSecondary}>
                GOAL: {isBreak ? 'AVOID DAILY' : '1 TIME A DAY'}
              </Caption>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statBox, { borderRightWidth: 1, borderRightColor: theme.border }]}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Heading color={theme.text} style={{ fontSize: 28, marginRight: 4 }}>{totalDays}</Heading>
                <Body color={theme.textSecondary}>days</Body>
              </View>
              <Caption color={theme.textSecondary}>FINISHED</Caption>
            </View>
            <View style={[styles.statBox, { paddingLeft: 24 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Heading color={theme.text} style={{ fontSize: 28, marginRight: 4 }}>{completionPercent}</Heading>
                <Body color={theme.textSecondary}>%</Body>
              </View>
              <Caption color={theme.textSecondary}>COMPLETED</Caption>
            </View>
          </View>

          {/* Heatmap */}
          <View style={styles.heatmapContainer}>
            <View style={styles.yAxis}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <Caption key={i} color={theme.textSecondary} style={styles.yAxisLabel}>{day}</Caption>
              ))}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
              <View style={styles.grid}>
                {heatmapGrid}
              </View>
            </ScrollView>
          </View>

          <View style={styles.legend}>
            <Caption color={theme.textSecondary}>LESS</Caption>
            <View style={[styles.legendBox, { backgroundColor: theme.border + '80' }]} />
            <View style={[styles.legendBox, { backgroundColor: accentColor, opacity: 0.5 }]} />
            <View style={[styles.legendBox, { backgroundColor: accentColor }]} />
            <Caption color={theme.textSecondary}>MORE</Caption>
          </View>
        </View>

        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 32, marginBottom: 16 }}
          onPress={() => setIsHistoryExpanded(!isHistoryExpanded)}
          activeOpacity={0.7}
        >
          <Title color={theme.text} style={{ marginBottom: 0 }}>History</Title>
          <Animated.View style={{ 
            transform: [{ 
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg']
              }) 
            }] 
          }}>
            <ChevronDown color={theme.textSecondary} size={24} />
          </Animated.View>
        </TouchableOpacity>

        {isHistoryExpanded && (
          <View style={[styles.flatCard, { marginTop: 0 }]}>
            {historyMonths.map((monthDate, index) => {
              const mStr = format(monthDate, 'MMM yyyy').toUpperCase();
              const daysInMonth = eachDayOfInterval({ start: monthDate, end: new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0) });
              const completedInMonth = daysInMonth.filter(d => habit.completions[format(d, 'yyyy-MM-dd')]).length;
              
              // Accurate best streak calc for this month (cross-month bounds handled)
              let bestStreak = 0;
              daysInMonth.forEach(d => {
                const dStr = format(d, 'yyyy-MM-dd');
                if (dayStreaks[dStr]) {
                  bestStreak = Math.max(bestStreak, dayStreaks[dStr]);
                }
              });

              return (
                <View key={mStr} style={[styles.historyRow, index !== historyMonths.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
                  <Caption color={theme.textSecondary} style={{ marginBottom: 12 }}>{mStr}</Caption>
                  <View style={styles.historyStats}>
                    <View style={styles.historyStatBox}>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 }}>
                        <Title color={theme.text} style={{ fontSize: 20, marginRight: 4 }}>{completedInMonth}</Title>
                        <Body color={theme.textSecondary}>days</Body>
                      </View>
                      <Caption color={theme.textSecondary}>TOTAL COMPLETED</Caption>
                    </View>
                    <View style={styles.historyStatBox}>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 }}>
                        <Title color={theme.text} style={{ fontSize: 20, marginRight: 4 }}>{bestStreak}</Title>
                        <Body color={theme.textSecondary}>days</Body>
                      </View>
                      <Caption color={theme.textSecondary}>BEST STREAK</Caption>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  closeBtn: { width: 44, height: 44, borderRadius: 8, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  segmentWrap: { flex: 1, marginLeft: 16, marginTop: 20 },
  flatCard: { paddingBottom: 16, marginBottom: 16 },
  habitHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  iconWrap: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  statsRow: { flexDirection: 'row', marginBottom: 32, borderBottomWidth: 1, borderBottomColor: 'transparent' },
  statBox: { flex: 1, paddingBottom: 16 },
  heatmapContainer: { flexDirection: 'row', marginTop: 10, marginBottom: 16 },
  yAxis: { justifyContent: 'space-between', paddingRight: 12, height: 7 * 16 }, // 7 rows * 16px height
  yAxisLabel: { height: 16, lineHeight: 16, fontSize: 10 },
  grid: { flexDirection: 'column', flexWrap: 'wrap', height: 7 * 16, alignContent: 'flex-start' },
  dayBox: { width: 12, height: 12, margin: 2, borderRadius: 2 },
  legend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  legendBox: { width: 12, height: 12, borderRadius: 2 },
  historyRow: { paddingVertical: 20 },
  historyStats: { flexDirection: 'row', gap: 40 },
  historyStatBox: { flex: 1 },
});
