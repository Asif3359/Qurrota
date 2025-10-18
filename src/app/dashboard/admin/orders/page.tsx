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
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  ShoppingBag,
  LocalShipping,
  CheckCircle,
  Cancel,
  Visibility,
  Refresh,
  Edit,
  Payment,
  TrackChanges,
  Person,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getRgbaColor } from '@/theme/colors';

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
  user?: {
    _id: string;
    name: string;
    email: string;
  };
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
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

const AdminOrdersPage: React.FC = () => {
  const theme = useTheme();
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [, setTotalOrders] = useState(0);

  // Status update dialog states
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
  const [paymentUpdateOpen, setPaymentUpdateOpen] = useState(false);
  const [trackingUpdateOpen, setTrackingUpdateOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [statusNotes, setStatusNotes] = useState('');

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchOrders = useCallback(async (page = 1, status = '', paymentStatus = '') => {
    if (!token || !API_BASE) return;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus })
      });

      console.log('Fetching orders with params:', params.toString());
      console.log('API_BASE:', API_BASE);
      console.log('Token available:', !!token);

      let response = await fetch(`${API_BASE}/api/orders/admin/all?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Admin endpoint response status:', response.status);

      // If admin endpoint fails, try user orders endpoint
      if (!response.ok) {
        console.log('Admin endpoint failed, trying user orders endpoint...');
        response = await fetch(`${API_BASE}/api/orders?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('User endpoint response status:', response.status);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch orders:', response.status, errorText);
        throw new Error(`Failed to fetch orders: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Orders API response:', data);
      console.log('Orders data:', data.data?.orders);
      console.log('Orders count:', data.data?.orders?.length || 0);
      
      if (data.data?.orders?.length > 0) {
        console.log('First order total:', data.data.orders[0]?.total);
        console.log('First order subtotal:', data.data.orders[0]?.subtotal);
        console.log('First order items:', data.data.orders[0]?.items);
        if (data.data.orders[0]?.items) {
          const firstOrderTotal = data.data.orders[0].items.reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0);
          console.log('Calculated first order total from items:', firstOrderTotal);
        }
      }
      
      const ordersData = data.data?.orders || [];
      setOrders(ordersData);
      setTotalPages(data.data?.pagination?.pages || 1);
      setTotalOrders(data.data?.pagination?.total || 0);
      
      // Calculate summary immediately after setting orders
      if (ordersData.length > 0) {
        console.log('Calculating summary immediately after orders fetch...');
        const totalRevenue = ordersData.reduce((sum: number, order: Order) => {
          const orderTotal = order.total || order.subtotal || order.items.reduce((itemSum: number, item: OrderItem) => itemSum + (item.price * item.quantity), 0);
          return sum + (orderTotal || 0);
        }, 0);
        
        const pendingOrders = ordersData.filter((order: Order) => order.status === 'pending').length;
        const deliveredOrders = ordersData.filter((order: Order) => order.status === 'delivered').length;
        const cancelledOrders = ordersData.filter((order: Order) => order.status === 'cancelled').length;

        console.log('Immediate summary calculation:', {
          totalOrders: ordersData.length,
          totalRevenue,
          pendingOrders,
          deliveredOrders,
          cancelledOrders
        });

        setSummary({
          totalOrders: ordersData.length,
          totalRevenue,
          pendingOrders,
          deliveredOrders,
          cancelledOrders
        });
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [token, API_BASE]);

  const fetchSummary = useCallback(async () => {
    if (!token || !API_BASE || orders.length === 0) return;

    try {
      // Calculate summary from current orders data
      console.log('Calculating summary from orders:', orders.length);
      
      const totalRevenue = orders.reduce((sum, order) => {
        const orderTotal = order.total || order.subtotal || order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
        console.log(`Order ${order.orderNumber}: total=${order.total}, subtotal=${order.subtotal}, calculated=${order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0)}`);
        return sum + (orderTotal || 0);
      }, 0);
      
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
      const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

      console.log('Calculated summary:', {
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        deliveredOrders,
        cancelledOrders
      });

      setSummary({
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        deliveredOrders,
        cancelledOrders
      });
    } catch (err) {
      console.error('Failed to calculate order summary:', err);
    }
  }, [orders, token, API_BASE]);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token, fetchOrders]);

  useEffect(() => {
    // Only fetch summary when we have orders data
    if (orders.length > 0) {
      fetchSummary();
    }
  }, [orders, fetchSummary]);

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    fetchOrders(1, status, paymentStatusFilter);
  };

  const handlePaymentStatusFilter = (paymentStatus: string) => {
    setPaymentStatusFilter(paymentStatus);
    setCurrentPage(1);
    fetchOrders(1, statusFilter, paymentStatus);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchOrders(page, statusFilter, paymentStatusFilter);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOrderDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/orders/${selectedOrder._id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          notes: statusNotes
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      setStatusUpdateOpen(false);
      setNewStatus('');
      setStatusNotes('');
      await fetchOrders(currentPage, statusFilter, paymentStatusFilter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async () => {
    if (!selectedOrder || !newPaymentStatus) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/orders/${selectedOrder._id}/payment-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentStatus: newPaymentStatus
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      setPaymentUpdateOpen(false);
      setNewPaymentStatus('');
      await fetchOrders(currentPage, statusFilter, paymentStatusFilter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payment status');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTracking = async () => {
    if (!selectedOrder || !trackingNumber) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/orders/${selectedOrder._id}/tracking`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackingNumber,
          estimatedDelivery: estimatedDelivery || undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add tracking information');
      }

      setTrackingUpdateOpen(false);
      setTrackingNumber('');
      setEstimatedDelivery('');
      await fetchOrders(currentPage, statusFilter, paymentStatusFilter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add tracking');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'paid': return 'success';
      case 'failed': return 'error';
      case 'refunded': return 'default';
      default: return 'default';
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
            Loading orders...
          </Typography>
        </Box>
      </Container>
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
          onClick={() => fetchOrders()}
          startIcon={<Refresh />}
        >
          Retry
        </Button>
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
            Orders Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track all customer orders
          </Typography>
        </Box>

        {/* Summary Cards */}
        {summary && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {summary.totalOrders}
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
                    {formatPrice(summary.totalRevenue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                    {summary.pendingOrders}
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
                    {summary.deliveredOrders}
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
            <InputLabel>Order Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              label="Order Status"
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
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Payment Status</InputLabel>
            <Select
              value={paymentStatusFilter}
              onChange={(e) => handlePaymentStatusFilter(e.target.value)}
              label="Payment Status"
            >
              <MenuItem value="">All Payments</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="refunded">Refunded</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => fetchOrders(currentPage, statusFilter, paymentStatusFilter)}
            disabled={loading}
          >
            Refresh
          </Button>
          
          <Button
            variant="outlined"
            onClick={async () => {
              console.log('Manual test - fetching orders...');
              try {
                const response = await fetch(`${API_BASE}/api/orders?page=1&limit=100`, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                });
                console.log('Manual test response:', response.status);
                if (response.ok) {
                  const data = await response.json();
                  console.log('Manual test data:', data);
                  setOrders(data.data?.orders || []);
                }
              } catch (err) {
                console.error('Manual test error:', err);
              }
            }}
            disabled={loading}
          >
            Test Fetch
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => {
              console.log('Manual summary calculation...');
              console.log('Current orders:', orders);
              console.log('Orders length:', orders.length);
              
              if (orders.length > 0) {
                const totalRevenue = orders.reduce((sum, order) => {
                  const orderTotal = order.total || order.subtotal || order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
                  console.log(`Order ${order.orderNumber}: total=${order.total}, subtotal=${order.subtotal}, calculated=${order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0)}`);
                  return sum + (orderTotal || 0);
                }, 0);
                
                const pendingOrders = orders.filter(order => order.status === 'pending').length;
                const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
                const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

                console.log('Manual calculation result:', {
                  totalOrders: orders.length,
                  totalRevenue,
                  pendingOrders,
                  deliveredOrders,
                  cancelledOrders
                });

                setSummary({
                  totalOrders: orders.length,
                  totalRevenue,
                  pendingOrders,
                  deliveredOrders,
                  cancelledOrders
                });
              } else {
                console.log('No orders to calculate summary from');
              }
            }}
            disabled={loading}
          >
            Calculate Summary
          </Button>
        </Box>

        {/* Orders Table */}
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
              {statusFilter || paymentStatusFilter 
                ? `No orders found with the selected filters`
                : "No orders have been placed yet."
              }
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.1)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                  <TableCell sx={{ fontWeight: 600 }}>Order</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Payment</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          #{order.orderNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {order.user?.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.user?.email || 'No email'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(order.status)}
                        label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        color={getStatusColor(order.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        color={getPaymentStatusColor(order.paymentStatus) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFD700' }}>
                        {formatPrice(order.total || order.subtotal || order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(order.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="View Details">
                          <IconButton
                            onClick={() => handleViewOrder(order)}
                            size="small"
                            color="primary"
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Update Status">
                          <IconButton
                            onClick={() => {
                              setSelectedOrder(order);
                              setStatusUpdateOpen(true);
                            }}
                            size="small"
                            color="info"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Payment Status">
                          <IconButton
                            onClick={() => {
                              setSelectedOrder(order);
                              setPaymentUpdateOpen(true);
                            }}
                            size="small"
                            color="success"
                          >
                            <Payment />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Add Tracking">
                          <IconButton
                            onClick={() => {
                              setSelectedOrder(order);
                              setTrackingUpdateOpen(true);
                            }}
                            size="small"
                            color="secondary"
                          >
                            <TrackChanges />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
              {/* Customer Info */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Customer Information
                </Typography>
                <Box sx={{ p: 2, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedOrder.user?.name || 'Unknown User'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedOrder.user?.email || 'No email'}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>

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
                  <Chip
                    label={selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                    color={getPaymentStatusColor(selectedOrder.paymentStatus) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                  />
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

      {/* Status Update Dialog */}
      <Dialog open={statusUpdateOpen} onClose={() => setStatusUpdateOpen(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>New Status</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="New Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="refunded">Refunded</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Notes (optional)"
              multiline
              rows={3}
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusUpdateOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateStatus} variant="contained" disabled={loading}>
            {loading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Status Update Dialog */}
      <Dialog open={paymentUpdateOpen} onClose={() => setPaymentUpdateOpen(false)}>
        <DialogTitle>Update Payment Status</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={newPaymentStatus}
                onChange={(e) => setNewPaymentStatus(e.target.value)}
                label="Payment Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="refunded">Refunded</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentUpdateOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdatePaymentStatus} variant="contained" disabled={loading}>
            {loading ? 'Updating...' : 'Update Payment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tracking Update Dialog */}
      <Dialog open={trackingUpdateOpen} onClose={() => setTrackingUpdateOpen(false)}>
        <DialogTitle>Add Tracking Information</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Estimated Delivery Date"
              type="date"
              value={estimatedDelivery}
              onChange={(e) => setEstimatedDelivery(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrackingUpdateOpen(false)}>Cancel</Button>
          <Button onClick={handleAddTracking} variant="contained" disabled={loading || !trackingNumber}>
            {loading ? 'Adding...' : 'Add Tracking'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminOrdersPage;