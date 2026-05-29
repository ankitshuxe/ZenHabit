import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useHabitStore } from '../store/useHabitStore';
import BottomSheet from './BottomSheet';
import Button from './Button';
import SegmentedControl from './SegmentedControl';
import TagSelector from './TagSelector';
import IconSelector from './IconSelector';
import Toggle from './Toggle';
import { Title, Body, Caption } from './Typography';
import { format } from 'date-fns';
import * as Notifications from 'expo-notifications';

export default function AddHabitModal({ visible, onClose, theme, habitId }) {
  const addHabit = useHabitStore((state) => state.addHabit);
  const updateHabit = useHabitStore((state) => state.updateHabit);
  const habits = useHabitStore((state) => state.habits);
  
  const [goalType, setGoalType] = useState('Build habit');
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Activity');
  const [tags, setTags] = useState([]);
  const [everyDay, setEveryDay] = useState(true);
  const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4, 5, 6]); // 0 = Sunday, 1 = Monday
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Initialize or reset form when modal visibility or habitId changes
  useEffect(() => {
    if (visible) {
      if (habitId) {
        const habitToEdit = habits.find(h => h.id === habitId);
        if (habitToEdit) {
          setName(habitToEdit.name);
          setGoalType(habitToEdit.goalType === 'break' ? 'Break habit' : 'Build habit');
          setIcon(habitToEdit.icon);
          setTags(habitToEdit.tags || []);
          setStartDate(new Date(habitToEdit.startDate || Date.now()));
          
          if (habitToEdit.frequency && habitToEdit.frequency.type === 'weekly') {
            setEveryDay(false);
            setSelectedDays(habitToEdit.frequency.days || []);
          } else {
            setEveryDay(true);
          }
          
          if (habitToEdit.reminderTime) {
            setReminderEnabled(true);
            setReminderTime(new Date(habitToEdit.reminderTime));
          } else {
            setReminderEnabled(false);
          }
        }
      } else {
        setName('');
        setGoalType('Build habit');
        setIcon('Activity');
        setTags([]);
        setStartDate(new Date());
        setEveryDay(true);
        setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
        setReminderEnabled(false);
        setReminderTime(new Date());
      }
    }
  }, [visible, habitId]);

  useEffect(() => {
    // Only auto-switch icon if we are NOT editing, to avoid overwriting their saved icon
    if (!habitId) {
      setIcon(goalType === 'Break habit' ? 'Wine' : 'Activity');
    }
  }, [goalType]);

  const handleToggleTag = (tag) => {
    if (tags.includes(tag)) setTags(tags.filter(t => t !== tag));
    else setTags([...tags, tag]);
  };

  const handleToggleDay = (dayIndex) => {
    if (selectedDays.includes(dayIndex)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(d => d !== dayIndex));
      }
    } else {
      setSelectedDays([...selectedDays, dayIndex].sort());
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    
    // Request notification permissions if reminder is enabled
    if (reminderEnabled && Platform.OS !== 'web') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Please enable notifications in settings to receive reminders.');
        setReminderEnabled(false);
        return;
      }
    }

    const payload = {
      name,
      goalType: goalType === 'Build habit' ? 'build' : 'break',
      icon, 
      tags,
      startDate: startDate.toISOString(),
      frequency: everyDay ? { type: 'daily' } : { type: 'weekly', days: selectedDays },
      reminderTime: reminderEnabled ? reminderTime.toISOString() : null,
    };

    if (habitId) {
      updateHabit(habitId, payload);
    } else {
      addHabit(payload);
    }
    
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} theme={theme}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
        <SegmentedControl 
          options={['Build habit', 'Break habit']} 
          selected={goalType} 
          onSelect={setGoalType} 
          theme={theme} 
        />

        <Caption style={[styles.label, { color: theme.textSecondary }]}>Name</Caption>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          placeholder={goalType === 'Break habit' ? "Smoking, junk food, etc." : "Read for 30m, code, etc."}
          placeholderTextColor={theme.textSecondary}
          value={name}
          onChangeText={setName}
        />

        {goalType === 'Break habit' && (
          <Body style={{ fontSize: 12, color: theme.danger, marginTop: 8 }}>
            Break habits are marked in red. The goal is to avoid doing them.
          </Body>
        )}
        
        <IconSelector selectedIcon={icon} onSelectIcon={setIcon} theme={theme} isBreak={goalType === 'Break habit'} />

        <Caption style={[styles.label, { color: theme.textSecondary }]}>Start date</Caption>
        <TouchableOpacity style={[styles.input, { borderColor: theme.border, justifyContent: 'center' }]} onPress={() => setShowDatePicker(true)}>
          <Body style={{ color: theme.text, fontSize: 16 }}>
            {format(startDate, 'MMMM d, yyyy')}
          </Body>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onValueChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setStartDate(selectedDate);
              }
            }}
            onDismiss={() => setShowDatePicker(Platform.OS === 'ios')}
          />
        )}

        <View style={styles.row}>
          <Caption style={{ color: theme.textSecondary }}>Every day</Caption>
          <Toggle value={everyDay} onValueChange={setEveryDay} theme={theme} />
        </View>

        {!everyDay && (
          <View style={styles.daysRow}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayChar, i) => (
              <TouchableOpacity 
                key={i}
                style={[styles.dayCircle, selectedDays.includes(i) ? { backgroundColor: theme.primary, borderColor: theme.primary } : { borderColor: theme.border }]}
                onPress={() => handleToggleDay(i)}
              >
                <Body style={{ color: selectedDays.includes(i) ? theme.primaryText : theme.textSecondary, fontWeight: 'bold' }}>{dayChar}</Body>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.row}>
          <Caption style={{ color: theme.textSecondary }}>Daily Reminder</Caption>
          <Toggle value={reminderEnabled} onValueChange={setReminderEnabled} theme={theme} />
        </View>

        {reminderEnabled && (
          <TouchableOpacity style={[styles.input, { borderColor: theme.border, justifyContent: 'center', marginBottom: 16 }]} onPress={() => setShowTimePicker(true)}>
            <Body style={{ color: theme.text, fontSize: 16 }}>
              {format(reminderTime, 'h:mm a')}
            </Body>
          </TouchableOpacity>
        )}

        {showTimePicker && (
          <DateTimePicker
            value={reminderTime}
            mode="time"
            display="default"
            onValueChange={(event, selectedDate) => {
              setShowTimePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setReminderTime(selectedDate);
              }
            }}
            onDismiss={() => setShowTimePicker(Platform.OS === 'ios')}
          />
        )}

        <TagSelector selectedTags={tags} onToggleTag={handleToggleTag} theme={theme} />

        <View style={styles.footer}>
          <Button 
            title="Cancel" 
            onPress={onClose} 
            theme={theme} 
            variant="outline" 
            style={{ flex: 1 }}
          />
          <Button 
            title={habitId ? "Save" : "Add"} 
            onPress={handleSave} 
            theme={theme} 
            variant="primary" 
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 8, marginTop: 16 },
  input: {
    borderBottomWidth: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '800', // Making input bolder to match aesthetic
    height: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 20,
    marginBottom: 40
  }
});
