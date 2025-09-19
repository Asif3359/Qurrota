'use client';

import React from 'react';
import { Box, Typography, Avatar, Chip, useTheme } from '@mui/material';
// import { formatDistanceToNow } from 'date-fns';

interface ActivityItemProps {
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
}

const ActivityItem: React.FC<ActivityItemProps> = React.memo(({
  type,
  title,
  description,
  timestamp,
  user,
  status = 'info'
}) => {
  const theme = useTheme();

  const getTypeIcon = () => {
    switch (type) {
      case 'login':
        return '🔐';
      case 'profile_update':
        return '👤';
      case 'order':
        return '📦';
      case 'message':
        return '💬';
      case 'system':
        return '⚙️';
      default:
        return '📋';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      case 'info':
      default:
        return theme.palette.info.main;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        p: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          transform: 'translateX(4px)',
        },
      }}
    >
      <Avatar
        sx={{
          width: 40,
          height: 40,
          backgroundColor: getStatusColor(),
          fontSize: '1.2rem',
        }}
      >
        {getTypeIcon()}
      </Avatar>
      
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            {title}
          </Typography>
          <Chip
            label={status}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.75rem',
              backgroundColor: getStatusColor(),
              color: 'white',
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            {new Date(timestamp).toLocaleDateString()}
          </Typography>
          {user && (
            <Typography variant="caption" color="text.secondary">
              by {user.name}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
});

ActivityItem.displayName = 'ActivityItem';

export default ActivityItem;
