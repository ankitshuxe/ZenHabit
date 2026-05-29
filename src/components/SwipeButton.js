import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder } from 'react-native';

export default function SwipeButton({ onComplete, isCompleted, theme, progressText, dots }) {
  const pan = useRef(new Animated.ValueXY()).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const BUTTON_WIDTH = 150; // The drag button's width

  useEffect(() => {
    if (!isCompleted) {
      pan.setValue({ x: 0, y: 0 });
    }
  }, [isCompleted]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isCompleted,
      onMoveShouldSetPanResponder: () => !isCompleted,
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: 0 });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
      onPanResponderRelease: (e, gesture) => {
        pan.flattenOffset();
        const threshold = containerWidth - BUTTON_WIDTH - 20; 
        if (gesture.dx > threshold * 0.6 && threshold > 0) {
          // Complete
          Animated.spring(pan, {
            toValue: { x: containerWidth - BUTTON_WIDTH, y: 0 },
            useNativeDriver: false,
          }).start(() => {
            onComplete();
          });
        } else {
          // Reset
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const translateX = pan.x.interpolate({
    inputRange: [0, Math.max(containerWidth - BUTTON_WIDTH, 1)],
    outputRange: [0, Math.max(containerWidth - BUTTON_WIDTH, 1)],
    extrapolate: 'clamp'
  });

  return (
    <View 
      style={[styles.container, { backgroundColor: theme.card }]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <View style={styles.backgroundContent}>
        <View style={styles.dotsContainer}>
          {dots.map((isFilled, idx) => (
            <View key={idx} style={[styles.dot, { backgroundColor: isFilled ? theme.primary : theme.textSecondary }]} />
          ))}
        </View>
        <Text style={[styles.progressText, { color: theme.textSecondary }]}>{progressText}</Text>
      </View>

      {!isCompleted ? (
        <Animated.View
          style={[styles.dragButton, { backgroundColor: theme.primary, transform: [{ translateX }] }]}
          {...panResponder.panHandlers}
        >
          <Text style={[styles.dragText, { color: theme.primaryText }]}>Drag to {progressText.includes('/') ? 'Progress' : 'Complete'} &gt;&gt;</Text>
        </Animated.View>
      ) : (
        <View style={[styles.dragButton, { backgroundColor: theme.border, width: '100%', alignItems: 'center', position: 'absolute' }]}>
           <Text style={[styles.dragText, { color: theme.textSecondary }]}>Done ✓</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    marginTop: 12,
  },
  backgroundContent: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 16,
  },
  progressText: {
    fontSize: 12,
    marginLeft: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  dragButton: {
    height: '100%',
    width: 150,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    zIndex: 10,
  },
  dragText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 13,
  }
});
