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
  Container,
} from '@mui/material';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { usePathname, useRouter } from 'next/navigation';
import LogoutConfirmationModal from '@/components/ui/LogoutConfirmationModal';
import Link from 'next/link';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import QurrotaLogo from '../../lib/QurrotaLogo';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1100 }}>
        {/* Top Bar - Dark Section */}


        {/* Main Header - Purple Section */}
        <AppBar
          position="static"
          sx={{
            background: theme.palette.primary.main,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            borderBottom: 'none',
          }}
          elevation={0}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ px: { xs: 0, sm: 2 } }}>
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Box sx={{ width: 160, height: 50, display: 'flex', alignItems: 'center' }}>
                      <QurrotaLogo />
                    </Box>
                  </Box>
                </Link>
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
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 1 }}>
                  {/* Menu Items */}
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
                            color: theme.palette.primary.contrastText,
                            fontWeight: isActive ? 600 : 400,
                            textTransform: 'capitalize',
                            fontSize: '1rem',
                            px: 2,
                            py: 1,
                            position: 'relative',
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.1)',
                            },
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              bottom: 0,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: isActive ? '60%' : '0%',
                              height: '3px',
                              background: theme.palette.secondary.main,
                              borderRadius: '2px 2px 0 0',
                              transition: 'width 0.3s ease',
                            },
                            '&:hover::after': {
                              width: '60%',
                            },
                          }}
                        >
                          {item.text.charAt(0) + item.text.slice(1).toLowerCase()}
                        </Button>
                      </motion.div>
                    );
                  })}

                  {/* Dashboard */}
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
                          color: theme.palette.primary.contrastText,
                          fontWeight: isActivePage('/dashboard') ? 600 : 500,
                          textTransform: 'capitalize',
                          fontSize: '1rem',
                          px: 2,
                          py: 1,
                          position: 'relative',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.1)',
                          },
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: isActivePage('/dashboard') ? '60%' : '0%',
                            height: '3px',
                            background: theme.palette.secondary.main,
                            borderRadius: '2px 2px 0 0',
                            transition: 'width 0.3s ease',
                          },
                          '&:hover::after': {
                            width: '60%',
                          },
                        }}
                      >
                        Dashboard
                      </Button>
                    </motion.div>
                  )}

                  {/* Cart */}
                  {isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: menuItems.length * 0.1 }}
                    >
                      <IconButton
                        component={Link}
                        href={'/dashboard/user/cart'}
                        sx={{
                          color: theme.palette.primary.contrastText,
                          position: 'relative',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.1)',
                          },
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: isActivePage('/dashboard/user/cart') ? '60%' : '0%',
                            height: '3px',
                            background: theme.palette.secondary.main,
                            borderRadius: '2px 2px 0 0',
                            transition: 'width 0.3s ease',
                          },
                          '&:hover::after': {
                            width: '60%',
                          },
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
                            },
                          }}
                        >
                          <ShoppingCartIcon sx={{ fontSize: '1.5rem' }} />
                        </Badge>
                      </IconButton>
                    </motion.div>
                  )}

                  {/* Login/Signup or Profile */}
                  {isAuthenticated ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <IconButton
                        onClick={handleProfileMenuOpen}
                        sx={{
                          color: theme.palette.primary.contrastText,
                          ml: 1,
                        }}
                      >
                        <Avatar
                          src={user?.image}
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: theme.palette.secondary.main,
                          }}
                        >
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
                        component={Link}
                        href="/login"
                        sx={{
                          color: theme.palette.primary.contrastText,
                          fontWeight: isActivePage('/login') ? 600 : 500,
                          textTransform: 'capitalize',
                          fontSize: '1rem',
                          px: 2,
                          py: 1,
                          ml: 1,
                          position: 'relative',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.1)',
                          },
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: isActivePage('/login') ? '60%' : '0%',
                            height: '3px',
                            background: theme.palette.secondary.main,
                            borderRadius: '2px 2px 0 0',
                            transition: 'width 0.3s ease',
                          },
                          '&:hover::after': {
                            width: '60%',
                          },
                        }}
                      >
                        Login/Signup
                      </Button>
                    </motion.div>
                  )}
                </Box>
              )}
            </Toolbar>
          </Container>
        </AppBar>
        {!isMobile && (
          <Box
            sx={{
              background: '#363535',
              py: 1,
            }}
          >
            <Container maxWidth="xl" sx={{px: {xs: 2, sm: 3, md: 7}}}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'end',
                  gap: 3,
                }}
              >
                {/* Categories Dropdown */}
                <Button
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    color: '#fff',
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Categories
                </Button>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ fontSize: 18, color: '#fff' }} />
                    <Typography
                      sx={{
                        color: '#fff',
                        fontSize: '0.9rem',
                        fontWeight: 400,
                      }}
                    >
                      +880 01789846204
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 18, color: '#fff' }} />
                    <Typography
                      sx={{
                        color: '#fff',
                        fontSize: '0.9rem',
                        fontWeight: 400,
                      }}
                    >
                      info@qurrota.com
                    </Typography>
                  </Box>
              </Box>
            </Container>
          </Box>
        )}
      </Box>

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
