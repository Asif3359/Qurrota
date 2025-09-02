import { Theme } from '@mui/material/styles';

// Theme-aware color functions
export const getThemeColor = (theme: Theme, colorType: 'primary' | 'secondary' | 'text' | 'background') => {
  return theme.palette[colorType];
};

// Light yellow color palette
export const lightYellowColors = {
  light: '#D27AE6',
  medium: '#FFE55C',
  dark: '#FFD700',
  veryLight:'#ECA3FF',
  orange: '#FFA500',
  amber: '#FFC107',
  rgba: 'rgba(255, 255, 255, 0.16)',
};

// Purple color palette
export const purpleColors = {
  light: '#E1BEE7',
  medium: '#9C27B0',
  dark: '#7B1FA2',
  lighter: '#BA68C8',
};

// Additional colors used in the app
export const additionalColors = {
  blue: '#2196F3',
  green: '#4CAF50',
  red: '#FF6B6B',
  gray: {
    light: '#f8f9ff',
    medium: '#666666',
    dark: '#333333',
    veryLight: '#fff5f5',
  },
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// CSS custom properties for flexible theming
export const cssCustomProperties = {
  '--color-light-yellow': lightYellowColors.light,
  '--color-medium-yellow': lightYellowColors.medium,
  '--color-dark-yellow': lightYellowColors.dark,
  '--color-very-light-yellow': lightYellowColors.veryLight,
  '--color-orange-yellow': lightYellowColors.orange,
  '--color-amber-yellow': lightYellowColors.amber,
  '--color-light-purple': purpleColors.light,
  '--color-medium-purple': purpleColors.medium,
  '--color-dark-purple': purpleColors.dark,
  '--color-lighter-purple': purpleColors.lighter,
  '--color-blue': additionalColors.blue,
  '--color-green': additionalColors.green,
  '--color-red': additionalColors.red,
  '--color-gray-light': additionalColors.gray.light,
  '--color-gray-medium': additionalColors.gray.medium,
  '--color-gray-dark': additionalColors.gray.dark,
  '--color-gray-very-light': additionalColors.gray.veryLight,
  '--color-white': additionalColors.white,
  '--color-black': additionalColors.black,
  '--color-transparent': additionalColors.transparent,
};

// Helper function to get rgba colors from theme
export const getRgbaColor = (color: string, alpha: number) => {
  // Convert hex to rgb and apply alpha
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Gradient helpers
export const getGradient = (color1: string, color2: string, angle: number = 45) => {
  return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
};

export const getRadialGradient = (color1: string, color2: string, position: string = 'center') => {
  return `radial-gradient(circle at ${position}, ${color1}, ${color2})`;
};

// Predefined gradients used throughout the app
export const appGradients = {
  primary: (theme: Theme) => getGradient(theme.palette.primary.main, theme.palette.primary.dark),
  primaryToSecondary: (theme: Theme) => getGradient(theme.palette.primary.main, theme.palette.secondary.main),
  primaryToOrange: (theme: Theme) => getGradient(theme.palette.primary.main, lightYellowColors.orange),
  secondaryToLight: (theme: Theme) => getGradient(theme.palette.secondary.main, purpleColors.lighter),
  yellowToOrange: (theme: Theme) => getGradient(theme.palette.primary.dark, lightYellowColors.orange),
  yellowToRed: (theme: Theme) => getGradient(theme.palette.primary.dark, additionalColors.red),
  subtleYellow: (theme: Theme) => getGradient(
    getRgbaColor(theme.palette.primary.dark, 0.1),
    getRgbaColor(theme.palette.secondary.main, 0.1)
  ),
  subtleYellowRadial: (theme: Theme) => getRadialGradient(
    getRgbaColor(theme.palette.primary.dark, 0.1),
    additionalColors.transparent,
    '30% 20%'
  ),
  background: () => getGradient(additionalColors.gray.light, additionalColors.gray.veryLight, 135),
  rainbow: () => getGradient(lightYellowColors.dark, lightYellowColors.orange, 90),
};

// Theme-aware color getters
export const getThemeColors = (theme: Theme) => ({
  primary: theme.palette.primary,
  secondary: theme.palette.secondary,
  text: theme.palette.text,
  background: theme.palette.background,
  yellow: lightYellowColors,
  purple: purpleColors,
  additional: additionalColors,
});
