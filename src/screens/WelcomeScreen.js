import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { Heading, Caption, Body } from '../components/Typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES = [
  {
    subtitle: "AWARENESS",
    title: "Track without pressure",
    description: "Build a life you love, one step at a time. No guilt, just progress.",
  },
  {
    subtitle: "CLARITY",
    title: "Space for your mind",
    description: "Designed beautifully. Because your goals deserve a premium home.",
  },
  {
    subtitle: "ACTION",
    title: "Small steps, big change",
    description: "Ready to take control? Start tracking the things that truly matter to you today.",
  }
];

export default function WelcomeScreen({ theme, onStart }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { 
      useNativeDriver: false,
      listener: (event) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        setCurrentIndex(Math.round(index));
      }
    }
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {SLIDES.map((slide, index) => {
          return (
            <View key={index} style={[styles.slide, { width: SCREEN_WIDTH }]}>
              <View style={styles.imageContainer}>
                {/* Place your illustrations here */}
              </View>
              <View style={styles.textContainer}>
                <Caption color={theme.accent} style={styles.subtitle}>{slide.subtitle}</Caption>
              <Heading color={theme.text} style={styles.title}>
                {slide.title}
                <Heading color={theme.accent} style={styles.title}>.</Heading>
              </Heading>
              <Body color={theme.textSecondary} style={styles.description}>{slide.description}</Body>
            </View>
          </View>
          );
        })}
      </Animated.ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, i) => {
            const opacity = scrollX.interpolate({
              inputRange: [(i - 1) * SCREEN_WIDTH, i * SCREEN_WIDTH, (i + 1) * SCREEN_WIDTH],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            const scale = scrollX.interpolate({
              inputRange: [(i - 1) * SCREEN_WIDTH, i * SCREEN_WIDTH, (i + 1) * SCREEN_WIDTH],
              outputRange: [0.8, 1.2, 0.8],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: theme.accent, opacity, transform: [{ scale }] }
                ]}
              />
            );
          })}
        </View>

        <Button 
          title={currentIndex === SLIDES.length - 1 ? "Start Tracking" : "Next"} 
          onPress={() => {
            if (currentIndex === SLIDES.length - 1) {
              onStart();
            } else {
              scrollViewRef.current?.scrollTo({
                x: (currentIndex + 1) * SCREEN_WIDTH,
                animated: true
              });
            }
          }} 
          theme={theme} 
          variant={currentIndex === SLIDES.length - 1 ? "accent" : "primary"}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  slide: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 30, paddingBottom: 60 },
  imageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  textContainer: { gap: 16, height: 210 },
  subtitle: { marginBottom: 4, letterSpacing: 2 },
  title: { fontSize: 44, lineHeight: 54 },
  description: { fontSize: 18, lineHeight: 26, marginTop: 8 },
  footer: { paddingHorizontal: 24, paddingBottom: 40 },
  pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 32 },
  dot: { width: 8, height: 8, borderRadius: 4 }
});
