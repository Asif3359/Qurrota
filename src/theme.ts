import { createTheme } from '@mui/material/styles';
import { neutralAccentColors, purpleColors, additionalColors, cssCustomProperties } from './theme/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: purpleColors.light,
      light: purpleColors.lighter,
      dark: purpleColors.medium,
      contrastText: additionalColors.white,
    },
    secondary: {
      main: neutralAccentColors.accent,
      light: neutralAccentColors.light,
      dark: neutralAccentColors.accentStrong,
      contrastText: additionalColors.black,
    },
    background: {
      default: additionalColors.white,
      paper: additionalColors.white,
    },
    text: {
      primary: additionalColors.black,
      secondary: additionalColors.gray.medium,
    },
    // Add custom colors for better theming
    success: {
      main: additionalColors.green,
      contrastText: additionalColors.white,
    },
    info: {
      main: additionalColors.blue,
      contrastText: additionalColors.white,
    },
    warning: {
      main: neutralAccentColors.accentStrong,
      contrastText: additionalColors.black,
    },
    error: {
      main: additionalColors.red,
      contrastText: additionalColors.white,
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), Arial, sans-serif',
  },
  // Add CSS custom properties for flexible theming
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': cssCustomProperties,
      },
    },
  },
});

export default theme;
