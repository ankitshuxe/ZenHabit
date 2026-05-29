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

export default function AddHabitModal({ visible, onClose, theme, habitId }) {
  const addHabit = useHabitStore((state) => state.addHabit);
  const updateHabit = useHabitStore((state) => state.updateHabit);
  const habits = useHabitStore((state) => state.habits);
  
  const [goalType, setGoalType] = useState('Build habit');
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Activity');
  const [tags, setTags] = useState([]);
  const [everyDay, setEveryDay] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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
        }
      } else {
        setName('');
        setGoalType('Build habit');
        setIcon('Activity');
        setTags([]);
        setStartDate(new Date());
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

  const handleSave = () => {
    if (!name.trim()) return;

    const payload = {
      name,
      goalType: goalType === 'Build habit' ? 'build' : 'break',
      icon, 
      tags,
      startDate: startDate.toISOString(),
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
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setStartDate(selectedDate);
              }
            }}
          />
        )}

        <View style={styles.row}>
          <Caption style={{ color: theme.textSecondary }}>Every day</Caption>
          <Toggle value={everyDay} onValueChange={setEveryDay} theme={theme} />
        </View>

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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 20,
    marginBottom: 40
  }
});
