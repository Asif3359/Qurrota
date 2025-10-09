'use client';

import React, { useMemo } from 'react';
import { Box, Container, Typography, useTheme, Fade } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { 
  StatsOverview, 
  RecentActivity
} from '@/components/dashboard';
import router from 'next/router';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const theme = useTheme();

  // Mock admin stats - replace with API data
  const adminStats = useMemo(() => ({
    totalOrders: 320,
    totalSpent: 0,
    loyaltyPoints: 0,
    notifications: 7,
  }), []);

  const handleQuickAction = (action: string) => {
    console.log('Quick action clicked:', action);
    // Handle different actions here
    switch (action) {
      case 'new_order':
        router.push('/products');
        break;
    }
  };  

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '300px',
          zIndex: 0,
        },
      }}
    >
      <Container 
        maxWidth="xl" 
        sx={{ 
          position: 'relative', 
          zIndex: 1, 
          py: { xs: 3, sm: 4, md: 5, lg: 6 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Welcome Header */}
        <Fade in timeout={800}>
          <Box sx={{ mb: { xs: 4, sm: 5, md: 6 }, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: { xs: 1.5, sm: 2 },
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem', lg: '3rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Welcome back, {user?.name || 'Admin'}! 👋
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                fontWeight: 400,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                opacity: 0.8,
                px: { xs: 2, sm: 0 },
              }}
            >
              Here are your store metrics and recent activity
            </Typography>
          </Box>
        </Fade>

        {/* Dashboard Content */}
        <Fade in timeout={1000}>
          <Box>
            <StatsOverview userStats={adminStats} />
            <RecentActivity />
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

