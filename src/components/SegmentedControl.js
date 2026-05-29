import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Title } from './Typography';

export default function SegmentedControl({ options, selected, onSelect, theme }) {
  return (
    <View style={[styles.container, { backgroundColor: theme.background, borderColor: theme.border }]}>
      {options.map(option => {
        const isActive = selected === option;
        return (
          <TouchableOpacity 
            key={option}
            style={[styles.segment, { backgroundColor: isActive ? theme.primary : 'transparent' }]}
            onPress={() => onSelect(option)}
            activeOpacity={0.8}
          >
            <Title style={[styles.text, { color: isActive ? theme.primaryText : theme.textSecondary }]}>
              {option}
            </Title>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    padding: 4,
    marginBottom: 20
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center'
  },
  text: {
    fontSize: 14,
  }
});
