"use client";

import { motion } from "framer-motion";
import { Box, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { getRgbaColor } from "../../theme/colors";

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  animationType: "float" | "pulse" | "rotate" | "drift";
}

const AnimatedBackground: React.FC = () => {
  const theme = useTheme();
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>(
    []
  );

  useEffect(() => {
    const animationTypes: ("float" | "pulse" | "rotate" | "drift")[] = [
      "float",
      "pulse",
      "rotate",
      "drift",
    ];

    const elements: FloatingElement[] = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 80 + 15, // Increased size range: 15-95px
      delay: Math.random() * 3, // Increased delay range
      duration: Math.random() * 15 + 8, // Increased duration range: 8-23 seconds
      opacity: Math.random() * 0.6 + 0.3, // Opacity range: 0.3-0.9
      animationType:
        animationTypes[Math.floor(Math.random() * animationTypes.length)],
    }));
    setFloatingElements(elements);
  }, []);

  // Function to get animation based on type
  const getAnimation = (element: FloatingElement) => {
    const baseTransition = {
      duration: element.duration,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: element.delay,
    };

    switch (element.animationType) {
      case "float":
        return {
          animate: {
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.2, 0.8, 1],
            rotate: [0, 180, 360],
          },
          transition: baseTransition,
        };
      case "pulse":
        return {
          animate: {
            scale: [1, 1.5, 0.7, 1],
            opacity: [
              element.opacity,
              element.opacity * 0.5,
              element.opacity,
              element.opacity,
            ],
          },
          transition: baseTransition,
        };
      case "rotate":
        return {
          animate: {
            rotate: [0, 360],
            x: [0, 20, -20, 0],
            y: [0, 20, -20, 0],
          },
          transition: baseTransition,
        };
      case "drift":
        return {
          animate: {
            x: [0, 50, -50, 0],
            y: [0, 40, -40, 0],
            scale: [1, 1.1, 0.9, 1],
          },
          transition: baseTransition,
        };
      default:
        return {
          animate: {
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.2, 0.8, 1],
          },
          transition: baseTransition,
        };
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        // height: '100%',
        overflow: "hidden",
        zIndex: -1,
        height: "100vh",
        background: theme.palette.primary.main,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {floatingElements.map((element) => {
        const animation = getAnimation(element);
        return (
          <motion.div
            key={element.id}
            style={{
              position: "absolute",
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: element.size,
              height: element.size,
              borderRadius: "50%",
              background: `linear-gradient(135deg, 
                rgba(255, 255, 255, ${element.opacity}) 0%, 
                rgba(255, 255, 255, ${element.opacity * 0.7}) 50%, 
                rgba(255, 255, 255, ${element.opacity * 0.5}) 100%)`,
              border: `2px solid rgba(255, 255, 255, ${element.opacity + 0.1})`,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
            animate={animation.animate}
            transition={animation.transition}
          />
        );
      })}

      {/* Gradient overlay for depth */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: getRgbaColor(theme.palette.primary.dark, 0.1),
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
        }}
      />
    </Box>
  );
};

export default AnimatedBackground;
