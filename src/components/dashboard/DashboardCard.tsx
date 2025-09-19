'use client';

import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box, useTheme } from '@mui/material';
import { appGradients } from '@/theme/colors';

interface DashboardCardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  gradient?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
  onClick?: () => void;
  children?: React.ReactNode;
  elevation?: number;
  sx?: object;
}

const DashboardCard: React.FC<DashboardCardProps> = React.memo(({
  title,
  value,
  subtitle,
  icon,
  gradient = 'primary',
  onClick,
  children,
  elevation = 2,
  sx = {}
}) => {
  const theme = useTheme();

  const getGradientStyle = () => {
    switch (gradient) {
      case 'primary':
        return appGradients.primary(theme);
      case 'secondary':
        return appGradients.primaryToSecondary(theme);
      case 'success':
        return appGradients.primary(theme);
      case 'info':
        return appGradients.primary(theme);
      case 'warning':
        return appGradients.primaryToOrange(theme);
      case 'error':
        return appGradients.yellowToRed(theme);
      default:
        return appGradients.primary(theme);
    }
  };

  return (
    <Card
      elevation={elevation}
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        } : {},
        background: children ? 'transparent' : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper} 100%)`,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        ...sx
      }}
    >
      {children ? (
        <CardContent sx={{ p: 3 }}>
          {children}
        </CardContent>
      ) : (
        <>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  {title}
                </Typography>
                {icon && (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: getGradientStyle(),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      minWidth: 56,
                      minHeight: 56,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                      '& svg': {
                        fontSize: '1.5rem',
                      },
                    }}
                  >
                    {icon}
                  </Box>
                )}
              </Box>
            }
            sx={{ pb: 1 }}
          />
          <CardContent sx={{ pt: 0 }}>
            {value !== undefined && (
              <Typography 
                variant="h4" 
                component="div" 
                sx={{ 
                  fontWeight: 700, 
                  color: theme.palette.primary.main, 
                  mb: 1,
                  fontSize: '2.2rem',
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {value}
              </Typography>
            )}
            {subtitle && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  opacity: 0.8,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
});

DashboardCard.displayName = 'DashboardCard';

export default DashboardCard;
