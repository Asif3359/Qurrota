"use client";

import React, { useState, useEffect } from "react";
import { Box, IconButton, useTheme, useMediaQuery, Typography, Container } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Image from "next/image";

const HeroSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentIndex, setCurrentIndex] = useState(0);

  // Hero images from your public/images folder
  const heroImages = [
    {
      id: 1,
      src: "/images/img1.jpg",
      alt: "Welcome to Qurrota - Premium products for kids and mothers",
      title: "Welcome to Qurrota Kids",
      description: "Discover premium products for kids and new mothers. Quality, safety, and joy in every item we offer.",
    },
    {
      id: 2,
      src: "/images/img2.jpg",
      alt: "Safe & Healthy Products for your family",
      title: "Safe & Healthy Products",
      description: "100% safe materials for your little ones and new mothers with the best quality products for your baby and new mother.",
    },
    {
      id: 3,
      src: "/images/img3.jpg",
      alt: "Fast Delivery Service nationwide",
      title: "Fast Delivery Service",
      description: "Quick and reliable shipping nationwide with the best quality products for your baby and new mother.",
    },
  ];

  // Auto-slide functionality - 10 seconds delay
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000); // Change slide every 10 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Box
      sx={{
        minHeight: { xs: "40vh", sm: "50vh", md: "60vh" },
        position: "relative",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Image Slider */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "40vh", sm: "50vh", md: "60vh" },
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            <Image
              src={heroImages[currentIndex].src}
              alt={heroImages[currentIndex].alt}
              fill
              priority
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              sizes="100vw"
            />
            
            {/* Overlay Gradient */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(to right, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.1) 100%)",
                zIndex: 1,
              }}
            />

            {/* Text Content */}
            <Container
              maxWidth="xl"
              sx={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                transform: "translateY(-50%)",
                zIndex: 2,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Box
                  sx={{
                    maxWidth: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
                    px: { xs: 2, sm: 3, md: 4 },
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem", lg: "3.5rem" },
                      mb: 2,
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                      lineHeight: 1.2,
                    }}
                  >
                    {heroImages[currentIndex].title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#fff",
                      fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.25rem" },
                      lineHeight: 1.6,
                      textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
                      maxWidth: { xs: "100%", sm: "90%", md: "85%" },
                    }}
                  >
                    {heroImages[currentIndex].description}
                  </Typography>
                </Box>
              </motion.div>
            </Container>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {!isMobile && (
          <>
            <IconButton
              onClick={goToPrevious}
              sx={{
                position: "absolute",
                left: { xs: 10, sm: 20 },
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                width: { xs: 40, sm: 50 },
                height: { xs: 40, sm: 50 },
                zIndex: 10,
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(255, 255, 255, 1)",
                  transform: "translateY(-50%) scale(1.1)",
                },
              }}
            >
              <ChevronLeft sx={{ fontSize: { xs: 24, sm: 32 } }} />
            </IconButton>

            <IconButton
              onClick={goToNext}
              sx={{
                position: "absolute",
                right: { xs: 10, sm: 20 },
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                width: { xs: 40, sm: 50 },
                height: { xs: 40, sm: 50 },
                zIndex: 10,
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(255, 255, 255, 1)",
                  transform: "translateY(-50%) scale(1.1)",
                },
              }}
            >
              <ChevronRight sx={{ fontSize: { xs: 24, sm: 32 } }} />
            </IconButton>
          </>
        )}

        {/* Dot Indicators */}
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 15, sm: 25 },
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: { xs: 1, sm: 1.5 },
            zIndex: 10,
          }}
        >
          {heroImages.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: { xs: 10, sm: 12 },
                height: { xs: 10, sm: 12 },
                borderRadius: "50%",
                background:
                  index === currentIndex
                    ? theme.palette.primary.main
                    : "rgba(255, 255, 255, 0.5)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: `2px solid ${
                  index === currentIndex
                    ? theme.palette.primary.main
                    : "rgba(255, 255, 255, 0.8)"
                }`,
                "&:hover": {
                  background:
                    index === currentIndex
                      ? theme.palette.primary.main
                      : "rgba(255, 255, 255, 0.8)",
                  transform: "scale(1.2)",
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
