import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Modal, Animated, PanResponder, Dimensions, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function BottomSheet({ visible, onClose, children, theme }) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 250, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true })
      ]).start(() => {
        setShowModal(false);
      });
    }
  }, [visible]);

  const handleShow = () => {
    translateY.setValue(SCREEN_HEIGHT);
    opacity.setValue(0);
    Animated.parallel([
      Animated.spring(translateY, { 
        toValue: 0, 
        useNativeDriver: true, 
        damping: 20, 
        stiffness: 100,
        restDisplacementThreshold: 10,
        restSpeedThreshold: 10
      }),
      Animated.timing(opacity, { toValue: 0.68, duration: 250, useNativeDriver: true })
    ]).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (e, gestureState) => {
        // Increase threshold to prevent stealing taps (finger slight movement)
        return Math.abs(gestureState.dy) > 15 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 150 || gestureState.vy > 1.5) {
          onClose(); // Swipe down to close
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 100 }).start(); // Snap back
        }
      }
    })
  ).current;

  // Render modal content only when visible or animating out to avoid mount bugs, 
  return (
    <Modal visible={showModal} animationType="none" transparent onRequestClose={onClose} onShow={handleShow} hardwareAccelerated={true} statusBarTranslucent={true}>
      <View style={{ flex: 1, width: '100%', height: '100%' }}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View 
            style={[StyleSheet.absoluteFill, { backgroundColor: '#000', opacity }]} 
          />
        </TouchableWithoutFeedback>
        
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.overlay, { zIndex: 2 }]} pointerEvents="box-none">
          <Animated.View 
            style={[styles.sheet, { backgroundColor: theme.background, transform: [{ translateY }] }]}
            {...panResponder.panHandlers}
          >
            <View style={styles.handleContainer}>
              <View style={[styles.handle, { backgroundColor: theme.border }]} />
            </View>
            {children}
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: { borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingHorizontal: 24, paddingBottom: 40, maxHeight: '95%' },
  handleContainer: { alignItems: 'center', paddingTop: 16, paddingBottom: 24, width: '100%' },
  handle: { width: 40, height: 4, borderRadius: 2 }
});
