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
    { text: 'HOME', href: '/' },
    { text: 'PRODUCTS', href: '/products' },
    { text: 'ABOUT', href: '/about' },
    { text: 'CONTACT', href: '/contact' },
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
          background: theme.palette.primary.main,
          boxShadow: 'none',
          borderBottom: 'none',
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
                color: theme.palette.primary.contrastText,
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
              sx={{ ml: 'auto', color: theme.palette.primary.contrastText }}
            >
              <MenuIcon />
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
                      color: theme.palette.primary.contrastText,
                      fontWeight: 500,
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        color: theme.palette.primary.contrastText,
                        background: 'rgba(0, 0, 0, 0.05)',
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
                    sx={{ color: theme.palette.primary.contrastText }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>
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
                      background: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      borderRadius: '8px',
                      px: 3,
                      py: 1,
                      border: `2px solid ${theme.palette.primary.contrastText}`,
                      '&:hover': {
                        background: theme.palette.primary.dark,
                        border: `2px solid ${theme.palette.primary.contrastText}`,
                      },
                    }}
                  >
                    LOGIN
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
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            background: theme.palette.primary.main,
          },
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
            background: theme.palette.primary.main,
            border: `2px solid ${theme.palette.primary.contrastText}`,
          },
        }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <Typography sx={{ color: theme.palette.primary.contrastText }}>Profile</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography sx={{ color: theme.palette.primary.contrastText }}>Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
