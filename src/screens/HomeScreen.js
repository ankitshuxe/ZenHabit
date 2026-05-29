import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Platform, StatusBar as RNStatusBar, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHabitStore } from '../store/useHabitStore';
import HabitCard from '../components/HabitCard';
import BottomSheet from '../components/BottomSheet';
import Button from '../components/Button';
import { Heading, Subheading, Title, Body, Caption } from '../components/Typography';
import { Trash2, Flame, Pencil } from 'lucide-react-native';
import { format } from 'date-fns';

export default function HomeScreen({ theme }) {
  const insets = useSafeAreaInsets();
  const userName = useHabitStore((state) => state.userName);
  const habits = useHabitStore((state) => state.habits);
  const toggleCompletion = useHabitStore((state) => state.toggleCompletion);
  const deleteHabit = useHabitStore((state) => state.deleteHabit);
  const setUserName = useHabitStore((state) => state.setUserName);
  const openHabitModal = useHabitStore((state) => state.openHabitModal);
  
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  const displayDate = format(new Date(), 'EEEE, MMM d').toUpperCase();

  const handleDelete = () => {
    if (selectedHabitId) {
      deleteHabit(selectedHabitId);
      setSelectedHabitId(null);
    }
  };

  const handleEdit = () => {
    if (selectedHabitId) {
      openHabitModal(selectedHabitId);
      setSelectedHabitId(null);
    }
  };

  const handleToggle = React.useCallback((id) => {
    toggleCompletion(id, dateStr);
  }, [dateStr, toggleCompletion]);

  const handleLongPress = React.useCallback((id) => {
    setSelectedHabitId(id);
  }, []);

  const completedToday = habits.filter(h => (h.completions[dateStr] || 0) > 0).length;
  const totalStreak = habits.reduce((acc, h) => acc + (h.currentStreak || 0), 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: Math.max(insets.top, 20) }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Heading color={theme.text} style={{ marginBottom: -4 }}>Morning,</Heading>
          {isEditingName ? (
            <TextInput
              style={[styles.nameInput, { color: theme.text, borderBottomColor: theme.border, fontSize: 28, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontStyle: 'italic' }]}
              value={userName}
              onChangeText={setUserName}
              autoFocus
              onBlur={() => {
                if (!userName || !userName.trim()) setUserName('Guest');
                setIsEditingName(false);
              }}
              onSubmitEditing={() => {
                if (!userName || !userName.trim()) setUserName('Guest');
                setIsEditingName(false);
              }}
              returnKeyType="done"
            />
          ) : (
            <TouchableOpacity style={styles.nameWrap} onPress={() => setIsEditingName(true)}>
              <Subheading color={theme.text}>{userName}.</Subheading>
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.growthChip, { backgroundColor: theme.card }]}>
          <Caption color={theme.textSecondary} style={{ marginBottom: 12 }}>TOTAL STREAK • FIRE</Caption>
          <View style={styles.streakBadge}>
            <Heading color={theme.primaryText} style={{ fontSize: 56, letterSpacing: -2 }}>{totalStreak}</Heading>
            <Flame color={theme.accent || theme.danger} size={36} fill={theme.accent || theme.danger} strokeWidth={0} />
          </View>
        </View>
      </View>
      
      <View style={styles.listHeader}>
        <Title color={theme.text}>Habits</Title>
        {habits.length > 0 && (
          <Body color={theme.textSecondary}>
            {completedToday}/{habits.length}
          </Body>
        )}
      </View>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <HabitCard 
            habit={item} 
            theme={theme} 
            dateStr={dateStr}
            onToggle={handleToggle}
            onLongPress={handleLongPress}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Title color={theme.text} style={{ marginBottom: 12 }}>Blank Slate</Title>
            <Body color={theme.textSecondary} style={{ textAlign: 'center' }}>
              No habits defined yet. Start small.
            </Body>
          </View>
        }
      />

      <BottomSheet 
        visible={!!selectedHabitId} 
        onClose={() => setSelectedHabitId(null)} 
        theme={theme}
      >
        <Title color={theme.text} style={{ marginBottom: 20 }}>Habit Options</Title>
        
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button 
            title="Edit" 
            onPress={handleEdit} 
            theme={theme} 
            variant="outline" 
            style={{ flex: 1 }}
          />
          <Button 
            title="Delete" 
            onPress={handleDelete} 
            theme={theme} 
            variant="danger" 
            style={{ flex: 1 }}
          />
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 24,
  },
  titleRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  nameInput: {
    borderBottomWidth: 1,
    padding: 0,
    minWidth: 150,
  },
  nameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growthChip: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  }
});
