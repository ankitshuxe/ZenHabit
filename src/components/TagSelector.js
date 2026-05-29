import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Title, Caption } from './Typography';

export default function TagSelector({ selectedTags, onToggleTag, theme }) {
  const allTags = Object.keys(theme.tags || {});
  
  return (
    <View style={styles.container}>
      <Caption style={[styles.title, { color: theme.textSecondary }]}>Tags</Caption>
      <View style={styles.tagWrap}>
        {allTags.map(tag => {
          const isActive = selectedTags.includes(tag);
          const color = theme.tags[tag];
          return (
            <TouchableOpacity 
              key={tag}
              style={[
                styles.tag, 
                { 
                  backgroundColor: isActive ? color : 'transparent',
                  borderColor: isActive ? color : theme.border
                }
              ]}
              onPress={() => onToggleTag(tag)}
            >
              {!isActive && <View style={[styles.dot, { backgroundColor: color }]} />}
              <Title style={[styles.text, { color: isActive ? '#FFFFFF' : theme.textSecondary }]}>
                {tag}
              </Title>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20
  },
  title: {
    marginBottom: 12
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8, // Flatter radius
    borderWidth: 1
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6
  },
  text: {
    fontSize: 12,
  }
});
