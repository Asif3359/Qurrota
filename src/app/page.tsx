'use client';

import React from 'react';
import { Box } from '@mui/material';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/sections/HeroSection';
import ProductsSection from '@/components/sections/ProductsSection';
import Footer from '@/components/layout/Footer';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import StorySection from '@/components/sections/StorySection';
import AboutPage from './about/page';
import GetInTouch from '@/components/sections/GetInTouch';
import JoinUsSection from '@/components/sections/JoinUsSection';

export default function HomePage() {
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <Box sx={{ pt: 8 }}> {/* Add padding top to account for fixed header */}
        <HeroSection />
        <ProductsSection />
        <StorySection />
        <GetInTouch />
        <JoinUsSection></JoinUsSection>
      </Box>
      
      {/* Footer */}
      <Footer />
    </Box>
  );
}
