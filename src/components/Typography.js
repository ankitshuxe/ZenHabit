import React from 'react';
import { Text, StyleSheet, Platform } from 'react-native';

const FONTS = {
  sans: 'System',
  serif: Platform.OS === 'ios' ? 'Georgia' : 'serif',
};

export const Heading = ({ children, style, color, ...props }) => (
  <Text style={[styles.heading, color && { color }, style]} {...props}>
    {children}
  </Text>
);

export const Subheading = ({ children, style, color, ...props }) => (
  <Text style={[styles.subheading, color && { color }, style]} {...props}>
    {children}
  </Text>
);

export const Title = ({ children, style, color, ...props }) => (
  <Text style={[styles.title, color && { color }, style]} {...props}>
    {children}
  </Text>
);

export const Body = ({ children, style, color, ...props }) => (
  <Text style={[styles.body, color && { color }, style]} {...props}>
    {children}
  </Text>
);

export const Caption = ({ children, style, color, ...props }) => (
  <Text style={[styles.caption, color && { color }, style]} {...props}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subheading: {
    fontSize: 28,
    fontStyle: 'italic',
    fontFamily: FONTS.serif,
    fontWeight: '400',
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    fontSize: 14,
    fontWeight: '600',
  },
  caption: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  }
});
