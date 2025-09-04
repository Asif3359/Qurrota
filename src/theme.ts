import { createTheme } from '@mui/material/styles';
import { lightYellowColors, purpleColors, additionalColors, cssCustomProperties } from './theme/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: purpleColors.light, // #D27AE6 - Purple as main color
      light: purpleColors.veryLight,
      dark: purpleColors.medium,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: lightYellowColors.light, // Light yellow as secondary
      light: lightYellowColors.veryLight,
      dark: lightYellowColors.medium,
      contrastText: '#000000',
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
      main: lightYellowColors.amber,
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
