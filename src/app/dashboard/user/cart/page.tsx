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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
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
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [clearCartDialogOpen, setClearCartDialogOpen] = useState(false);
  const [createdOrderData, setCreatedOrderData] = useState<{orderNumber?: string} | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orderForm, setOrderForm] = useState({
    shippingAddress: {
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Bangladesh',
      phone: '',
      email: '',
    },
    billingAddress: {
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Bangladesh',
      phone: '',
      email: '',
    },
    paymentMethod: 'cash_on_delivery',
    notes: '',
    useSameAddress: true,
  });

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

  const handleCheckout = () => {
    // Ensure cart is loaded and has items
    if (loading) {
      alert('Please wait while your cart is loading...');
      return;
    }
    
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }
    
    setCheckoutDialogOpen(true);
  };

  const handleContinueShopping = () => {
    setOrderSuccess(false);
  };

  const handleClearCartAfterOrder = async () => {
    try {
      setIsRefreshing(true);
      setClearCartDialogOpen(false);
      
      // Make direct API call to clear cart without using context
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = localStorage.getItem('authToken') || 
                   document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
      
      if (token && API_BASE) {
        console.log('Clearing cart with API call to:', `${API_BASE}/api/cart/clear`);
        console.log('Token available:', !!token);
        
        const response = await fetch(`${API_BASE}/api/cart/clear`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Clear cart response status:', response.status);
        console.log('Clear cart response ok:', response.ok);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Clear cart error response:', errorData);
          throw new Error(`Failed to clear cart: ${errorData.message || 'Unknown error'}`);
        }
        
        console.log('Cart cleared successfully');
      } else {
        console.warn('Missing token or API_BASE, skipping cart clear');
      }
      
      setOrderSuccess(true);
      
      // Show success message
      alert('Cart cleared successfully!');
      
      // Reload cart data from backend instead of page refresh
      await refreshCart();
    } catch (error) {
      console.error('Failed to clear cart with direct API call:', error);
      
      // Try fallback with context clearCart method
      try {
        console.log('Trying fallback with context clearCart...');
        await clearCart();
        alert('Order created successfully! Cart cleared using fallback method.');
        setClearCartDialogOpen(false);
        setOrderSuccess(true);
        setIsRefreshing(false);
        // No need to refresh - clearCart already updates the context
      } catch (fallbackError) {
        console.error('Fallback clearCart also failed:', fallbackError);
        alert(`Order created successfully! However, there was an issue clearing the cart: ${error instanceof Error ? error.message : 'Unknown error'}. You can clear it manually later.`);
        setClearCartDialogOpen(false);
        setOrderSuccess(true);
        setIsRefreshing(false);
        
        // Try to refresh cart data anyway
        try {
          await refreshCart();
        } catch (refreshError) {
          console.error('Failed to refresh cart data:', refreshError);
        }
      }
    }
  };

  const handleKeepCart = () => {
    setClearCartDialogOpen(false);
    setOrderSuccess(true);
  };

  const handleOrderFormChange = (field: string, value: string) => {
    setOrderForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (type: 'shipping' | 'billing', field: string, value: string) => {
    setOrderForm(prev => ({
      ...prev,
      [`${type}Address`]: {
        ...prev[`${type}Address`],
        [field]: value
      }
    }));
  };

  const handleUseSameAddressChange = (checked: boolean) => {
    setOrderForm(prev => ({
      ...prev,
      useSameAddress: checked,
      billingAddress: checked ? prev.shippingAddress : prev.billingAddress
    }));
  };

  const validateForm = () => {
    const { shippingAddress, billingAddress, useSameAddress } = orderForm;
    
    // Validate shipping address
    const requiredFields = ['name', 'street', 'city', 'state', 'zipCode', 'phone', 'email'];
    for (const field of requiredFields) {
      if (!shippingAddress[field as keyof typeof shippingAddress]) {
        return `Shipping ${field} is required`;
      }
    }

    // Validate billing address if not using same address
    if (!useSameAddress) {
      for (const field of requiredFields) {
        if (!billingAddress[field as keyof typeof billingAddress]) {
          return `Billing ${field} is required`;
        }
      }
    }

    return null;
  };

  const createOrder = async () => {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    // Check if cart has items
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }

    setIsCreatingOrder(true);
    try {
      // Refresh cart to ensure we have the latest data
      console.log('Refreshing cart before order creation...');
      await refreshCart();
      
      // Double-check cart has items after refresh
      if (cartItems.length === 0) {
        throw new Error('Cart is empty. Please add items before placing an order.');
      }

      const orderData = {
        paymentMethod: orderForm.paymentMethod,
        shippingAddress: orderForm.shippingAddress,
        billingAddress: orderForm.useSameAddress ? orderForm.shippingAddress : orderForm.billingAddress,
        notes: orderForm.notes,
        shippingCost: 0,
        taxAmount: getTotalPrice() * 0.1,
      };

      console.log('Creating order with data:', orderData);
      console.log('Cart items count:', cartItems.length);
      console.log('Cart items:', cartItems);
      
      // Make actual API call to create order
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!API_BASE) {
        throw new Error('API base URL not configured');
      }

      // Get authentication token
      const token = localStorage.getItem('authToken') || 
                   document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
      
      console.log('Token found:', !!token);
      console.log('Token length:', token?.length);
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const result = await response.json();
      console.log('Order created successfully:', result);
      
      // Store order data and show success
      setCreatedOrderData(result.data);
      setCheckoutDialogOpen(false);
      setOrderSuccess(true);
      
      // Show success toast
      alert(`Order created successfully! Order Number: ${result.data?.orderNumber || 'N/A'}`);
      
      // Ask user if they want to clear the cart
      setClearCartDialogOpen(true);
      
      // Reset form state
      setOrderForm({
        shippingAddress: {
          name: '',
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Bangladesh',
          phone: '',
          email: '',
        },
        billingAddress: {
          name: '',
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Bangladesh',
          phone: '',
          email: '',
        },
        paymentMethod: 'cash_on_delivery',
        notes: '',
        useSameAddress: true,
      });
      
    } catch (error) {
      console.error('Failed to create order:', error);
      alert(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('en-BD', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
    return `BDT ${formatted}`;
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
              bgcolor: orderSuccess ? 'success.main' : theme.palette.primary.main,
            }}>
              <ShoppingCart sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              {orderSuccess ? 'Order Placed Successfully!' : 'Your Cart is Empty'}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              {orderSuccess 
                ? 'Thank you for your order! We\'ll process it and send you a confirmation email shortly.'
                : 'Looks like you haven\'t added any items to your cart yet. Start shopping to fill it up!'
              }
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              {orderSuccess && (
                <Button
                  variant="outlined"
                  size="large"
                  href="/dashboard/user/orders"
                  startIcon={<Payment />}
                  sx={{
                    borderColor: 'success.main',
                    color: 'success.main',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    '&:hover': {
                      borderColor: 'success.dark',
                      background: 'success.light',
                    },
                  }}
                >
                  View Orders
                </Button>
              )}
              <Button
                variant="contained"
                size="large"
                href="/products"
                onClick={handleContinueShopping}
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
                {orderSuccess ? 'Continue Shopping' : 'Start Shopping'}
              </Button>
            </Box>
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
                          {formatPrice(item.product.price)}
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
                          {formatPrice(item.product.price * item.quantity)}
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
                      {formatPrice(getTotalPrice())}
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
                      {formatPrice(getTotalPrice() * 0.1)}
                    </Typography>
                  </Box>
                  
                  <Divider />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFD700' }}>
                      {formatPrice(getTotalPrice() * 1.1)}
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<Payment />}
                  onClick={handleCheckout}
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

      {/* Checkout Dialog */}
      <Dialog 
        open={checkoutDialogOpen} 
        onClose={() => !isCreatingOrder && setCheckoutDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { maxHeight: '90vh' }
        }}
      >
        <DialogTitle>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            Complete Your Order
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review your order and provide delivery details
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={4}>
            {/* Order Summary */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Order Summary
              </Typography>
              <Card variant="outlined">
                <CardContent sx={{ p: 2 }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Items ({getTotalItems()})</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatPrice(getTotalPrice())}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Shipping</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        Free
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Tax</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatPrice(getTotalPrice() * 0.1)}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFD700' }}>
                        {formatPrice(getTotalPrice() * 1.1)}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            {/* Shipping Address */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Shipping Address
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={orderForm.shippingAddress.name}
                    onChange={(e) => handleAddressChange('shipping', 'name', e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={orderForm.shippingAddress.phone}
                    onChange={(e) => handleAddressChange('shipping', 'phone', e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    value={orderForm.shippingAddress.street}
                    onChange={(e) => handleAddressChange('shipping', 'street', e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="City"
                    value={orderForm.shippingAddress.city}
                    onChange={(e) => handleAddressChange('shipping', 'city', e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="State/Division"
                    value={orderForm.shippingAddress.state}
                    onChange={(e) => handleAddressChange('shipping', 'state', e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    value={orderForm.shippingAddress.zipCode}
                    onChange={(e) => handleAddressChange('shipping', 'zipCode', e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={orderForm.shippingAddress.country}
                    onChange={(e) => handleAddressChange('shipping', 'country', e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={orderForm.shippingAddress.email}
                    onChange={(e) => handleAddressChange('shipping', 'email', e.target.value)}
                    required
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Billing Address */}
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={orderForm.useSameAddress}
                    onChange={(e) => handleUseSameAddressChange(e.target.checked)}
                  />
                }
                label="Use same address for billing"
              />
            </Box>

            {!orderForm.useSameAddress && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Billing Address
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={orderForm.billingAddress.name}
                      onChange={(e) => handleAddressChange('billing', 'name', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={orderForm.billingAddress.phone}
                      onChange={(e) => handleAddressChange('billing', 'phone', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      value={orderForm.billingAddress.street}
                      onChange={(e) => handleAddressChange('billing', 'street', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      label="City"
                      value={orderForm.billingAddress.city}
                      onChange={(e) => handleAddressChange('billing', 'city', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      label="State/Division"
                      value={orderForm.billingAddress.state}
                      onChange={(e) => handleAddressChange('billing', 'state', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      value={orderForm.billingAddress.zipCode}
                      onChange={(e) => handleAddressChange('billing', 'zipCode', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Country"
                      value={orderForm.billingAddress.country}
                      onChange={(e) => handleAddressChange('billing', 'country', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={orderForm.billingAddress.email}
                      onChange={(e) => handleAddressChange('billing', 'email', e.target.value)}
                      required
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Payment Method */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Payment Method
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={orderForm.paymentMethod}
                  onChange={(e) => handleOrderFormChange('paymentMethod', e.target.value)}
                  label="Payment Method"
                >
                  <MenuItem value="cash_on_delivery">Cash on Delivery</MenuItem>
                  {/* <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="debit_card">Debit Card</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="digital_wallet">Digital Wallet</MenuItem> */}
                </Select>
              </FormControl>
            </Box>

            {/* Order Notes */}
            <Box>
              <TextField
                fullWidth
                label="Order Notes (Optional)"
                multiline
                rows={3}
                value={orderForm.notes}
                onChange={(e) => handleOrderFormChange('notes', e.target.value)}
                placeholder="Any special instructions for your order..."
              />
            </Box>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={() => setCheckoutDialogOpen(false)}
            disabled={isCreatingOrder}
          >
            Cancel
          </Button>
          <Button
            onClick={createOrder}
            variant="contained"
            disabled={isCreatingOrder}
            startIcon={isCreatingOrder ? <CircularProgress size={20} /> : <Payment />}
            sx={{
              background: '#FFD700',
              color: '#000',
              fontWeight: 600,
              px: 4,
              '&:hover': {
                background: '#FFC000',
              },
              '&:disabled': {
                background: '#ccc',
                color: '#666',
              }
            }}
          >
            {isCreatingOrder ? 'Creating Order...' : 'Place Order'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear Cart After Order Dialog */}
      <Dialog 
        open={clearCartDialogOpen} 
        onClose={() => setClearCartDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Order Created Successfully!
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Avatar sx={{ 
              width: 60, 
              height: 60, 
              mx: 'auto', 
              mb: 2,
              bgcolor: 'success.main',
            }}>
              <Payment sx={{ fontSize: 30 }} />
            </Avatar>
            
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'success.main' }}>
              Order #{createdOrderData?.orderNumber || 'N/A'} Created!
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your order has been successfully created and will be processed soon.
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Would you like to clear your cart for a fresh start, or keep the items for future orders?
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 2, justifyContent: 'center' }}>
          <Button 
            onClick={handleKeepCart}
            variant="outlined"
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              px: 3,
            }}
          >
            Keep Cart Items
          </Button>
          <Button
            onClick={handleClearCartAfterOrder}
            variant="contained"
            disabled={isRefreshing}
            startIcon={isRefreshing ? <CircularProgress size={20} /> : undefined}
            sx={{
              background: '#FFD700',
              color: '#000',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                background: '#FFC000',
              },
              '&:disabled': {
                background: '#ccc',
                color: '#666',
              }
            }}
          >
            {isRefreshing ? 'Clearing Cart...' : 'Clear Cart'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CartPage;         