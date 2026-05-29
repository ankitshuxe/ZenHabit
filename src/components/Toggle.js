import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';

export default function Toggle({ value, onValueChange, theme }) {
  const slideAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false
    }).start();
  }, [value]);

  const backgroundColor = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', theme.primary]
  });

  const borderColor = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.border, theme.primary]
  });

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 21]
  });

  const thumbColor = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.textSecondary, theme.primaryText]
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onValueChange(!value)}>
      <Animated.View style={[styles.track, { backgroundColor, borderColor }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX }], backgroundColor: thumbColor }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
  },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 2,
  }
});
