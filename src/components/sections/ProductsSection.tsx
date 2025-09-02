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
} from '@mui/material';
import { motion } from 'framer-motion';
import { ShoppingCart, Favorite, Star } from '@mui/icons-material';
import { getRgbaColor } from '@/theme/colors';

const ProductsSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const products = [
    {
      id: 1,
      name: 'Organic Baby Onesie',
      category: 'Clothing',
      price: 29.99,
      rating: 4.8,
      image: 'https://i.etsystatic.com/11919605/r/il/ded74d/7201719371/il_600x600.7201719371_gp5o.jpg',
      isNew: true,
      isPopular: true,
    },
    {
      id: 2,
      name: 'Educational Wooden Blocks',
      category: 'Toys',
      price: 45.99,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop',
      isNew: false,
      isPopular: true,
    },
    {
      id: 3,
      name: 'Natural Baby Care Set',
      category: 'Care',
      price: 39.99,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
      isNew: true,
      isPopular: false,
    },
    {
      id: 4,
      name: 'Comfortable Nursing Pillow',
      category: 'Maternity',
      price: 59.99,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      isNew: false,
      isPopular: true,
    },
    {
      id: 5,
      name: 'Interactive Story Book',
      category: 'Books',
      price: 24.99,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
      isNew: true,
      isPopular: false,
    },
    {
      id: 6,
      name: 'Safe Baby Monitor',
      category: 'Electronics',
      price: 89.99,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      isNew: false,
      isPopular: true,
    },
  ];

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
            <Box key={product.id}>
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
                      image={product.image}
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
                      {product.isNew && (
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
                      {product.isPopular && (
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

                    {/* Favorite Button */}
                    <Button
                      sx={{
                        position: 'absolute',
                        top: { xs: 8, sm: 12 },
                        right: { xs: 8, sm: 12 },
                        minWidth: 'auto',
                        width: { xs: 32, sm: 40 },
                        height: { xs: 32, sm: 40 },
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 1)',
                        },
                      }}
                    >
                      <Favorite sx={{ 
                        fontSize: { xs: 16, sm: 20 }, 
                        color: '#FFD700' 
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
                      {product.category}
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
                              color: i < Math.floor(product.rating) ? '#FFD700' : '#ddd',
                            }}
                          />
                        ))}
                      </Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        ({product.rating})
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
                        ${product.price}
                      </Typography>
                      
                      <Button
                        variant="contained"
                        size={isSmallMobile ? "small" : "small"}
                        startIcon={<ShoppingCart sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                        sx={{
                          background: '#FFD700',
                          color: '#000',
                          fontWeight: 600,
                          borderRadius: 2,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          px: { xs: 1.5, sm: 2 },
                          py: { xs: 0.5, sm: 0.75 },
                          '&:hover': {
                            background: '#FFC000',
                          },
                        }}
                      >
                        {isSmallMobile ? 'Add' : 'Add to Cart'}
                      </Button>
                    </Box>
                  </CardContent>
                                  </Card>
                </motion.div>
              </Box>
            ))}
          </Box>

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
    </Box>
  );
};

export default ProductsSection;
