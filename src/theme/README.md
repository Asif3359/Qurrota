# Theme System Documentation

## Overview
This theme system provides a consistent and flexible way to manage colors throughout the Qurrota application. It uses Material-UI's theming system combined with CSS custom properties for maximum flexibility.

## Color Palette

### Neutral Accent Colors
- **Very Light**: `#FFFFFF` - Crisp base for backgrounds
- **Light**: `#F5F5F7` - Subtle neutral for surfaces
- **Medium**: `#E1E3E8` - Balanced accent for borders
- **Accent**: `#D0D4DC` - Highlight for interactive states
- **Accent Strong**: `#B4B9C4` - Stronger accent for emphasis
- **Dark**: `#9FA3AD` - Deep neutral for contrast

### Purple Colors
- **Very Light**: `#F3F0FF` - Gentle lavender wash
- **Light**: `#7C3AED` - Primary brand purple
- **Medium**: `#5B21B6` - Hover and focus state purple
- **Dark**: `#3C0D99` - Rich purple for depth
- **Lighter**: `#A78BFA` - Soft supporting purple

## Usage

### 1. Using Theme Colors in Components
```tsx
import { useTheme } from '@mui/material/styles';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.secondary.main, // Neutral accent
        color: theme.palette.text.primary,             // High contrast text
        border: `2px solid ${theme.palette.secondary.dark}` // Strong accent border
      }}
    >
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
    <Box
      sx={{
        background: getGradient('#7C3AED', '#5B21B6'), // Brand gradient
        boxShadow: `0 4px 8px ${getRgbaColor('#000000', 0.15)}` // Soft shadow
      }}
    >
      Content
    </Box>
  );
};
```

### 3. Using CSS Custom Properties
```tsx
const MyComponent = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'var(--color-secondary)',
        color: 'var(--color-black)',
        border: '2px solid var(--color-secondary-dark)'
      }}
    >
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

1. Replace `#FFD700` (or other yellows) with `theme.palette.secondary.dark`
2. Replace `#9C27B0` with `theme.palette.primary.light`
3. Replace `#FFC000` with `neutralAccentColors.accent` from `@/theme/colors`
4. Use `getGradient()` for linear gradients
5. Use `getRgbaColor()` for transparency effects
