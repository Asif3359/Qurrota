'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, useTheme, Fade } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { 
  StatsOverview, 
  QuickActions, 
  RecentActivity, 
  UserProfileSummary
} from '@/components/dashboard';
// import { appGradients } from '@/theme/colors';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  // Mock user stats - in a real app, this would come from an API
  const userStats = useMemo(() => ({
    totalOrders: 12,
    totalSpent: 1250,
    loyaltyPoints: 450,
    notifications: 3,
  }), []);

  const handleQuickAction = (action: string) => {
    console.log('Quick action clicked:', action);
    // Handle different actions here
    switch (action) {
      case 'new_order':
        router.push('/products');
        break;
      case 'edit_profile':
        router.push('/dashboard/user/profile');
        break;
      case 'support':
        router.push('/dashboard/user/support');
        break;
      case 'wishlist':
        router.push('/dashboard/user/wishlist');
        break;
      case 'orders':
        router.push('/dashboard/user/orders');
        break;
      default:
        // Handle other actions
        break;
    }
  };

  const handleEditProfile = () => {
    router.push('/dashboard/user/profile');
  };

  return (
      <Box
        sx={{
          minHeight: '100vh',
          // background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '300px',
            // background: appGradients.subtlePurpleRadial(theme),
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
                Welcome back, {user?.name || 'User'}! 👋
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
                Here&apos;s what&apos;s happening with your account today
              </Typography>
            </Box>
          </Fade>

          {/* Dashboard Content */}
          <Fade in timeout={1000}>
            <Box>
              {/* Profile Summary and Stats */}
              <Box
                // sx={{
                //   display: 'grid',
                //   gridTemplateColumns: {
                //     xs: '1fr',
                //     sm: '1fr',
                //     md: '1fr 1fr',
                //     lg: '1fr 2fr',
                //   },
                //   gap: { xs: 3, sm: 4, md: 4, lg: 4 },
                //   mb: { xs: 4, sm: 5, md: 6 },
                // }}
              >
                <UserProfileSummary onEditProfile={handleEditProfile} />
                {/* <StatsOverview userStats={userStats} /> */}
              </Box>

              {/* Quick Actions */}
              <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
                <QuickActions onActionClick={handleQuickAction} />
              </Box>

              {/* Recent Activity */}
              {/* <RecentActivity /> */}
            </Box>
          </Fade>
        </Container>
      </Box>
  );
}


