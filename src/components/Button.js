import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Button({ title, onPress, variant = 'primary', icon, theme, style, textStyle }) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary': return theme.primary;
      case 'outline': return 'transparent';
      case 'danger': return theme.danger;
      case 'accent': return theme.accent;
      case 'card': return 'transparent'; // flattened card
      case 'transparent': return 'transparent';
      default: return theme.primary;
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case 'outline': return theme.border;
      case 'danger': return theme.danger;
      case 'accent': return theme.accent;
      case 'card': return theme.border;
      case 'transparent': return 'transparent';
      default: return 'transparent';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary': return theme.primaryText;
      case 'outline': return theme.textSecondary;
      case 'danger': return '#FFFFFF';
      case 'accent': return '#FFFFFF';
      case 'card': return theme.text;
      case 'transparent': return theme.textSecondary;
      default: return theme.primaryText;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { 
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'primary' ? 0 : 1,
        },
        style
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon}
      <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 12
  },
  text: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  }
});
