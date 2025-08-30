'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Typography,
  Button,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayArrow, Pause, NavigateBefore, NavigateNext } from '@mui/icons-material';

interface VideoItem {
  id: number;
  src: string;
  title: string;
  description?: string;
  poster?: string;
  actions?: {
    text: string;
    href: string;
    variant: 'contained' | 'outlined';
  }[];
}

interface VideoSliderProps {
  videos: VideoItem[];
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  fullScreen?: boolean;
}

const VideoSlider: React.FC<VideoSliderProps> = ({
  videos,
  autoPlay = true,
  interval = 10000, // Increased from 5000ms to 10000ms (10 seconds)
  showControls = true,
  showIndicators = true,
  fullScreen = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle hydration and initial video play
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Start playing the first video when component mounts
  useEffect(() => {
    if (isClient && autoPlay && videoRef.current) {
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {
            // Handle autoplay failure silently
          });
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isClient, autoPlay]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleVideoEnded = () => {
    // Don't change slide when video ends, let it loop
    // The interval will handle slide changes
    setIsVideoPlaying(false);
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  useEffect(() => {
    if (autoPlay && isPlaying) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, isPlaying, interval]);

  useEffect(() => {
    // Reset video state when slide changes and start playing
    setIsVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      // Start playing the video after a short delay to ensure it loads
      setTimeout(() => {
        if (videoRef.current && autoPlay) {
          videoRef.current.play().catch(() => {
            // Handle autoplay failure silently
          });
        }
      }, 100);
    }
  }, [currentIndex, autoPlay]);

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <Box
        sx={{
          width: '100%',
          height: fullScreen ? '100vh' : { xs: 200, sm: 300, md: 400 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: fullScreen ? 0 : 3,
          border: fullScreen ? 'none' : '2px dashed rgba(255, 215, 0, 0.3)',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          height: fullScreen ? '100vh' : { xs: 200, sm: 300, md: 400 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: fullScreen ? 0 : 3,
          border: fullScreen ? 'none' : '2px dashed rgba(255, 215, 0, 0.3)',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No videos available
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: fullScreen ? '100vh' : { xs: 200, sm: 300, md: 400 },
        borderRadius: fullScreen ? 0 : { xs: 2, sm: 3 },
        overflow: 'hidden',
        background: fullScreen ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
        border: fullScreen ? 'none' : '1px solid rgba(255, 215, 0, 0.2)',
      }}
    >
             <AnimatePresence mode="popLayout">
         <motion.div
           key={currentIndex}
           initial={{ x: '100%' }}
           animate={{ x: 0 }}
           exit={{ x: '-100%' }}
           transition={{ 
             duration: 0.6,
             ease: [0.25, 0.46, 0.45, 0.94] // Smooth easing
           }}
           style={{ 
             width: '100%', 
             height: '100%',
             position: 'absolute',
             top: 0,
             left: 0
           }}
         >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            <video
              ref={videoRef}
              src={videos[currentIndex].src}
              poster={videos[currentIndex].poster}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onEnded={handleVideoEnded}
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              muted
              autoPlay
              loop={true}
              playsInline
            />
            
             {/* Video Info Overlay - Left Side */}
             <Box
               sx={{
                 position: 'absolute',
                 top: { xs: '10%', sm: '15%', md: '20%' },
                 left: { xs: '5%', sm: '8%', md: '10%' },
                 maxWidth: { xs: '90%', sm: '60%', md: '50%' },
                 color: 'white',
                 p: { xs: 2, sm: 3, md: 4 },
                 borderRadius: { xs: 2, sm: 3 },
               }}
             >
               <Typography
                 variant={isSmallMobile ? 'h5' : isMobile ? 'h4' : 'h3'}
                 sx={{ 
                   fontWeight: 700, 
                   mb: { xs: 1, sm: 1.5 },
                   background: 'linear-gradient(45deg, #FFD700, #FFC000)',
                   backgroundClip: 'text',
                   WebkitBackgroundClip: 'text',
                //    WebkitTextFillColor: 'transparent',
                   fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                 }}
               >
                 {videos[currentIndex].title}
               </Typography>
               {videos[currentIndex].description && (
                 <Typography
                   variant={isSmallMobile ? 'body1' : 'h6'}
                   sx={{ 
                     opacity: 0.95, 
                     mb: { xs: 2, sm: 3 },
                     lineHeight: 1.6,
                     fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem'},
                     color: 'white',
                   }}
                 >
                   {videos[currentIndex].description}
                 </Typography>
               )}
               
               {/* Action Buttons */}
               {videos[currentIndex].actions && videos[currentIndex].actions!.length > 0 && (
                 <Box sx={{ 
                   display: 'flex', 
                   gap: { xs: 1, sm: 1.5 }, 
                   flexDirection: { xs: 'column', sm: 'row' },
                   alignItems: { xs: 'stretch', sm: 'flex-start' }
                 }}>
                   {videos[currentIndex].actions!.map((action, index) => (
                     <Button
                       key={index}
                       variant={action.variant}
                       size={isSmallMobile ? "medium" : "large"}
                       href={action.href}
                       sx={{
                         ...(action.variant === 'contained' ? {
                           background: 'linear-gradient(45deg, #FFD700, #FFC000)',
                           color: '#000',
                           fontWeight: 600,
                           '&:hover': {
                             background: 'linear-gradient(45deg, #FFC000, #FFD700)',
                             transform: 'translateY(-2px)',
                           },
                         } : {
                           borderColor: '#9C27B0',
                           color: '#9C27B0',
                           fontWeight: 600,
                           '&:hover': {
                             borderColor: '#FFD700',
                             color: '#FFD700',
                             background: 'rgba(255, 215, 0, 0.1)',
                             transform: 'translateY(-2px)',
                           },
                         }),
                         px: { xs: 2, sm: 3 },
                         py: { xs: 0.75, sm: 1 },
                         fontSize: { xs: '0.875rem', sm: '1rem' },
                         borderRadius: 2,
                       }}
                     >
                       {action.text}
                     </Button>
                   ))}
                 </Box>
               )}
             </Box>

            
          </Box>
        </motion.div>
      </AnimatePresence>

             {/* Navigation Controls - Right Arrow Only */}
       {showControls && videos.length > 1 && (
         <IconButton
           onClick={nextSlide}
           sx={{
             position: 'absolute',
             right: 10,
             top: '50%',
             transform: 'translateY(-50%)',
             background: 'rgba(255, 255, 255, 0.9)',
             color: '#333',
             transition: 'all 0.3s ease',
             '&:hover': {
               background: 'rgba(255, 255, 255, 1)',
               transform: 'translateY(-50%) scale(1.1)',
             },
           }}
         >
           <NavigateNext />
         </IconButton>
       )}

      {/* Indicators */}
      {showIndicators && videos.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 60, sm: 80 },
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
          }}
        >
                     {videos.map((_, index) => (
             <Box
               key={index}
               onClick={() => goToSlide(index)}
               sx={{
                 width: { xs: 8, sm: 12 },
                 height: { xs: 8, sm: 12 },
                 borderRadius: '50%',
                 background: index === currentIndex ? '#FFD700' : 'rgba(255, 255, 255, 0.5)',
                 cursor: 'pointer',
                 transition: 'all 0.3s ease',
                 transform: index === currentIndex ? 'scale(1.2)' : 'scale(1)',
                 '&:hover': {
                   background: index === currentIndex ? '#FFD700' : 'rgba(255, 255, 255, 0.8)',
                   transform: 'scale(1.3)',
                 },
               }}
             />
           ))}
        </Box>
      )}

             {/* Auto-play Toggle */}
       {autoPlay && (
         <IconButton
           onClick={() => setIsPlaying(!isPlaying)}
           sx={{
             position: 'absolute',
             top: 10,
             right: 10,
             background: 'rgba(255, 255, 255, 0.9)',
             color: '#333',
             transition: 'all 0.3s ease',
             '&:hover': {
               background: 'rgba(255, 255, 255, 1)',
               transform: 'scale(1.1)',
             },
           }}
         >
           {isPlaying ? <Pause /> : <PlayArrow />}
         </IconButton>
       )}
    </Box>
  );
};

export default VideoSlider;
