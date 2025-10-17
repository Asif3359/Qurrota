'use client';

import React from 'react';
import { Box } from '@mui/material';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/sections/HeroSection';
import ProductsSection from '@/components/sections/ProductsSection';
import Footer from '@/components/layout/Footer';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import StorySection from '@/components/sections/StorySection';
import GetInTouch from '@/components/sections/GetInTouch';
import JoinUsSection from '@/components/sections/JoinUsSection';

export default function HomePage() {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        position: 'relative',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <Box
        sx={{
          pt: { xs: 5, sm: 6, md: 7 },
        }}
      >
        <HeroSection />
        <ProductsSection isHomePage={true} />
        <StorySection />
        <GetInTouch />
        <JoinUsSection/>
      </Box>
      
      {/* Footer */}
      <Footer />
    </Box>
  );
}
