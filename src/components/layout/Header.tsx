'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout, isAuthenticated } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  const menuItems = [
    { text: 'Home', href: '/' },
    { text: 'Products', href: '/products' },
    { text: 'About', href: '/about' },
    { text: 'Contact', href: '/contact' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} component="a" href={item.href}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: 'rgba(255, 255, 255, 0.35)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
        }}
        elevation={0}
      >
        <Toolbar>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                background: 'linear-gradient(45deg, #FFD700, #9C27B0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                // WebkitTextFillColor: 'transparent',
                cursor: 'pointer',
              }}
            >
              Qurrota Kids
            </Typography>
          </motion.div>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ ml: 'auto' }}
            >
              <MenuIcon sx={{ color: '#FFD700' }} />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 2 }}>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Button
                    color="inherit"
                    component="a"
                    href={item.href}
                    sx={{
                      color: '#333',
                      fontWeight: 500,
                      '&:hover': {
                        color: '#FFD700',
                        background: 'rgba(255, 255, 255, 0.97)',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                </motion.div>
              ))}

              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{ color: '#FFD700' }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#9C27B0' }}>
                      {user?.name.charAt(0)}
                    </Avatar>
                  </IconButton>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Button
                    variant="contained"
                    href="/login"
                    sx={{
                      background: 'linear-gradient(45deg, #FFD700, #FFC000)',
                      color: '#000',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FFC000, #FFD700)',
                      },
                    }}
                  >
                    Login
                  </Button>
                </motion.div>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        sx={{
          '& .MuiPaper-root': {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
          },
        }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <Typography>Profile</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
