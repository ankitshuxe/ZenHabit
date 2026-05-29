import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Heading, Caption } from '../components/Typography';

export default function SplashScreen({ theme }) {
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Heading color={theme.text} style={styles.title}>ZenHabit</Heading>
        <Heading color={theme.accent} style={styles.title}>.</Heading>
      </View>
      
      <Animated.View style={{ opacity, marginTop: 40 }}>
        <Caption color={theme.textSecondary}>LOADING...</Caption>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
  }
});
