'use client';

import React from 'react';
import { Button, Box, Typography, useTheme } from '@mui/material';
import { appGradients } from '@/theme/colors';

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outlined';
  disabled?: boolean;
  sx?: object;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = React.memo(({
  icon,
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  sx = {}
}) => {
  const theme = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: appGradients.primary(theme),
          color: 'white',
          '&:hover': {
            background: appGradients.primary(theme),
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
          },
        };
      case 'secondary':
        return {
          background: appGradients.primaryToSecondary(theme),
          color: 'white',
          '&:hover': {
            background: appGradients.primaryToSecondary(theme),
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
          },
        };
      case 'outlined':
        return {
          border: `2px solid ${theme.palette.primary.main}`,
          color: theme.palette.primary.main,
          background: 'transparent',
          '&:hover': {
            background: theme.palette.primary.main,
            color: 'white',
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
          },
        };
      default:
        return {};
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="contained"
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        borderRadius: 3,
        minHeight: { xs: 100, sm: 110, md: 120 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: 1, sm: 1.25, md: 1.5 },
        transition: 'all 0.3s ease-in-out',
        textTransform: 'none',
        fontWeight: 600,
        ...getVariantStyles(),
        ...sx
      }}
    >
      <Box sx={{ 
        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }, 
        display: 'flex', 
        alignItems: 'center' 
      }}>
        {icon}
      </Box>
      <Typography 
        variant="body1" 
        sx={{ 
          fontWeight: 600, 
          textAlign: 'center',
          fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
    </Button>
  );
});

QuickActionButton.displayName = 'QuickActionButton';

export default QuickActionButton;
