'use client';

import React, { useState, useEffect } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import DashboardDrawer from './DashboardDrawer';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  currentPath?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = React.memo(({
  children,
  title = 'Dashboard',
  currentPath = '/dashboard/user'
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);

  // Handle responsive drawer state
  useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Drawer */}
      <DashboardDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        onToggle={handleDrawerToggle}
        currentPath={currentPath}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/* Header */}
        <DashboardHeader
          onMenuClick={handleDrawerToggle}
          title={title}
        />

        {/* Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            mt: '64px', // Height of AppBar
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;
