'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Modal,
  IconButton,
  Divider,
  Rating,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ShoppingCart, Favorite, Star, Close, Visibility } from '@mui/icons-material';
import { getRgbaColor } from '@/theme/colors';
import { normalizeCsvInput } from '../utils/displayCsv';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

type Product = {
  _id: string;
  name: string;
  slug?: string;
  brand?: string;
  price: number;
  stock?: number;
  isPublished?: boolean;
  updatedAt?: string;
  createdAt?: string;
  currency?: string;
  sku?: string;
  images: Array<{ url: string; alt: string; publicId?: string; isPrimary?: boolean }>;
  ratingCount: number;
  ratingAverage?: number;
  description?: string;
  categories?: string;
  tags?: string;
  compareAtPrice?: number;
  variants?: Array<{
    name?: string;
    sku?: string;
    price?: number;
    stock?: number;
    isActive?: boolean;
  }>;
};

const ProductsSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { token, user } = useAuth();
  const { addToCart: addToCartContext, isInCart } = useCart();
  
  // Debug user data on component mount
  React.useEffect(() => {
    console.log('ProductsSection: User data debug:', {
      user: user,
      user_id: user?.id,
      token: token ? 'present' : 'missing',
      isAuthenticated: !!user,
      userKeys: user ? Object.keys(user) : 'no user'
    });
  }, [user, token]);
  const [loading, setLoading]=React.useState(false);
  const [error, setError]= React.useState<string | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [wishlistItems, setWishlistItems] = React.useState<Set<string>>(new Set());
  const [loadingStates, setLoadingStates] = React.useState<{[key: string]: boolean}>({});

  const apiBase =  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/published`;

    const getProducts = React.useCallback(async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const [pubRes] = await Promise.all([
          fetch(`${apiBase}`, { cache: 'no-store' }),
        ]);
        if (!pubRes.ok) throw new Error('Failed to load products');
        const pubData = await pubRes.json();
        // console.log(pubData.data)
        setProducts(pubData.data ?? []);

      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Something went wrong';
        setError(message);
      } finally {
        setLoading(false);
      }
    }, []);

  React.useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0); // Reset to first image when opening modal
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    setSelectedImageIndex(0);
  };

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Wishlist API functions
  const addToWishlist = async (productId: string) => {
    if (!token) {
      alert('Please login to add items to wishlist');
      return;
    }

    // Try to get user ID from multiple sources
    let userId = user?.id;
    
    // Fallback: try to get user ID from token payload (if it's a JWT)
    if (!userId && token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        userId = tokenPayload.id || tokenPayload.userId || tokenPayload.sub;
        console.log('Extracted user ID from token for wishlist:', userId);
      } catch (error) {
        console.error('Failed to extract user ID from token for wishlist:', error);
      }
    }

    if (!userId) {
      console.error('User ID is missing for wishlist:', { 
        user, 
        token: token ? 'present' : 'missing'
      });
      
      // Try to get user ID from localStorage/sessionStorage as last resort
      try {
        const storedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          userId = parsedUser.id || parsedUser._id;
          console.log('Found user ID in storage for wishlist:', userId);
        }
      } catch (error) {
        console.error('Failed to get user from storage for wishlist:', error);
      }
      
      if (!userId) {
        alert('User information is missing. Please login again.');
        return;
      }
    }

    setLoadingStates(prev => ({ ...prev, [`wishlist-${productId}`]: true }));
    
    try {
      console.log('Adding to wishlist:', { productId, token: token ? 'present' : 'missing' });
      
      const response = await fetch('http://localhost:3000/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: productId,
          notes: '',
          userId: userId
        })
      });

      console.log('Wishlist API response:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('Wishlist API success:', result);
        setWishlistItems(prev => new Set([...prev, productId]));
        alert('Added to wishlist!');
      } else {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Wishlist API error:', error);
        alert(`Error adding item to wishlist: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Wishlist network error:', error);
      alert(`Network error: ${error instanceof Error ? error.message : 'Failed to add to wishlist'}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`wishlist-${productId}`]: false }));
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!token) return;

    setLoadingStates(prev => ({ ...prev, [`wishlist-${productId}`]: true }));
    
    try {
      const response = await fetch(`http://localhost:3000/api/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setWishlistItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        alert('Removed from wishlist!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      alert('Failed to remove from wishlist');
    } finally {
      setLoadingStates(prev => ({ ...prev, [`wishlist-${productId}`]: false }));
    }
  };

  const checkWishlistStatus = React.useCallback(async (productId: string) => {
    if (!token) return false;

    try {
      const response = await fetch(`http://localhost:3000/api/wishlist/check/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.inWishlist || false;
      }
    } catch (error) {
      console.error('Wishlist check error:', error);
    }
    return false;
  }, [token]);

  // Cart function using context
  const addToCart = async (productId: string) => {
    setLoadingStates(prev => ({ ...prev, [`cart-${productId}`]: true }));
    
    try {
      await addToCartContext(productId, 1, '');
      alert('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to add to cart'}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`cart-${productId}`]: false }));
    }
  };

  // Check wishlist status for all products
  React.useEffect(() => {
    if (products.length > 0 && token) {
      const checkAllWishlistStatuses = async () => {
        const wishlistPromises = products.map(product => checkWishlistStatus(product._id));
        const wishlistResults = await Promise.all(wishlistPromises);
        
        const wishlistSet = new Set<string>();
        products.forEach((product, index) => {
          if (wishlistResults[index]) wishlistSet.add(product._id);
        });
        
        setWishlistItems(wishlistSet);
      };
      
      checkAllWishlistStatuses();
    }
  }, [products, token, checkWishlistStatus]);

  return (
    <Box
      sx={{
        pt: 6,
        pb: 6,
        // background: 'rgba(255, 255, 255, 0.8)',
        background: getRgbaColor(theme.palette.primary.main, 0.76),
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container maxWidth="lg" >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant={isSmallMobile ? 'h5' : isMobile ? 'h4' : 'h3'}
            component="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#FFD700',
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' },
            }}
          >
            Featured Products
          </Typography>
          
          <Typography
            variant={isSmallMobile ? 'body1' : 'h6'}
            align="center"
            color="text.secondary"
            sx={{ 
              mb: { xs: 4, sm: 5, md: 6 }, 
              maxWidth: 600, 
              mx: 'auto',
              px: { xs: 1, sm: 2 },
              fontSize: { xs: '0.875rem', sm: '1.25rem' },
            }}
          >
            Discover our carefully curated collection of premium products for kids and new mothers
          </Typography>
        </motion.div>

        {loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Loading products...
            </Typography>
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Box>
        )}

        {!loading && !error && products.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No products available
            </Typography>
          </Box>
        )}

        {!loading && !error && products.length > 0 && (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)', 
              lg: 'repeat(3, 1fr)' 
            },
            gap: { xs: 2, sm: 3, md: 3 }
          }}>
            {products.map((product, index) => (
            <Box key={product._id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: isMobile ? 0 : -10 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    borderRadius: { xs: 2, sm: 3 },
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#FFD700',
                      background: 'rgba(255, 255, 255, 0.95)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      image={product.images?.[0]?.url || '/placeholder-image.jpg'}
                      alt={product.name}
                      sx={{ 
                        objectFit: 'cover', 
                        width: '100%', 
                        height: { xs: '180px', sm: '200px', md: '220px' }
                      }}
                    />
                    
                    {/* Badges */}
                    <Box sx={{ 
                      position: 'absolute', 
                      top: { xs: 8, sm: 12 }, 
                      left: { xs: 8, sm: 12 }, 
                      display: 'flex', 
                      gap: { xs: 0.5, sm: 1 },
                      flexDirection: { xs: 'column', sm: 'row' }
                    }}>
                      {/* Show "New" badge for recently created products (within last 30 days) */}
                      {product.createdAt && new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                        <Chip
                          label="New"
                          size={isSmallMobile ? "small" : "small"}
                          sx={{
                            background: '#FFD700',
                            color: '#000',
                            fontWeight: 600,
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            height: { xs: 20, sm: 24 },
                          }}
                        />
                      )}
                      {/* Show "Popular" badge for products with high rating count */}
                      {product.ratingCount && product.ratingCount >= 5 && (
                        <Chip
                          label="Popular"
                          size={isSmallMobile ? "small" : "small"}
                          sx={{
                            background: '#9C27B0',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            height: { xs: 20, sm: 24 },
                          }}
                        />
                      )}
                    </Box>

                    {/* Favorite/Wishlist Button */}
                    {/* <Button
                      onClick={() => {
                        if (wishlistItems.has(product._id)) {
                          removeFromWishlist(product._id);
                        } else {
                          addToWishlist(product._id);
                        }
                      }}
                      disabled={loadingStates[`wishlist-${product._id}`]}
                      sx={{
                        position: 'absolute',
                        top: { xs: 8, sm: 12 },
                        right: { xs: 8, sm: 12 },
                        minWidth: 'auto',
                        width: { xs: 32, sm: 40 },
                        height: { xs: 32, sm: 40 },
                        borderRadius: '50%',
                        background: wishlistItems.has(product._id) 
                          ? 'rgba(255, 215, 0, 0.9)' 
                          : 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          background: wishlistItems.has(product._id) 
                            ? 'rgba(255, 215, 0, 1)' 
                            : 'rgba(255, 255, 255, 1)',
                        },
                        '&:disabled': {
                          opacity: 0.6,
                        },
                      }}
                    >
                      <Favorite sx={{ 
                        fontSize: { xs: 16, sm: 20 }, 
                        color: wishlistItems.has(product._id) ? '#000' : '#FFD700',
                        fill: wishlistItems.has(product._id) ? '#000' : 'none'
                      }} />
                    </Button> */}

                    {/* Quick View Button - Bottom Right */}
                    <Button
                      sx={{
                        position: 'absolute',
                        bottom: { xs: 8, sm: 12 },
                        right: { xs: 8, sm: 12 },
                        minWidth: 'auto',
                        width: { xs: 32, sm: 40 },
                        height: { xs: 32, sm: 40 },
                        borderRadius: '50%',
                        background: 'rgba(156, 39, 176, 0.9)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          background: 'rgba(156, 39, 176, 1)',
                        },
                      }}
                      onClick={() => handleQuickView(product)}
                    >
                      <Visibility sx={{ 
                        fontSize: { xs: 16, sm: 20 }, 
                        color: '#fff' 
                      }} />
                    </Button>
                  </Box>

                  <CardContent sx={{ 
                    p: { xs: 2, sm: 2.5, md: 3 },
                    '&:last-child': { pb: { xs: 2, sm: 2.5, md: 3 } }
                  }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ 
                        textTransform: 'uppercase', 
                        fontWeight: 600,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                      }}
                    >
                      {normalizeCsvInput(product.categories ?? '')}
                    </Typography>
                    
                    <Typography
                      variant={isSmallMobile ? 'subtitle1' : 'h6'}
                      component="h3"
                      gutterBottom
                      sx={{ 
                        fontWeight: 600, 
                        color: '#333', 
                        mt: 1,
                        fontSize: { xs: '0.875rem', sm: '1.25rem' },
                        lineHeight: { xs: 1.3, sm: 1.4 }
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            sx={{
                              fontSize: { xs: 14, sm: 16 },
                              color: i < Math.floor(product.ratingAverage || (product.ratingCount || 0)) ? '#FFD700' : '#ddd',
                            }}
                          />
                        ))}
                      </Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        ({product.ratingCount || 0})
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 1, sm: 0 }
                    }}>
                      <Typography
                        variant={isSmallMobile ? 'subtitle1' : 'h6'}
                        sx={{
                          fontWeight: 700,
                          color: '#FFD700',
                          fontSize: { xs: '1rem', sm: '1.25rem' },
                        }}
                      >
                        {product.price} {product.currency}
                      </Typography>
                      
                      <Button
                        variant="contained"
                        size={isSmallMobile ? "small" : "small"}
                        startIcon={<ShoppingCart sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                        onClick={() => addToCart(product._id)}
                        disabled={loadingStates[`cart-${product._id}`] || isInCart(product._id)}
                        sx={{
                          background: isInCart(product._id) ? '#4CAF50' : '#FFD700',
                          color: '#000',
                          fontWeight: 600,
                          borderRadius: 2,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          px: { xs: 1.5, sm: 2 },
                          py: { xs: 0.5, sm: 0.75 },
                          '&:hover': {
                            background: isInCart(product._id) ? '#45a049' : '#FFC000',
                          },
                          '&:disabled': {
                            opacity: 0.6,
                          },
                        }}
                      >
                        {loadingStates[`cart-${product._id}`] 
                          ? 'Adding...' 
                          : isInCart(product._id) 
                            ? 'In Cart' 
                            : (isSmallMobile ? 'Add' : 'Add to Cart')
                        }
                      </Button>
                    </Box>
                  </CardContent>
                                  </Card>
                </motion.div>
              </Box>
            ))}
          </Box>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mt: { xs: 4, sm: 5, md: 6 } }}>
            <Button
              variant="outlined"
              size={isSmallMobile ? "medium" : "large"}
              href="/products"
              sx={{
                borderColor: '#9C27B0',
                color: '#9C27B0',
                fontWeight: 600,
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.875rem', sm: '1.1rem' },
                borderRadius: 3,
                '&:hover': {
                  borderColor: '#FFD700',
                  color: '#FFD700',
                  background: 'rgba(255, 215, 0, 0.1)',
                },
              }}
            >
              View All Products
            </Button>
          </Box>
        </motion.div>
      </Container>

      {/* Product Quick View Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="product-modal-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
            maxWidth: 900,
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            overflow: 'auto',
            outline: 'none',
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 1)',
              },
            }}
          >
            <Close />
          </IconButton>

          {selectedProduct && (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
              {/* Product Images */}
              <Box sx={{ 
                flex: { xs: 'none', md: '0 0 50%' },
                position: 'relative', 
                height: { xs: 300, md: 400 } 
              }}>
                <CardMedia
                  component="img"
                  image={selectedProduct.images?.[selectedImageIndex]?.url || '/placeholder-image.jpg'}
                  alt={selectedProduct.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {/* Badges */}
                <Box sx={{ 
                  position: 'absolute', 
                  top: 16, 
                  left: 16, 
                  display: 'flex', 
                  gap: 1,
                  flexDirection: 'column'
                }}>
                  {selectedProduct.createdAt && new Date(selectedProduct.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                    <Chip
                      label="New"
                      size="small"
                      sx={{
                        background: '#FFD700',
                        color: '#000',
                        fontWeight: 600,
                      }}
                    />
                  )}
                  {selectedProduct.ratingCount && selectedProduct.ratingCount >= 5 && (
                    <Chip
                      label="Popular"
                      size="small"
                      sx={{
                        background: '#9C27B0',
                        color: '#fff',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>
                
                {/* Image Gallery */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <Box sx={{ 
                    p: 2, 
                    borderTop: '1px solid #e0e0e0',
                    bgcolor: '#fafafa'
                  }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        mb: 2, 
                        fontWeight: 600, 
                        color: '#333',
                        fontSize: '0.875rem'
                      }}
                    >
                      All Images ({selectedProduct.images.length})
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1, 
                      overflowX: 'auto',
                      pb: 1,
                      '&::-webkit-scrollbar': {
                        height: 4,
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: 2,
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#c1c1c1',
                        borderRadius: 2,
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                        background: '#a8a8a8',
                      },
                    }}>
                      {selectedProduct.images.map((image, index) => (
                        <Box
                          key={index}
                          onClick={() => handleImageSelect(index)}
                          sx={{
                            flex: '0 0 auto',
                            width: 80,
                            height: 80,
                            cursor: 'pointer',
                            border: selectedImageIndex === index ? '2px solid #FFD700' : '2px solid transparent',
                            borderRadius: 1,
                            overflow: 'hidden',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: '#9C27B0',
                              transform: 'scale(1.05)',
                            },
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={image.url}
                            alt={`${selectedProduct.name} - Image ${index + 1}`}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Product Details */}
              <Box sx={{ 
                flex: { xs: 'none', md: '0 0 50%' },
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Box sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ 
                      textTransform: 'uppercase', 
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  >
                    {normalizeCsvInput(selectedProduct.categories ?? '')}
                  </Typography>
                  
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{ 
                      fontWeight: 700, 
                      color: '#333', 
                      mt: 1,
                      mb: 2
                    }}
                  >
                    {selectedProduct.name}
                  </Typography>

                  {/* Rating */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating
                      value={selectedProduct.ratingAverage || (selectedProduct.ratingCount || 0)}
                      readOnly
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      ({selectedProduct.ratingCount || 0} reviews)
                    </Typography>
                  </Box>

                  {/* Price */}
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: '#FFD700',
                      mb: 2,
                    }}
                  >
                    {selectedProduct.price} {selectedProduct.currency}
                  </Typography>

                  {/* Description */}
                  {selectedProduct.description && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        Description
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {selectedProduct.description}
                      </Typography>
                    </Box>
                  )}

                  {/* Product Details */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      Product Details
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {selectedProduct.brand && (
                        <Box sx={{ display: 'flex' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 100 }}>
                            Brand:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedProduct.brand}
                          </Typography>
                        </Box>
                      )}
                      {selectedProduct.sku && (
                        <Box sx={{ display: 'flex' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 100 }}>
                            SKU:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedProduct.sku}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 100 }}>
                          Stock:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedProduct.stock || 0} available
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<ShoppingCart />}
                      onClick={() => addToCart(selectedProduct._id)}
                      disabled={loadingStates[`cart-${selectedProduct._id}`] || isInCart(selectedProduct._id)}
                      sx={{
                        background: isInCart(selectedProduct._id) ? '#4CAF50' : '#FFD700',
                        color: '#000',
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        '&:hover': {
                          background: isInCart(selectedProduct._id) ? '#45a049' : '#FFC000',
                        },
                        '&:disabled': {
                          opacity: 0.6,
                        },
                      }}
                    >
                      {loadingStates[`cart-${selectedProduct._id}`] 
                        ? 'Adding...' 
                        : isInCart(selectedProduct._id) 
                          ? 'In Cart' 
                          : 'Add to Cart'
                      }
                    </Button>
                    
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<Favorite />}
                      onClick={() => {
                        if (wishlistItems.has(selectedProduct._id)) {
                          removeFromWishlist(selectedProduct._id);
                        } else {
                          addToWishlist(selectedProduct._id);
                        }
                      }}
                      disabled={loadingStates[`wishlist-${selectedProduct._id}`]}
                      sx={{
                        borderColor: wishlistItems.has(selectedProduct._id) ? '#FFD700' : '#9C27B0',
                        color: wishlistItems.has(selectedProduct._id) ? '#FFD700' : '#9C27B0',
                        background: wishlistItems.has(selectedProduct._id) ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        '&:hover': {
                          borderColor: '#FFD700',
                          color: '#FFD700',
                          background: 'rgba(255, 215, 0, 0.1)',
                        },
                        '&:disabled': {
                          opacity: 0.6,
                        },
                      }}
                    >
                      {loadingStates[`wishlist-${selectedProduct._id}`] 
                        ? 'Updating...' 
                        : wishlistItems.has(selectedProduct._id) 
                          ? 'In Wishlist' 
                          : 'Add to Wishlist'
                      }
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ProductsSection;
