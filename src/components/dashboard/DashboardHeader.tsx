'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  Settings,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { appGradients } from '@/theme/colors';
import LogoutConfirmationModal from '@/components/ui/LogoutConfirmationModal';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  onMenuClick: () => void;
  title?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = React.memo(({
  onMenuClick,
  title = 'Qurrota Kids'
}) => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();
  // Logout confirmation modal state
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
    handleProfileMenuClose();
  };

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  const handleCancelLogout = () => {
    setLogoutModalOpen(false);
    setIsLoggingOut(false);
  };

  const handleProfile = () => {
    router.push('/dashboard/user/profile');
    handleProfileMenuClose();
  };

  const handleSettings = () => {
    router.push('/dashboard/user/settings');
    handleProfileMenuClose();
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side - Menu button and title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onMenuClick}
            edge="start"
            sx={{
              mr: 2,
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 600,
              background: appGradients.primary(theme),
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer',
            }}
            onClick={() => router.push('/')}
          >
            Qurrota Kids
          </Typography>
        </Box>

        {/* Right side - Notifications and Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <IconButton
            color="inherit"
            sx={{
              backgroundColor: theme.palette.action.hover,
              '&:hover': {
                backgroundColor: theme.palette.action.selected,
              },
            }}
          >
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            onClick={handleProfileMenuOpen}
            sx={{
              p: 0.5,
              backgroundColor: theme.palette.action.hover,
              '&:hover': {
                backgroundColor: theme.palette.action.selected,
              },
            }}    
          >
            <Avatar
              src={user?.image}
              sx={{
                width: 36,
                height: 36,
                backgroundColor: theme.palette.primary.main,
                border: `2px solid ${theme.palette.primary.light}`,
              }}
            >
              {getInitials(user?.name)}
            </Avatar>
          </IconButton>

          {/* Profile Menu Dropdown */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                boxShadow: theme.shadows[8],
                border: `1px solid ${theme.palette.divider}`,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfile}>
              <AccountCircle sx={{ mr: 2 }} />
              Profile
            </MenuItem>
            {/* <MenuItem onClick={handleSettings}>
              <Settings sx={{ mr: 2 }} />
              Settings
            </MenuItem> */}
            <Divider />
            <MenuItem onClick={handleLogoutClick} sx={{ color: theme.palette.error.main }}>
              <Logout sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
      
      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        open={logoutModalOpen}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        isLoggingOut={isLoggingOut}
        user={user ? {
          name: user.name,
          email: user.email,
          image: user.image
        } : undefined}
      />
    </AppBar>
  );
});

DashboardHeader.displayName = 'DashboardHeader';

export default DashboardHeader;
