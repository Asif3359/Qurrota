'use client';

import React, { useMemo } from 'react';
import { Box, Typography, useTheme, Button } from '@mui/material';
import DashboardCard from './DashboardCard';
import ActivityItem from './ActivityItem';

interface RecentActivityProps {
  activities?: Array<{
    id: string;
    type: 'login' | 'profile_update' | 'order' | 'message' | 'system';
    title: string;
    description: string;
    timestamp: Date;
    user?: {
      name: string;
      avatar?: string;
    };
    status?: 'success' | 'warning' | 'error' | 'info';
  }>;
  maxItems?: number;
}

const RecentActivity: React.FC<RecentActivityProps> = React.memo(({ 
  activities = [], 
  maxItems = 5 
}) => {
  const theme = useTheme();

  // Mock data if no activities provided
  const defaultActivities = useMemo(() => [
    {
      id: '1',
      type: 'login' as const,
      title: 'Successful Login',
      description: 'You logged in from a new device',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      status: 'success' as const,
    },
    {
      id: '2',
      type: 'order' as const,
      title: 'Order Placed',
      description: 'Order #12345 has been placed successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: 'success' as const,
    },
    {
      id: '3',
      type: 'profile_update' as const,
      title: 'Profile Updated',
      description: 'Your profile information has been updated',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      status: 'info' as const,
    },
    {
      id: '4',
      type: 'message' as const,
      title: 'New Message',
      description: 'You received a new message from support',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      status: 'info' as const,
    },
    {
      id: '5',
      type: 'system' as const,
      title: 'System Update',
      description: 'Your account has been updated with new features',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      status: 'success' as const,
    },
  ], []);

  const displayActivities = activities.length > 0 ? activities : defaultActivities;
  const limitedActivities = displayActivities.slice(0, maxItems);

  return (
    <Box sx={{ mb: { xs: 3, sm: 4 } }}>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 700, 
          mb: { xs: 3, sm: 4 }, 
          color: theme.palette.text.primary,
          fontSize: { xs: '1.3rem', sm: '1.4rem', md: '1.5rem' },
          letterSpacing: '-0.02em',
        }}
      >
        Recent Activity
      </Typography>
      <DashboardCard
        title="Recent Activity"
        sx={{
          p: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          '& .MuiCardContent-root': {
            p: 0,
          },
        }}
      >
        <Box sx={{ p: 3, pb: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Latest Updates
          </Typography>
        </Box>
        <Box sx={{ px: 3, pb: 3 }}>
          {limitedActivities.map((activity) => (
            <Box key={activity.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
              <ActivityItem {...activity} />
            </Box>
          ))}
        </Box>
        {displayActivities.length > maxItems && (
          <Box sx={{ p: 3, pt: 0, textAlign: 'center' }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                },
              }}
            >
              View All Activity
            </Button>
          </Box>
        )}
      </DashboardCard>
    </Box>
  );
});

RecentActivity.displayName = 'RecentActivity';

export default RecentActivity;
