import { Theme } from '@mui/material/styles';

// Theme-aware color functions
export const getThemeColor = (theme: Theme, colorType: 'primary' | 'secondary' | 'text' | 'background') => {
  return theme.palette[colorType];
};

// Soft neutral accent palette (replaces legacy yellow usage)
export const neutralAccentColors = {
  light: '#F5F5F7',
  medium: '#E1E3E8',
  dark: '#9FA3AD',
  veryLight: '#FFFFFF',
  accent: '#D0D4DC',
  accentStrong: '#B4B9C4',
  rgba: 'rgba(45, 55, 72, 0.12)',
};

// Purple color palette
export const purpleColors = {
  light: '#7C3AED',
  medium: '#5B21B6',
  dark: '#3C0D99',
  lighter: '#A78BFA',
  veryLight: '#F3F0FF',
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
  // Primary colors (Royal Purple)
  '--color-primary': purpleColors.light,
  '--color-primary-light': purpleColors.veryLight,
  '--color-primary-dark': purpleColors.medium,
  '--color-primary-darker': purpleColors.dark,
  // Secondary colors (Soft Lavender accent)
  '--color-secondary': neutralAccentColors.accent,
  '--color-secondary-light': neutralAccentColors.light,
  '--color-secondary-dark': neutralAccentColors.medium,
  '--color-secondary-darker': neutralAccentColors.dark,
  '--color-accent': neutralAccentColors.accent,
  '--color-accent-strong': neutralAccentColors.accentStrong,
  '--color-accent-light': neutralAccentColors.veryLight,
  '--color-light-purple': purpleColors.light,
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
  primaryToSecondary: (theme: Theme) =>
    getGradient(theme.palette.primary.main, theme.palette.secondary.main), // Rich to soft neutral
  primaryToAccent: (theme: Theme) => getGradient(theme.palette.primary.main, neutralAccentColors.accent), // Soft neutral mix
  secondaryToLight: (theme: Theme) => getGradient(theme.palette.secondary.main, neutralAccentColors.veryLight), // Neutral wash
  accentSweep: (theme: Theme) => getGradient(theme.palette.secondary.dark, neutralAccentColors.accent), // Accent sweep
  accentToHighlight: (theme: Theme) => getGradient(theme.palette.secondary.dark, additionalColors.red), // Accent to highlight
  // Purple-focused gradients
  purpleToLight: () => getGradient(purpleColors.light, purpleColors.veryLight),
  purpleToAccent: (theme: Theme) => getGradient(theme.palette.primary.main, theme.palette.secondary.main),
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
  rainbow: () => getGradient(purpleColors.light, neutralAccentColors.accent, 90), // Purple to accent spectrum
};

// Theme-aware color getters
export const getThemeColors = (theme: Theme) => ({
  primary: theme.palette.primary,
  secondary: theme.palette.secondary,
  text: theme.palette.text,
  background: theme.palette.background,
  accent: neutralAccentColors,
  purple: purpleColors,
  additional: additionalColors,
});
