'use client';

import React, { useState } from 'react';
import { Box, Button, Typography, Paper, useTheme } from '@mui/material';
import { DashboardLayout } from './index';

const DrawerDemo: React.FC = () => {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const pages = [
    { id: 'dashboard', title: 'Dashboard', path: '/dashboard/user' },
    { id: 'profile', title: 'Profile', path: '/profile' },
    { id: 'orders', title: 'Orders', path: '/orders' },
    { id: 'settings', title: 'Settings', path: '/settings' },
  ];

  return (
    <DashboardLayout 
      title={pages.find(p => p.id === currentPage)?.title || 'Dashboard'}
      currentPath={pages.find(p => p.id === currentPage)?.path || '/dashboard/user'}
    >
      <Box sx={{ p: 4 }}>
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Drawer Dashboard Demo
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            This demonstrates the collapsible drawer navigation. Click the menu button in the header 
            or use the toggle button in the drawer to collapse/expand the sidebar.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            {pages.map((page) => (
              <Button
                key={page.id}
                variant={currentPage === page.id ? 'contained' : 'outlined'}
                onClick={() => setCurrentPage(page.id)}
                sx={{
                  background: currentPage === page.id 
                    ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                    : 'transparent',
                  '&:hover': {
                    background: currentPage === page.id 
                      ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                      : theme.palette.action.hover,
                  },
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          <Typography variant="h6" gutterBottom>
            Features:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li>Collapsible sidebar with smooth animations</li>
            <li>Responsive design (mobile drawer, desktop permanent)</li>
            <li>User profile section in drawer header</li>
            <li>Navigation items with active states</li>
            <li>Settings and logout sections</li>
            <li>Header with notifications and profile menu</li>
            <li>Theme integration with your color scheme</li>
          </Box>
        </Paper>

        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Current Page: {pages.find(p => p.id === currentPage)?.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The drawer navigation will highlight the current page and show the appropriate title in the header.
          </Typography>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default DrawerDemo;
