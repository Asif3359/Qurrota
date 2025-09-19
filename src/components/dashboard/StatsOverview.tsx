'use client';

import React, { useMemo } from 'react';
import { Grid, Box, Typography, useTheme } from '@mui/material';
import DashboardCard from './DashboardCard';
import { 
  Person, 
  ShoppingCart, 
  TrendingUp, 
  Star,
  Notifications,
  Security
} from '@mui/icons-material';

interface StatsOverviewProps {
  userStats?: {
    totalOrders?: number;
    totalSpent?: number;
    loyaltyPoints?: number;
    notifications?: number;
  };
}

const StatsOverview: React.FC<StatsOverviewProps> = React.memo(({ userStats = {} }) => {
  const theme = useTheme();

  const stats = useMemo(() => [
    {
      title: 'Total Orders',
      value: userStats.totalOrders || 0,
      subtitle: 'All time orders',
      icon: <ShoppingCart />,
      gradient: 'primary' as const,
    },
    {
      title: 'Total Spent',
      value: `$${userStats.totalSpent || 0}`,
      subtitle: 'Lifetime spending',
      icon: <TrendingUp />,
      gradient: 'success' as const,
    },
    {
      title: 'Loyalty Points',
      value: userStats.loyaltyPoints || 0,
      subtitle: 'Available points',
      icon: <Star />,
      gradient: 'warning' as const,
    },
    {
      title: 'Notifications',
      value: userStats.notifications || 0,
      subtitle: 'Unread messages',
      icon: <Notifications />,
      gradient: 'info' as const,
    },
  ], [userStats, theme]);

  return (
    <Box sx={{ mb: { xs: 3, sm: 4 } }}>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 700, 
          mb: { xs: 2, sm: 3 }, 
          color: theme.palette.text.primary,
          fontSize: { xs: '1.3rem', sm: '1.4rem', md: '1.5rem' },
          letterSpacing: '-0.02em',
        }}
      >
        Overview
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        {stats.map((stat, index) => (
          <DashboardCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            gradient={stat.gradient}
            sx={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
});

StatsOverview.displayName = 'StatsOverview';

export default StatsOverview;
