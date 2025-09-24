'use client';

import React, { useMemo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import QuickActionButton from './QuickActionButton';
import { 
  ShoppingCart, 
  Person, 
  Support,
  History,
  Favorite,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface QuickActionsProps {
  onActionClick?: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = React.memo(({ onActionClick }) => {
  const theme = useTheme();
  const router = useRouter();
  const actions = useMemo(() => [
    {
      icon: <ShoppingCart />,
      label: 'New Order',
      action: 'new_order',
      variant: 'primary' as const,
    },
    {
      icon: <Person />,
      label: 'Edit Profile',
      action: 'edit_profile',
      variant: 'secondary' as const,
    },
    {
      icon: <History />,
      label: 'Orders',
      action: 'orders',
      variant: 'outlined' as const,
    },
    {
      icon: <Favorite />,
      label: 'Wishlist',
      action: 'wishlist',
      variant: 'outlined' as const,
    },
    // {
    //   icon: <Payment />,
    //   label: 'Payment Methods',
    //   action: 'payment_methods',
    //   variant: 'outlined' as const,
    // },
    // {
    //   icon: <Settings />,
    //   label: 'Settings',
    //   action: 'settings',
    //   variant: 'outlined' as const,
    // },
    // {
    //   icon: <Security />,
    //   label: 'Security',
    //   action: 'security',
    //   variant: 'outlined' as const,
    // },
    {
      icon: <Support />,
      label: 'Support',
      action: 'support',
      variant: 'outlined' as const,
    },
  ], []);

  const handleActionClick = (action: string) => {
    if (onActionClick) {
      onActionClick(action);
    } else {
      // Default navigation logic
      switch (action) {
        case 'new_order':
          router.push('/products');
          break;
        case 'edit_profile':
          router.push('/dashboard/user/profile');
          break;
        case 'orders':
          // Navigate to order history
          router.push('/dashboard/user/orders');
          break;
        case 'wishlist':
          // Navigate to wishlist
          router.push('/dashboard/user/wishlist');
          break;
        case 'payment_methods':
          // Navigate to payment methods
          break;
        case 'settings':
          // Navigate to settings
          break;
        case 'security':
          // Navigate to security settings
          break;
        case 'support':
          router.push('/dashboard/user/support');
          break;
        default:
          break;
      }
    }
  };

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
        Quick Actions
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: { xs: 1.5, sm: 2, md: 2 },
        }}
      >
        {actions.map((action, index) => (
          <QuickActionButton
            key={index}
            icon={action.icon}
            label={action.label}
            onClick={() => handleActionClick(action.action)}
            variant={action.variant}
          />
        ))}
      </Box>
    </Box>
  );
});

QuickActions.displayName = 'QuickActions';

export default QuickActions;
