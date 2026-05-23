import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useHabitStore } from '../store/useHabitStore';
import { X } from 'lucide-react-native';

export default function AddHabitModal({ visible, onClose, theme }) {
  const addHabit = useHabitStore((state) => state.addHabit);
  const [name, setName] = useState('');
  const [type, setType] = useState('checkoff'); // 'checkoff' or 'target'
  const [target, setTarget] = useState('1');
  const [unit, setUnit] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;

    addHabit({
      name,
      type,
      icon: 'Star', // Default icon for now
      color: '#8b5cf6', // Purple default
      target: type === 'target' ? parseInt(target, 10) || 1 : null,
      unit: type === 'target' ? unit : null,
    });
    
    setName('');
    setType('checkoff');
    setTarget('1');
    setUnit('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.modalOverlay}
      >
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>New Habit</Text>
            <TouchableOpacity onPress={onClose}>
              <X color={theme.textSecondary} size={24} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            placeholder="Habit Name"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
          />

          <View style={styles.typeSelector}>
            <TouchableOpacity 
              style={[
                styles.typeBtn, 
                { borderColor: theme.border },
                type === 'checkoff' && { backgroundColor: theme.primary, borderColor: theme.primary }
              ]}
              onPress={() => setType('checkoff')}
            >
              <Text style={{ color: type === 'checkoff' ? '#fff' : theme.text }}>Check-off</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.typeBtn, 
                { borderColor: theme.border, marginLeft: 10 },
                type === 'target' && { backgroundColor: theme.primary, borderColor: theme.primary }
              ]}
              onPress={() => setType('target')}
            >
              <Text style={{ color: type === 'target' ? '#fff' : theme.text }}>Target</Text>
            </TouchableOpacity>
          </View>

          {type === 'target' && (
            <View style={styles.targetRow}>
              <TextInput
                style={[styles.input, styles.targetInput, { color: theme.text, borderColor: theme.border }]}
                placeholder="Target (e.g. 3)"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
                value={target}
                onChangeText={setTarget}
              />
              <TextInput
                style={[styles.input, styles.unitInput, { color: theme.text, borderColor: theme.border }]}
                placeholder="Unit (e.g. litres)"
                placeholderTextColor={theme.textSecondary}
                value={unit}
                onChangeText={setUnit}
              />
            </View>
          )}

          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.primary }]} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Habit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  targetRow: {
    flexDirection: 'row',
  },
  targetInput: {
    flex: 1,
    marginRight: 10,
  },
  unitInput: {
    flex: 2,
  },
  saveBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});
