# Theme System Documentation

## Overview
This theme system provides a consistent and flexible way to manage colors throughout the Qurrota application. It uses Material-UI's theming system combined with CSS custom properties for maximum flexibility.

## Color Palette

### Light Yellow Colors (Primary)
- **Light**: `#FFF4B0` - Very light yellow for backgrounds
- **Medium**: `#FFE55C` - Medium yellow for borders and accents
- **Dark**: `#FFD700` - Darker yellow for text and strong accents
- **Very Light**: `#FFF8D1` - Extremely light yellow for subtle backgrounds

### Purple Colors (Secondary)
- **Light**: `#E1BEE7` - Light purple for subtle accents
- **Medium**: `#9C27B0` - Main purple for primary actions
- **Dark**: `#7B1FA2` - Dark purple for hover states

## Usage

### 1. Using Theme Colors in Components
```tsx
import { useTheme } from '@mui/material/styles';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      backgroundColor: theme.palette.primary.main, // Light yellow
      color: theme.palette.primary.contrastText,  // Black text
      border: `2px solid ${theme.palette.primary.dark}` // Medium yellow border
    }}>
      Content
    </Box>
  );
};
```

### 2. Using Color Utilities
```tsx
import { getGradient, getRgbaColor } from '../theme/colors';

const MyComponent = () => {
  return (
    <Box sx={{ 
      background: getGradient('#FFF4B0', '#FFE55C'), // Linear gradient
      boxShadow: `0 4px 8px ${getRgbaColor('#FFF4B0', 0.3)}` // With transparency
    }}>
      Content
    </Box>
  );
};
```

### 3. Using CSS Custom Properties
```tsx
const MyComponent = () => {
  return (
    <Box sx={{ 
      backgroundColor: 'var(--color-light-yellow)',
      color: 'var(--color-black)',
      border: '2px solid var(--color-medium-yellow)'
    }}>
      Content
    </Box>
  );
};
```

## Benefits

1. **Consistency**: All colors are defined in one place
2. **Flexibility**: Easy to change colors globally
3. **Accessibility**: Proper contrast ratios maintained
4. **Performance**: CSS custom properties are optimized by browsers
5. **Maintainability**: Centralized color management

## Best Practices

1. **Always use theme colors** instead of hardcoded hex values
2. **Use color utilities** for gradients and transparency
3. **Maintain contrast ratios** for accessibility
4. **Test color changes** across different components
5. **Document any new colors** added to the system

## Migration Guide

To migrate existing components from hardcoded colors:

1. Replace `#FFD700` with `theme.palette.primary.dark`
2. Replace `#9C27B0` with `theme.palette.secondary.main`
3. Replace `#FFC000` with `theme.palette.primary.dark`
4. Use `getGradient()` for linear gradients
5. Use `getRgbaColor()` for transparency effects
