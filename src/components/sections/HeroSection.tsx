"use client";

import React, { useState, useEffect } from "react";
import { Box, IconButton, useTheme, Typography, Container, CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";

interface BannerImage {
  url: string;
  alt?: string;
  publicId?: string;
}

interface Banner {
  _id: string;
  title: string;
  description: string;
  image: BannerImage;
  order?: number;
  link?: string;
  target?: '_self' | '_blank';
}

type HeroImage = {
  id: string | number;
  src: string;
  alt: string;
  title: string;
  description: string;
  link?: string;
  target?: '_self' | '_blank';
};

// Fallback static images
const fallbackImages: HeroImage[] = [
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

const HeroSection: React.FC = () => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch active banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${apiBase}/api/banners/active`);
        const data = await response.json();
        
        if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
          // Sort banners by order field
          const sortedBanners = [...data.data].sort((a, b) => (a.order || 0) - (b.order || 0));
          setBanners(sortedBanners);
        }
      } catch (err) {
        console.error('Error fetching banners:', err);
        // Keep banners empty to use fallback
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Use banners if available, otherwise use fallback
  const heroImages: HeroImage[] = banners.length > 0
    ? banners.map((banner) => ({
        id: banner._id,
        src: banner.image.url,
        alt: banner.image.alt || banner.title,
        title: banner.title,
        description: banner.description,
        link: banner.link,
        target: banner.target || '_self',
      }))
    : fallbackImages;

  // Auto-slide functionality - 5 seconds delay (as per API docs)
  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
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

  // Show loading state
  if (loading && banners.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          aspectRatio: { xs: "16/9", sm: "21/9", md: "21/9" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          bgcolor: "rgba(0, 0, 0, 0.05)",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Don't render if no banners and no fallback
  if (heroImages.length === 0) {
    return null;
  }

  const currentImage = heroImages[currentIndex];

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        aspectRatio: "4/3",
        maxHeight: "70vh",
      }}
    >
      {/* Image Slider */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
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
            {currentImage.link ? (
              <Link
                href={currentImage.link}
                target={currentImage.target || '_self'}
                rel={currentImage.target === '_blank' ? 'noopener noreferrer' : undefined}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  display: "block",
                  textDecoration: "none",
                  cursor: "pointer",
                  zIndex: 0,
                }}
              >
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  fill
                  priority={currentIndex === 0}
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    maxHeight: "70vh",
                    aspectRatio: "4/3",
                  }}
                  sizes="100vw"
                />
              </Link>
            ) : (
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                priority={currentIndex === 0}
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  aspectRatio: "4/3",
                  maxHeight: "70vh",
                }}
                sizes="100vw"
              />
            )}
            
            {/* Overlay Gradient - Enhanced for better text readability */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: {
                  xs: "linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.4) 100%)",
                  sm: "linear-gradient(to right, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0.2) 70%, rgba(0, 0, 0, 0.1) 100%)",
                },
                zIndex: 1,
              }}
            />
            
            {/* Text Content */}
            <Container
              maxWidth="xl"
              sx={{
                position: "absolute",
                top: { xs: "45%", sm: "50%" },
                left: 0,
                right: 0,
                transform: { xs: "translateY(-45%)", sm: "translateY(-50%)" },
                zIndex: 2,
                pointerEvents: "none",
                px: { xs: 2, sm: 3, md: 4 },
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Box
                  sx={{
                    maxWidth: { xs: "100%", sm: "75%", md: "65%", lg: "55%" },
                  }}
                >
                  <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: { xs: "1.5rem", sm: "2rem", md: "2.75rem", lg: "3.5rem", xl: "4rem" },
                      mb: { xs: 1.5, sm: 2, md: 2.5 },
                      textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 0, 0, 0.3)",
                      lineHeight: { xs: 1.2, sm: 1.15 },
                      letterSpacing: { xs: "-0.02em", sm: "-0.01em" },
                    }}
                  >
                    {currentImage.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#fff",
                      fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem", lg: "1.25rem" },
                      lineHeight: { xs: 1.5, sm: 1.6 },
                      textShadow: "1px 1px 4px rgba(0, 0, 0, 0.7), 0 0 10px rgba(0, 0, 0, 0.3)",
                      maxWidth: { xs: "100%", sm: "90%", md: "85%", lg: "80%" },
                      mb: { xs: 0, sm: 0 },
                      display: { xs: currentImage.description.length > 80 ? "none" : "block", sm: "block" },
                    }}
                  >
                    {currentImage.description}
                  </Typography>
                </Box>
              </motion.div>
            </Container>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - Always visible but smaller on mobile */}
        {heroImages.length > 1 && (
          <>
            <IconButton
              onClick={goToPrevious}
              sx={{
                position: "absolute",
                left: { xs: 8, sm: 16, md: 24 },
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                width: { xs: 36, sm: 44, md: 52 },
                height: { xs: 36, sm: 44, md: 52 },
                zIndex: 10,
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                "&:hover": {
                  background: "rgba(255, 255, 255, 1)",
                  transform: "translateY(-50%) scale(1.1)",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.25)",
                },
                "&:active": {
                  transform: "translateY(-50%) scale(0.95)",
                },
              }}
              aria-label="Previous banner"
            >
              <ChevronLeft sx={{ fontSize: { xs: 20, sm: 28, md: 32 } }} />
            </IconButton>

            <IconButton
              onClick={goToNext}
              sx={{
                position: "absolute",
                right: { xs: 8, sm: 16, md: 24 },
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                width: { xs: 36, sm: 44, md: 52 },
                height: { xs: 36, sm: 44, md: 52 },
                zIndex: 10,
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                "&:hover": {
                  background: "rgba(255, 255, 255, 1)",
                  transform: "translateY(-50%) scale(1.1)",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.25)",
                },
                "&:active": {
                  transform: "translateY(-50%) scale(0.95)",
                },
              }}
              aria-label="Next banner"
            >
              <ChevronRight sx={{ fontSize: { xs: 20, sm: 28, md: 32 } }} />
            </IconButton>
          </>
        )}

        {/* Dot Indicators - Enhanced design */}
        {heroImages.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              bottom: { xs: 12, sm: 20, md: 24 },
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: { xs: 0.75, sm: 1, md: 1.25 },
              zIndex: 10,
              alignItems: "center",
              px: { xs: 1.5, sm: 2 },
              py: { xs: 0.75, sm: 1 },
              borderRadius: 3,
              background: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            {heroImages.map((_, index) => (
              <Box
                key={index}
                onClick={() => goToSlide(index)}
                sx={{
                  width: { xs: index === currentIndex ? 24 : 8, sm: index === currentIndex ? 32 : 10, md: index === currentIndex ? 40 : 12 },
                  height: { xs: 8, sm: 10, md: 12 },
                  borderRadius: index === currentIndex ? 2 : "50%",
                  background:
                    index === currentIndex
                      ? theme.palette.primary.main
                      : "rgba(255, 255, 255, 0.6)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: index === currentIndex
                    ? `0 2px 8px ${theme.palette.primary.main}40`
                    : "none",
                  "&:hover": {
                    background:
                      index === currentIndex
                        ? theme.palette.primary.main
                        : "rgba(255, 255, 255, 0.9)",
                    transform: "scale(1.15)",
                  },
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HeroSection;
