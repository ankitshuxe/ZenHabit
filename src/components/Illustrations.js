import React from 'react';
import Svg, { Path, Circle, Rect, Line, Ellipse } from 'react-native-svg';

export const AwarenessIllustration = ({ theme, width = 280, height = 280 }) => (
  <Svg width={width} height={height} viewBox="0 0 200 200" fill="none">
    {/* Abstract zen circle */}
    <Circle cx="100" cy="100" r="70" stroke={theme.border} strokeWidth="4" strokeDasharray="15 10" />
    <Path d="M 30 100 A 70 70 0 0 1 170 100" stroke={theme.textSecondary} strokeWidth="4" opacity="0.4" />
    
    {/* Meditating Character */}
    {/* Head */}
    <Circle cx="100" cy="65" r="16" stroke={theme.text} strokeWidth="4" fill={theme.background} />
    {/* Hair/Bun */}
    <Path d="M 90 53 C 90 35, 110 35, 110 53" fill={theme.accent} />
    {/* Neck */}
    <Line x1="100" y1="81" x2="100" y2="90" stroke={theme.text} strokeWidth="4" />
    {/* Shirt / Torso */}
    <Path d="M 82 90 L 118 90 L 112 140 L 88 140 Z" stroke={theme.text} strokeWidth="4" strokeLinejoin="round" fill={theme.card} />
    {/* Crossed Legs */}
    <Path d="M 65 135 C 65 160, 135 160, 135 135" stroke={theme.text} strokeWidth="4" strokeLinecap="round" />
    <Line x1="65" y1="135" x2="135" y2="135" stroke={theme.text} strokeWidth="4" strokeLinecap="round" />
    {/* Arms */}
    <Path d="M 82 95 L 65 115 L 75 135" stroke={theme.text} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M 118 95 L 135 115 L 125 135" stroke={theme.text} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Decorative Elements */}
    <Circle cx="40" cy="60" r="6" fill={theme.accent} />
    <Circle cx="160" cy="120" r="4" fill={theme.textSecondary} />
    <Path d="M 145 50 L 155 60 M 155 50 L 145 60" stroke={theme.accent} strokeWidth="4" strokeLinecap="round" />
  </Svg>
);

export const ClarityIllustration = ({ theme, width = 280, height = 280 }) => (
  <Svg width={width} height={height} viewBox="0 0 200 200" fill="none">
    {/* Grid / Organized Space */}
    <Rect x="120" y="50" width="50" height="50" rx="8" stroke={theme.border} strokeWidth="4" />
    <Rect x="130" y="60" width="15" height="15" rx="4" stroke={theme.textSecondary} strokeWidth="4" />
    <Rect x="150" y="60" width="15" height="15" rx="4" fill={theme.accent} />
    <Rect x="130" y="80" width="15" height="15" rx="4" fill={theme.textSecondary} />
    <Rect x="150" y="80" width="15" height="15" rx="4" stroke={theme.textSecondary} strokeWidth="4" />
    
    {/* Character Standing */}
    {/* Head */}
    <Circle cx="70" cy="70" r="14" stroke={theme.text} strokeWidth="4" fill={theme.background} />
    {/* Hair */}
    <Path d="M 58 65 Q 70 45 82 65" stroke={theme.accent} strokeWidth="6" strokeLinecap="round" />
    {/* Torso */}
    <Path d="M 60 84 L 80 84 L 75 140 L 65 140 Z" stroke={theme.text} strokeWidth="4" strokeLinejoin="round" fill={theme.card} />
    {/* Legs */}
    <Line x1="65" y1="140" x2="65" y2="180" stroke={theme.text} strokeWidth="4" strokeLinecap="round" />
    <Line x1="75" y1="140" x2="75" y2="180" stroke={theme.text} strokeWidth="4" strokeLinecap="round" />
    {/* Arms holding a block */}
    <Path d="M 60 90 L 40 110 L 50 120" stroke={theme.text} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M 80 90 L 100 80 L 110 85" stroke={theme.text} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Block being held/placed */}
    <Rect x="105" y="75" width="16" height="16" rx="4" stroke={theme.accent} strokeWidth="4" />
    
    {/* Decorative Elements */}
    <Circle cx="30" cy="140" r="5" fill={theme.textSecondary} />
    <Path d="M 40 40 L 50 40 L 45 30 Z" fill={theme.accent} />
  </Svg>
);

export const ActionIllustration = ({ theme, width = 280, height = 280 }) => (
  <Svg width={width} height={height} viewBox="0 0 200 200" fill="none">
    {/* Stairs */}
    <Path d="M 20 180 L 60 180 L 60 140 L 100 140 L 100 100 L 140 100 L 140 60 L 180 60" stroke={theme.border} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Character on stairs */}
    {/* Head */}
    <Circle cx="90" cy="65" r="14" stroke={theme.text} strokeWidth="4" fill={theme.background} />
    {/* Cap/Hair */}
    <Path d="M 76 60 Q 90 40 104 60 Z" fill={theme.accent} />
    {/* Torso */}
    <Path d="M 80 79 L 100 79 L 95 120 L 85 120 Z" stroke={theme.text} strokeWidth="4" strokeLinejoin="round" fill={theme.card} />
    {/* Legs walking up */}
    <Path d="M 85 120 L 75 140 L 65 140" stroke={theme.text} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M 95 120 L 100 135 L 115 135" stroke={theme.text} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    {/* Arms holding flag */}
    <Path d="M 80 85 L 60 95 L 70 110" stroke={theme.text} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M 100 85 L 120 75 L 130 50" stroke={theme.text} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Flag */}
    <Line x1="130" y1="50" x2="130" y2="20" stroke={theme.text} strokeWidth="4" strokeLinecap="round" />
    <Path d="M 130 20 L 160 30 L 130 40 Z" fill={theme.accent} />
    
    {/* Decorative */}
    <Circle cx="50" cy="90" r="4" fill={theme.textSecondary} />
    <Path d="M 150 140 L 160 150 M 160 140 L 150 150" stroke={theme.accent} strokeWidth="4" strokeLinecap="round" />
  </Svg>
);
