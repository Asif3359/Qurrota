'use client';

import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

const AnimatedBackground: React.FC = () => {
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const elements: FloatingElement[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      delay: Math.random() * 2,
      duration: Math.random() * 10 + 10,
    }));
    setFloatingElements(elements);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        // height: '100%',
        overflow: 'hidden',
        zIndex: -1,
        height: '100vh',
        background: 'linear-gradient(135deg, #FFE55C 0%, #FFD700 50%, #FFC000 100%)',
      }}
    >
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          style={{
            position: 'absolute',
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: element.size,
            height: element.size,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.2, 0.8, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: element.delay,
          }}
        />
      ))}
      
      {/* Gradient overlay for depth */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(255, 215, 0, 0.1) 100%)',
        }}
      />
    </Box>
  );
};

export default AnimatedBackground;
