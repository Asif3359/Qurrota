'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  TextField,
  Divider,
  Chip,
  useTheme,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Stack,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  ShoppingBag,
  Payment,
  Security,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { getRgbaColor } from '@/theme/colors';

const CartPage: React.FC = () => {
  const theme = useTheme();
  const {
    cartItems,
    loading,
    error,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart
  } = useCart();

  // Debug cart data
  React.useEffect(() => {
    console.log('CartPage: Cart data debug:', {
      cartItems: cartItems,
      cartItemsLength: cartItems.length,
      loading: loading,
      error: error
    });
  }, [cartItems, loading, error]);

  const [quantityUpdates, setQuantityUpdates] = useState<{[key: string]: number}>({});
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    // Prevent multiple simultaneous updates for the same item
    if (updatingItems.has(itemId)) {
      console.log('Item is already being updated, skipping:', itemId);
      return;
    }
    
    // Update local state immediately for UI responsiveness
    setQuantityUpdates(prev => ({ ...prev, [itemId]: newQuantity }));
    setUpdatingItems(prev => new Set([...prev, itemId]));
    
    // Also update the cart immediately
    try {
      console.log('Updating quantity immediately:', { itemId, newQuantity });
      await updateCartItem(itemId, newQuantity);
      
      // Clear the local update since it's now synced with the server
      setQuantityUpdates(prev => {
        const newUpdates = { ...prev };
        delete newUpdates[itemId];
        return newUpdates;
      });
    } catch (error) {
      console.error('Failed to update quantity immediately:', error);
      // Revert the local state on error
      setQuantityUpdates(prev => {
        const newUpdates = { ...prev };
        delete newUpdates[itemId];
        return newUpdates;
      });
    } finally {
      // Remove from updating set
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleUpdateQuantity = async (itemId: string) => {
    const quantity = quantityUpdates[itemId];
    if (quantity && quantity > 0) {
      try {
        await updateCartItem(itemId, quantity);
        setQuantityUpdates(prev => {
          const newUpdates = { ...prev };
          delete newUpdates[itemId];
          return newUpdates;
        });
      } catch (error) {
        console.error('Failed to update quantity:', error);
      }
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setItemToRemove(itemId);
    setRemoveDialogOpen(true);
  };

  const confirmRemoveItem = async () => {
    if (itemToRemove) {
      try {
        console.log('Attempting to remove item:', itemToRemove);
        await removeFromCart(itemToRemove);
        console.log('Item removed successfully');
        setRemoveDialogOpen(false);
        setItemToRemove(null);
      } catch (error) {
        console.error('Failed to remove item:', error);
        // You could add a toast notification here
        alert(`Failed to remove item: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setClearDialogOpen(false);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading && cartItems.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={40} />
        <Typography variant="h6" color="text.secondary">
          Loading your cart...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="outlined" 
          onClick={refreshCart}
          startIcon={<ShoppingCart />}
        >
          Retry
        </Button>
        
        {/* Debug section - remove in production */}
        <Alert severity="info" sx={{ mt: 2 }}>
          Debug: Cart has {cartItems.length} items. Loading: {loading ? 'Yes' : 'No'}. Error: {error || 'None'}
        </Alert>
        <Button 
          variant="outlined" 
          onClick={refreshCart}
          startIcon={<ShoppingCart />}
          size="small"
          sx={{ mt: 1 }}
        >
          Manual Refresh
        </Button>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ 
            textAlign: 'center', 
            py: { xs: 6, md: 8 },
            background: getRgbaColor(theme.palette.primary.main, 0.05),
            borderRadius: 3,
            border: `2px dashed ${theme.palette.primary.main}20`
          }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              mx: 'auto', 
              mb: 3,
              bgcolor: theme.palette.primary.main,
            }}>
              <ShoppingCart sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              Your Cart is Empty
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              Looks like you haven&apos;t added any items to your cart yet. Start shopping to fill it up!
            </Typography>
            <Button
              variant="contained"
              size="large"
              href="/products"
              startIcon={<ShoppingBag />}
              sx={{
                background: '#FFD700',
                color: '#000',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                '&:hover': {
                  background: '#FFC000',
                },
              }}
            >
              Start Shopping
            </Button>
          </Box>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Shopping Cart
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card elevation={0} sx={{ 
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <CardContent sx={{ p: 0 }}>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      p: { xs: 2, md: 3 },
                      borderBottom: index < cartItems.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                      '&:hover': {
                        background: 'rgba(0,0,0,0.02)'
                      }
                    }}>
                      {/* Product Image */}
                      <Box sx={{ 
                        width: { xs: 80, sm: 100 },
                        height: { xs: 80, sm: 100 },
                        mr: { xs: 2, sm: 3 },
                        flexShrink: 0
                      }}>
                        <CardMedia
                          component="img"
                          image={item.product.images?.[0]?.url || '/placeholder-image.jpg'}
                          alt={item.product.name}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                      </Box>

                      {/* Product Details */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" component="h3" sx={{ 
                          fontWeight: 600, 
                          mb: 1,
                          fontSize: { xs: '1rem', sm: '1.1rem' }
                        }}>
                          {item.product.name}
                        </Typography>
                        
                        {item.product.brand && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Brand: {item.product.brand}
                          </Typography>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Chip
                            label={item.product.categories || 'General'}
                            size="small"
                            sx={{ 
                              background: theme.palette.primary.main,
                              color: 'white',
                              fontSize: '0.75rem'
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Stock: {item.product.stock}
                          </Typography>
                        </Box>

                        <Typography variant="h6" sx={{ 
                          fontWeight: 700, 
                          color: '#FFD700',
                          mb: 2
                        }}>
                          {formatPrice(item.product.price, item.product.currency)}
                        </Typography>

                        {/* Quantity Controls */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={async () => await handleQuantityChange(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updatingItems.has(item._id)}
                              sx={{
                                border: '1px solid rgba(0,0,0,0.2)',
                                borderRadius: 1,
                                width: 32,
                                height: 32,
                                opacity: updatingItems.has(item._id) ? 0.6 : 1,
                              }}
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                            
                            <TextField
                              value={quantityUpdates[item._id] ?? item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 1;
                                handleQuantityChange(item._id, value);
                              }}
                              onBlur={() => handleUpdateQuantity(item._id)}
                              size="small"
                              sx={{
                                width: 60,
                                '& .MuiInputBase-input': {
                                  textAlign: 'center',
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                }
                              }}
                              inputProps={{
                                min: 1,
                                max: item.product.stock,
                              }}
                            />
                            
                            <IconButton
                              size="small"
                              onClick={async () => await handleQuantityChange(item._id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock || updatingItems.has(item._id)}
                              sx={{
                                border: '1px solid rgba(0,0,0,0.2)',
                                borderRadius: 1,
                                width: 32,
                                height: 32,
                                opacity: updatingItems.has(item._id) ? 0.6 : 1,
                              }}
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </Box>

                          <Typography variant="body2" color="text.secondary">
                            Max: {item.product.stock}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Actions */}
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'flex-end',
                        gap: 1,
                        ml: 2
                      }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFD700' }}>
                          {formatPrice(item.product.price * item.quantity, item.product.currency)}
                        </Typography>
                        
                        <Tooltip title="Remove item">
                          <IconButton
                            onClick={() => handleRemoveItem(item._id)}
                            sx={{
                              color: 'error.main',
                              '&:hover': {
                                background: 'error.light',
                                color: 'error.dark',
                              }
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Cart Actions */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<Delete />}
                onClick={() => setClearDialogOpen(true)}
                sx={{
                  borderColor: 'error.main',
                  color: 'error.main',
                  '&:hover': {
                    borderColor: 'error.dark',
                    background: 'error.light',
                  }
                }}
              >
                Clear Cart
              </Button>
              
              <Button
                variant="outlined"
                href="/products"
                startIcon={<ShoppingBag />}
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                }}
              >
                Continue Shopping
              </Button>
            </Box>
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card elevation={0} sx={{ 
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: 2,
              position: 'sticky',
              top: 20
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  Order Summary
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">Subtotal ({getTotalItems()} items)</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatPrice(getTotalPrice(), cartItems[0]?.product.currency || 'USD')}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">Shipping</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                      Free
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">Tax</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatPrice(getTotalPrice() * 0.1, cartItems[0]?.product.currency || 'USD')}
                    </Typography>
                  </Box>
                  
                  <Divider />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFD700' }}>
                      {formatPrice(getTotalPrice() * 1.1, cartItems[0]?.product.currency || 'USD')}
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<Payment />}
                  sx={{
                    mt: 3,
                    background: '#FFD700',
                    color: '#000',
                    fontWeight: 600,
                    py: 1.5,
                    borderRadius: 2,
                    '&:hover': {
                      background: '#FFC000',
                    },
                  }}
                >
                  Proceed to Checkout
                </Button>

                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security sx={{ fontSize: 16, color: 'success.main' }} />
                  <Typography variant="caption" color="text.secondary">
                    Secure checkout with SSL encryption
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Remove Item Dialog */}
      <Dialog open={removeDialogOpen} onClose={() => setRemoveDialogOpen(false)}>
        <DialogTitle>Remove Item</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove this item from your cart?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmRemoveItem} color="error" variant="contained">
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear Cart Dialog */}
      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>Clear Cart</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove all items from your cart? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClearCart} color="error" variant="contained">
            Clear Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CartPage;         