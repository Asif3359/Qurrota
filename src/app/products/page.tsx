'use client';

import React from 'react';
import { Box, Container, Typography, Breadcrumbs, Link } from '@mui/material';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import ProductsSection from '@/components/sections/ProductsSection';
import Footer from '@/components/layout/Footer';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import theme from '@/theme';
import { getRgbaColor } from '@/theme/colors';

export default function ProductsPage() {
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <Box sx={{ pt: 8 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Breadcrumbs sx={{ mb: 3 }}>
              <Link href="/" color="inherit" sx={{ textDecoration: 'none' }}>
                Home
              </Link>
              <Typography color="text.primary">Products</Typography>
            </Breadcrumbs>
            
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: '#FFD700',
                mb: 2,
              }}
            >
              All Products
            </Typography>
            
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 600 }}
            >
              Explore our complete collection of premium products for kids and new mothers
            </Typography>
          </motion.div>
        </Container>
        
        {/* <Box sx={{  background: getRgbaColor(theme.palette.primary.main, 0.76), backdropFilter: 'blur(10px)' }}> */}
            <ProductsSection isHomePage={false} />
        {/* </Box> */}
      </Box>
      
      {/* Footer */}
      <Footer />
    </Box>
  );
}
