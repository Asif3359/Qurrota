'use client';

import React, { Suspense } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import VideoSlider to prevent SSR issues
const VideoSlider = dynamic(() => import('@/components/ui/VideoSlider'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      <Typography variant="h6" color="text.secondary">
        Loading video slider...
      </Typography>
    </Box>
  ),
});

const HeroSection: React.FC = () => {

  // Sample advertisement videos - replace with your actual video URLs
  const advertisementVideos = [
    {
      id: 1,
      src: '/videos/ad1.mp4', // Use relative path for production
      title: 'Welcome to Qurrota Kids',
      description: 'Discover premium products for kids and new mothers. Quality, safety, and joy in every item we offer.',
      poster: '/images/ad1-poster.jpg', // Optional poster image
      actions: [
        {
          text: 'Shop Now',
          href: '/products',
          variant: 'contained' as const,
        },
        {
          text: 'Learn More',
          href: '/about',
          variant: 'outlined' as const,
        },
      ],
    },
    {
      id: 2,
      src: '/videos/ad2.mp4', // Use relative path for production
      title: 'Safe & Healthy Products',
      description: '100% safe materials for your little ones and new mothers with the best quality products for your baby and new mother',
      poster: '/images/ad2-poster.jpg', // Optional poster image
      actions: [
        {
          text: 'Shop Now',
          href: '/products',
          variant: 'contained' as const,
        },
        {
          text: 'Learn More',
          href: '/about',
          variant: 'outlined' as const,
        },
      ],
    },
    {
      id: 3,
      src: '/videos/ad3.mp4', // Use relative path for production
      title: 'Fast Delivery Service',
      description: 'Quick and reliable shipping nationwide with the best quality products for your baby and new mother with the best quality products for your baby and new mother',
      poster: '/images/ad3-poster.jpg', // Optional poster image
      actions: [
        {
          text: 'Shop Now',
          href: '/products',
          variant: 'contained' as const,
        },
      ],
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Full Screen Video Slider */}
      <Box sx={{ width: '100%', height: '100vh' }}>
        <Suspense
          fallback={
            <Box
                sx={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Loading video slider...
              </Typography>
            </Box>
          }
        >
              <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <VideoSlider
              videos={advertisementVideos}
              autoPlay={true}
              interval={12000} // Increased from 6000ms to 12000ms (12 seconds)
              showControls={true}
              showIndicators={true}
              fullScreen={true}
            />
              </motion.div>
        </Suspense>
          </Box>

      {/* Floating decorative elements */}
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
            width: 100,
            height: 100,
          borderRadius: '50%',
          background: 'rgba(255, 215, 0, 0.1)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
        }}
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      </Box>
      
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
      <motion.div
        style={{
          position: 'absolute',
          bottom: '30%',
          left: '5%',
            width: 60,
            height: 60,
          borderRadius: '50%',
          background: 'rgba(156, 39, 176, 0.1)',
          border: '2px solid rgba(156, 39, 176, 0.3)',
        }}
        animate={{
          y: [0, 15, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      </Box>
    </Box>
  );
};

export default HeroSection;
