'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  useTheme,
  Alert,
  CircularProgress,
  Grid,
  Stack,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material';
import {
  ShoppingBag,
  LocalShipping,
  CheckCircle,
  Cancel,
  Visibility,
  Refresh,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getRgbaColor } from '@/theme/colors';
import { getSessionId, setSessionId } from '@/utils/session';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: Array<{ url: string; alt?: string }>;
    brand?: string;
  };
  quantity: number;
  price: number;
  notes?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    email: string;
  };
  total: number;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancelledReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderSummary {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

const OrdersPage: React.FC = () => {
  const theme = useTheme();
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [, setTotalOrders] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchOrders = useCallback(async (page = 1, status = '') => {
    // Support both authenticated and anonymous users
    const sessionId = getSessionId();
    if (!token && !sessionId) {
      setError('Please login or add items to cart to view orders');
      setLoading(false);
      return;
    }
    
    if (!API_BASE) return;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(status && { status })
      });

      // Build headers based on authentication status
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else if (sessionId) {
        headers['X-Session-Id'] = sessionId;
      }

      const response = await fetch(`${API_BASE}/api/orders?${params}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      
      // Store sessionId if returned (for anonymous users)
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }
      
      console.log('Orders data:', data.data.orders);
      console.log('First order total:', data.data.orders[0]?.total);
      console.log('First order subtotal:', data.data.orders[0]?.subtotal);
      console.log('First order items:', data.data.orders[0]?.items);
      if (data.data.orders[0]?.items) {
        const firstOrderTotal = data.data.orders[0].items.reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0);
        console.log('Calculated first order total from items:', firstOrderTotal);
      }
      setOrders(data.data.orders);
      setTotalPages(data.data.pagination.pages);
      setTotalOrders(data.data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [token, API_BASE]);

  const fetchSummary = useCallback(async () => {
    // Support both authenticated and anonymous users
    const sessionId = getSessionId();
    if (!token && !sessionId) return;
    if (!API_BASE) return;

    try {
      // Build headers based on authentication status
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else if (sessionId) {
        headers['X-Session-Id'] = sessionId;
      }

      const response = await fetch(`${API_BASE}/api/orders/summary`, {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store sessionId if returned (for anonymous users)
        if (data.sessionId) {
          setSessionId(data.sessionId);
        }
        
        console.log('Order summary data:', data.data);
        setSummary(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch order summary:', err);
    }
  }, [token, API_BASE]);

  useEffect(() => {
    const sessionId = getSessionId();
    if (token || sessionId) {
      fetchOrders();
      fetchSummary();
    }
  }, [token, fetchOrders, fetchSummary]);

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    fetchOrders(1, status);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchOrders(page, statusFilter);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOrderDialogOpen(true);
  };

  const formatPrice = (price: number) => {
    // Handle NaN, null, undefined, or invalid numbers
    if (!price || isNaN(price) || !isFinite(price)) {
      return 'Tk 0.00';
    }
    
    const formatted = new Intl.NumberFormat('en-BD', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
    return `Tk ${formatted}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'processing': return 'primary';
      case 'shipped': return 'secondary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      case 'refunded': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ShoppingBag />;
      case 'confirmed': return <CheckCircle />;
      case 'processing': return <Refresh />;
      case 'shipped': return <LocalShipping />;
      case 'delivered': return <CheckCircle />;
      case 'cancelled': return <Cancel />;
      default: return <ShoppingBag />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && orders.length === 0) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ py: 4, mt: 15 }}>
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
              Loading your orders...
            </Typography>
          </Box>
        </Container>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ py: 4, mt: 15 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button 
            variant="outlined" 
            onClick={() => fetchOrders}
            startIcon={<Refresh />}
          >
            Retry
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, mt: 15 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            My Orders
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage your orders
          </Typography>
        </Box>

        {/* Guest User Alert */}
        {!token && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="body2">
                You&apos;re viewing orders as a guest. Login to access all your orders and account features.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={Link}
                  href="/login"
                  size="small"
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  href="/signup"
                  size="small"
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            </Box>
          </Alert>
        )}

        {/* Summary Cards */}
        {(summary || orders.length > 0) && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {orders.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFD700' }}>
                    {formatPrice(orders.reduce((sum, order) => {
                      // Calculate total from order items if order.total is not available
                      const orderTotal = order.total || order.subtotal || 
                        order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
                      return sum + (orderTotal || 0);
                    }, 0))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Spent
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                    {orders.filter(order => order.status === 'pending').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {orders.filter(order => order.status === 'delivered').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Delivered
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Filters */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              label="Filter by Status"
            >
              <MenuItem value="">All Orders</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => fetchOrders(currentPage, statusFilter)}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {/* Orders List */}
        {orders.length === 0 ? (
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
              <ShoppingBag sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              No Orders Found
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              {statusFilter 
                ? `No orders found with status "${statusFilter}"`
                : "You haven't placed any orders yet. Start shopping to see your orders here!"
              }
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
        ) : (
          <Stack spacing={3}>
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card elevation={0} sx={{ 
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: 2,
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          Order #{order.orderNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Placed on {formatDate(order.createdAt)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          icon={getStatusIcon(order.status)}
                          label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          color={getStatusColor(order.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                          size="small"
                        />
                        <IconButton
                          onClick={() => handleViewOrder(order)}
                          size="small"
                          sx={{ color: 'primary.main' }}
                        >
                          <Visibility />
                        </IconButton>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Items ({order.items.length})
                        </Typography>
                        <Stack spacing={1}>
                          {order.items.slice(0, 2).map((item) => (
                            <Box key={item._id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                src={item.product.images?.[0]?.url}
                                sx={{ width: 40, height: 40 }}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {item.product.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Qty: {item.quantity} × {formatPrice(item.price)}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                          {order.items.length > 2 && (
                            <Typography variant="caption" color="text.secondary">
                              +{order.items.length - 2} more items
                            </Typography>
                          )}
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Total Amount
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFD700' }}>
                            {formatPrice(order.total || order.subtotal || order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Payment: {order.paymentStatus}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => handlePageChange(page)}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </motion.div>

      {/* Order Details Dialog */}
      <Dialog 
        open={orderDialogOpen} 
        onClose={() => setOrderDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Order Details - #{selectedOrder?.orderNumber}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {selectedOrder && (
            <Stack spacing={3}>
              {/* Order Status */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Order Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    icon={getStatusIcon(selectedOrder.status)}
                    label={selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    color={getStatusColor(selectedOrder.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Payment: {selectedOrder.paymentStatus}
                  </Typography>
                </Box>
              </Box>

              {/* Order Items */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Order Items
                </Typography>
                <Stack spacing={2}>
                  {selectedOrder.items.map((item) => (
                    <Box key={item._id} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 1 }}>
                      <Avatar
                        src={item.product.images?.[0]?.url}
                        sx={{ width: 60, height: 60 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.product.brand && `Brand: ${item.product.brand}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {item.quantity}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#FFD700' }}>
                        {formatPrice(item.price * item.quantity)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Order Summary */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Order Summary
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body2">{formatPrice(selectedOrder.subtotal || selectedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Shipping</Typography>
                    <Typography variant="body2">{formatPrice(selectedOrder.shippingCost)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Tax</Typography>
                    <Typography variant="body2">{formatPrice(selectedOrder.taxAmount)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Discount</Typography>
                    <Typography variant="body2">-{formatPrice(selectedOrder.discountAmount)}</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFD700' }}>
                      {formatPrice(selectedOrder.total || selectedOrder.subtotal || selectedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Shipping Address */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Shipping Address
                </Typography>
                <Box sx={{ p: 2, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedOrder.shippingAddress.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedOrder.shippingAddress.street}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedOrder.shippingAddress.country}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phone: {selectedOrder.shippingAddress.phone}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email: {selectedOrder.shippingAddress.email}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOrderDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    <Footer />
    </>
  );
};

export default OrdersPage;