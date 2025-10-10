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
  ListItemButton,
  ListItemText,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Divider,
  Badge,
} from '@mui/material';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { usePathname, useRouter } from 'next/navigation';
import LogoutConfirmationModal from '@/components/ui/LogoutConfirmationModal';
import Link from 'next/link';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  
  // Calculate total items in cart
  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  
  const getDashboardPathForRole = () => {
    const role = user?.role;
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'moderator') return '/dashboard/moderator';
    return '/dashboard/user';
  };
  
  // Logout confirmation modal state
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleGoToProfile = () => {
    handleProfileMenuClose();
    router.push(getDashboardPathForRole());
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

  // Helper function to check if a menu item is active
  const isActivePage = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
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

  const menuItems = [
    { text: 'HOME', href: '/' },
    { text: 'PRODUCTS', href: '/products' },
    { text: 'ABOUT', href: '/about' },
    { text: 'CONTACT', href: '/contact' },
  ];

  const authMenuItems = [
    { text: 'LOGIN', href: '/login' }
  ];

  const drawer = (
    <Box sx={{ width: 250, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <List sx={{ py: 1 }}>
        {menuItems.map((item) => {
          const isActive = isActivePage(item.href);
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => { router.push(item.href); setMobileOpen(false); }}
                sx={{
                  background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  borderLeft: isActive ? `4px solid ${theme.palette.secondary.main}` : '4px solid transparent',
                  '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
                }}
              >
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: isActive ? theme.palette.secondary.main : theme.palette.primary.contrastText,
                      fontWeight: isActive ? 700 : 400,
                      fontSize: '1.1rem',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => { router.push(getDashboardPathForRole()); setMobileOpen(false); }}
              sx={{
                background: isActivePage('/dashboard') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                borderLeft: isActivePage('/dashboard') ? `4px solid ${theme.palette.secondary.main}` : '4px solid transparent',
                '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
              }}
            >
              <ListItemText 
                primary={'DASHBOARD'}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: isActivePage('/dashboard') ? theme.palette.secondary.main : theme.palette.primary.contrastText,
                    fontWeight: isActivePage('/dashboard') ? 700 : 400,
                    fontSize: '1.1rem',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => { router.push('/dashboard/user/cart'); setMobileOpen(false); }}
              sx={{
                background: isActivePage('/dashboard/user/cart') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                borderLeft: isActivePage('/dashboard/user/cart') ? `4px solid ${theme.palette.secondary.main}` : '4px solid transparent',
                '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Badge 
                  badgeContent={getTotalCartItems()} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.75rem',
                      minWidth: '18px',
                      height: '18px',
                      borderRadius: '9px',
                      background: '#FFD700',
                      color: '#000',
                      fontWeight: 600,
                    }
                  }}
                >
                  <ShoppingCartIcon sx={{ 
                    fontSize: '1.5rem',
                    color: isActivePage('/dashboard/user/cart') ? theme.palette.secondary.main : theme.palette.primary.contrastText,
                  }} />
                </Badge>
                <ListItemText 
                  primary={'CART'}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: isActivePage('/dashboard/user/cart') ? theme.palette.secondary.main : theme.palette.primary.contrastText,
                      fontWeight: isActivePage('/dashboard/user/cart') ? 700 : 400,
                      fontSize: '1.1rem',
                    },
                  }}
                />
              </Box>
            </ListItemButton>
          </ListItem>
        )}
        {!isAuthenticated && (
          authMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => { router.push(item.href); setMobileOpen(false); }}
                sx={{
                  background: isActivePage(item.href) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  borderLeft: isActivePage(item.href) ? `4px solid ${theme.palette.secondary.main}` : '4px solid transparent',
                  '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
                }}
              >
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      // color: isActivePage(item.href) ? theme.palette.secondary.main : theme.palette.primary.contrastText,
                      color: 'black',
                      fontWeight: isActivePage(item.href) ? 700 : 400,
                      fontSize: '1.1rem',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>

      {isAuthenticated && (
        <Box sx={{ mt: 'auto', p: 2 }}>
          <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Avatar src={user?.image} />
            <Box>
              <Typography variant="subtitle2" sx={{ color: theme.palette.primary.contrastText, fontWeight: 600 }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {user?.email}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => { router.push('/dashboard'); setMobileOpen(false); }}
              sx={{
                color: theme.palette.primary.contrastText,
                borderColor: 'rgba(255,255,255,0.6)',
                '&:hover': { borderColor: theme.palette.primary.contrastText, background: 'rgba(255,255,255,0.08)' },
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Profile
            </Button>
            <Button
              variant="outlined"
              onClick={handleLogoutClick}
              sx={{
                color: theme.palette.primary.contrastText,
                borderColor: 'rgba(255,255,255,0.6)',
                '&:hover': { borderColor: theme.palette.primary.contrastText, background: 'rgba(255,255,255,0.08)' },
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      )}
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
              {menuItems.map((item, index) => {
                const isActive = isActivePage(item.href);
                return (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Button
                      color="inherit"
                      component={Link}
                      href={item.href}
                      sx={{
                        color: isActive ? theme.palette.secondary.main : theme.palette.primary.contrastText,
                        fontWeight: isActive ? 700 : 500,
                        textTransform: 'none',
                        fontSize: '1rem',
                        position: 'relative',
                        '&:hover': {
                          color: theme.palette.secondary.main,
                          background: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&::after': isActive ? {
                          content: '""',
                          position: 'absolute',
                          bottom: '-8px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '20px',
                          height: '3px',
                          background: theme.palette.secondary.main,
                          borderRadius: '2px',
                        } : {},
                      }}
                    >
                      {item.text}
                    </Button>
                  </motion.div>
                );
              })}

              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: menuItems.length * 0.1 }}
                >
                  <Button
                    color="inherit"
                    component={Link}
                    href={getDashboardPathForRole()}
                    sx={{
                      color: isActivePage('/dashboard') ? theme.palette.secondary.main : theme.palette.primary.contrastText,
                      fontWeight: isActivePage('/dashboard') ? 700 : 500,
                      textTransform: 'none',
                      fontSize: '1rem',
                      position: 'relative',
                      '&:hover': {
                        color: theme.palette.secondary.main,
                        background: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&::after': isActivePage('/dashboard') ? {
                        content: '""',
                        position: 'absolute',
                        bottom: '-8px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '20px',
                        height: '3px',
                        background: theme.palette.secondary.main,
                        borderRadius: '2px',
                      } : {},
                    }}
                  >
                    DASHBOARD
                  </Button>
                </motion.div>
              )}

              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: menuItems.length * 0.1 }}
                >
                  <Button
                    color="inherit"
                    component={Link}
                    href={'/dashboard/user/cart'}
                    sx={{
                      color: isActivePage('/dashboard/user/cart') ? theme.palette.secondary.main : theme.palette.primary.contrastText,
                      fontWeight: isActivePage('/dashboard/user/cart') ? 700 : 500,
                      textTransform: 'none',
                      fontSize: '1rem',
                      position: 'relative',
                      minWidth: 'auto',
                      px: 2,
                      '&:hover': {
                        color: theme.palette.secondary.main,
                        background: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&::after': isActivePage('/dashboard/user/cart') ? {
                        content: '""',
                        position: 'absolute',
                        bottom: '-8px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '20px',
                        height: '3px',
                        background: theme.palette.secondary.main,
                        borderRadius: '2px',
                      } : {},
                    }}
                  >
                    <Badge 
                      badgeContent={getTotalCartItems()} 
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.75rem',
                          minWidth: '18px',
                          height: '18px',
                          borderRadius: '9px',
                          background: '#FFD700',
                          color: '#000',
                          fontWeight: 600,
                        }
                      }}
                    >
                      <ShoppingCartIcon sx={{ fontSize: '1.5rem' }} />
                    </Badge>
                  </Button>
                </motion.div>
              )}

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
                    <Avatar src={user?.image} sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>
                      {getInitials(user?.name)}
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
                    variant="outlined"
                    component={Link}
                    href="/login"
                    sx={{
                      background: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      borderRadius: '8px',
                      '&:hover': {
                        background: theme.palette.primary.dark,
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
        <MenuItem onClick={handleGoToProfile}>
          <Typography sx={{ color: theme.palette.primary.contrastText }}>Profile</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogoutClick}>
          <Typography sx={{ color: theme.palette.primary.contrastText }}>Logout</Typography>
        </MenuItem>
      </Menu>
      
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
    </>
  );
};

export default Header;
