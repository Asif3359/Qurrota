import { Theme } from '@mui/material/styles';

// Theme-aware color functions
export const getThemeColor = (theme: Theme, colorType: 'primary' | 'secondary' | 'text' | 'background') => {
  return theme.palette[colorType];
};

// Light yellow color palette
export const lightYellowColors = {
  light: '#FFE55C',
  medium: '#FFD700',
  dark: '#FFA500',
  veryLight: '#FFF8DC',
  orange: '#FFA500',
  amber: '#FFC107',
  rgba: 'rgba(255, 255, 255, 0.16)',
};

// Purple color palette
export const purpleColors = {
  light: '#D27AE6', // Your requested color
  medium: '#9C27B0',
  dark: '#7B1FA2',
  lighter: '#E1BEE7',
  veryLight: '#ECA3FF',
};

// Additional colors used in the app
export const additionalColors = {
  blue: '#2196F3',
  green: '#4CAF50',
  red: '#FF6B6B',
  gray: {
    light: '#f8f9ff',
    medium: '#363636',
    dark: '#333333',
    veryLight: '#fff5f5',
  },
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// CSS custom properties for flexible theming
export const cssCustomProperties = {
  // Primary colors (Purple - #D27AE6)
  '--color-primary': purpleColors.light, // #D27AE6 - Main primary color
  '--color-primary-light': purpleColors.veryLight,
  '--color-primary-dark': purpleColors.medium,
  '--color-primary-darker': purpleColors.dark,
  // Secondary colors (Yellow)
  '--color-secondary': lightYellowColors.light,
  '--color-secondary-light': lightYellowColors.veryLight,
  '--color-secondary-dark': lightYellowColors.medium,
  '--color-secondary-darker': lightYellowColors.dark,
  // Legacy naming for backward compatibility
  '--color-light-yellow': lightYellowColors.light,
  '--color-medium-yellow': lightYellowColors.medium,
  '--color-dark-yellow': lightYellowColors.dark,
  '--color-very-light-yellow': lightYellowColors.veryLight,
  '--color-orange-yellow': lightYellowColors.orange,
  '--color-amber-yellow': lightYellowColors.amber,
  '--color-light-purple': purpleColors.light, // #D27AE6 - your requested color
  '--color-medium-purple': purpleColors.medium,
  '--color-dark-purple': purpleColors.dark,
  '--color-lighter-purple': purpleColors.lighter,
  '--color-very-light-purple': purpleColors.veryLight,
  // Additional colors
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
  primary: (theme: Theme) => getGradient(theme.palette.primary.main, theme.palette.primary.dark), // Purple gradient
  primaryToSecondary: (theme: Theme) => getGradient(theme.palette.primary.main, theme.palette.secondary.main), // Purple to yellow
  primaryToOrange: (theme: Theme) => getGradient(theme.palette.primary.main, lightYellowColors.orange), // Purple to orange
  secondaryToLight: (theme: Theme) => getGradient(theme.palette.secondary.main, lightYellowColors.veryLight), // Yellow to light yellow
  yellowToOrange: (theme: Theme) => getGradient(theme.palette.secondary.dark, lightYellowColors.orange), // Yellow to orange
  yellowToRed: (theme: Theme) => getGradient(theme.palette.secondary.dark, additionalColors.red), // Yellow to red
  // Purple-focused gradients (now primary)
  purpleToLight: () => getGradient(purpleColors.light, purpleColors.veryLight),
  purpleToYellow: (theme: Theme) => getGradient(theme.palette.primary.main, theme.palette.secondary.main),
  purpleGradient: () => getGradient(purpleColors.light, purpleColors.medium),
  subtlePurple: (theme: Theme) => getGradient(
    getRgbaColor(theme.palette.primary.main, 0.1),
    getRgbaColor(theme.palette.primary.dark, 0.1)
  ),
  subtlePurpleRadial: (theme: Theme) => getRadialGradient(
    getRgbaColor(theme.palette.primary.main, 0.1),
    additionalColors.transparent,
    '30% 20%'
  ),
  background: () => getGradient(additionalColors.gray.light, additionalColors.gray.veryLight, 135),
  rainbow: () => getGradient(purpleColors.light, lightYellowColors.orange, 90), // Purple to orange rainbow
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
