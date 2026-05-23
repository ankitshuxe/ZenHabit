import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useHabitStore } from '../store/useHabitStore';
import WeeklyCalendar from '../components/WeeklyCalendar';
import HabitCard from '../components/HabitCard';
import { format } from 'date-fns';
import AddHabitModal from '../components/AddHabitModal';

export default function HomeScreen({ theme, colorScheme }) {
  const habits = useHabitStore((state) => state.habits);
  const toggleCompletion = useHabitStore((state) => state.toggleCompletion);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalVisible, setModalVisible] = useState(false);

  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Habito</Text>
      </View>
      
      <WeeklyCalendar 
        selectedDate={selectedDate} 
        onSelectDate={setSelectedDate} 
        theme={theme} 
      />

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <HabitCard 
            habit={item} 
            theme={theme} 
            dateStr={dateStr}
            onToggle={() => toggleCompletion(item.id, dateStr)}
          />
        )}
      />

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: theme.fab }]}
        onPress={() => setModalVisible(true)}
      >
        <Plus color={theme.fabIcon} size={28} />
      </TouchableOpacity>

      <AddHabitModal 
        visible={isModalVisible} 
        onClose={() => setModalVisible(false)} 
        theme={theme} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
});
