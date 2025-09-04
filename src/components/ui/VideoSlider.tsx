"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, PlayArrow, Pause } from "@mui/icons-material";
import { getRgbaColor } from "../../theme/colors";

interface Video {
  src: string;
  title: string;
  description?: string;
  actions?: Array<{
    text: string;
    href: string;
    variant: "contained" | "outlined";
  }>;
}

interface VideoSliderProps {
  videos: Video[];
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
}

const VideoSlider: React.FC<VideoSliderProps> = ({
  videos,
  autoPlay = true,
  interval = 5000,
  showControls = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("xs"));
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [videoRefs, setVideoRefs] = useState<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    setVideoRefs(Array(videos.length).fill(null));
  }, [videos.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  }, [videos.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  }, [videos.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    if (!autoPlay || !isPlaying) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, isPlaying, interval, nextSlide]);

  useEffect(() => {
    // Auto-play all videos when they become current
    if (videoRefs[currentIndex]) {
      videoRefs[currentIndex]?.play().catch(() => {
        // Handle autoplay failure silently
      });
    }
  }, [currentIndex, videoRefs]);

  useEffect(() => {
    // Pause all videos except current
    videoRefs.forEach((videoRef, index) => {
      if (videoRef && index !== currentIndex) {
        videoRef.pause();
        videoRef.currentTime = 0;
      }
    });
  }, [currentIndex, videoRefs]);

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: theme.palette.background.default,
      }}
    >
      {/* Play/Pause Control - Top Right Corner */}
      <IconButton
        onClick={togglePlayPause}
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "rgba(255, 255, 255, 0.9)",
          color: theme.palette.text.primary,
          zIndex: 10,
          "&:hover": {
            background: "rgba(255, 255, 255, 1)",
            transform: "scale(1.1)",
          },
        }}
      >
        {isPlaying ? <Pause /> : <PlayArrow />}
      </IconButton>

      {/* Video Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <video
            ref={(el) => {
              if (el) videoRefs[currentIndex] = el;
            }}
            src={videos[currentIndex].src}
            autoPlay
            muted
            loop
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.4)",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Box
            sx={{
              textAlign: "center",
              color: "white",
              maxWidth: { xs: "90%", sm: "80%", md: "70%" },
              mx: "auto",
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: { xs: 2, sm: 3 },
            }}
          >
            <Typography
              variant={isSmallMobile ? "h5" : isMobile ? "h4" : "h3"}
              sx={{
                fontWeight: 700,
                mb: { xs: 1, sm: 1.5 },
                color: theme.palette.secondary.main,
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              }}
            >
              {videos[currentIndex].title}
            </Typography>
            {videos[currentIndex].description && (
              <Typography
                variant={isSmallMobile ? "body1" : "h6"}
                sx={{
                  opacity: 0.95,
                  mb: { xs: 2, sm: 3 },
                  lineHeight: 1.6,
                  fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                  color: "white",
                }}
              >
                {videos[currentIndex].description}
              </Typography>
            )}

            {/* Action Buttons */}
            {videos[currentIndex].actions &&
              videos[currentIndex].actions!.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 1, sm: 1.5 },
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {videos[currentIndex].actions!.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant}
                      size={isSmallMobile ? "medium" : "large"}
                      href={action.href}
                      sx={{
                        ...(action.variant === "contained"
                          ? {
                              background: theme.palette.primary.dark,
                              color: theme.palette.primary.contrastText,
                              fontWeight: 600,
                              "&:hover": {
                                background: theme.palette.primary.main,
                                transform: "translateY(-2px)",
                              },
                            }
                          : {
                              borderColor: theme.palette.secondary.main,
                              color: theme.palette.secondary.main,
                              fontWeight: 600,
                              "&:hover": {
                                borderColor: theme.palette.primary.dark,
                                color: theme.palette.primary.dark,
                                background: getRgbaColor(theme.palette.primary.dark, 0.1),
                                transform: "translateY(-2px)",
                              },
                            }),
                        px: { xs: 2, sm: 3 },
                        py: { xs: 0.75, sm: 1 },
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        borderRadius: 2,
                      }}
                    >
                      {action.text}
                    </Button>
                  ))}
                </Box>
              )}
          </Box>
        </motion.div>
      </Box>

      {/* Navigation Controls - Right Arrow Only */}
      {showControls && videos.length > 1 && (
        <IconButton
          onClick={nextSlide}
          sx={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255, 255, 255, 0.9)",
            color: theme.palette.text.primary,
            "&:hover": {
              background: "rgba(255, 255, 255, 1)",
              transform: "translateY(-50%) scale(1.1)",
            },
            zIndex: 3,
          }}
        >
          <ChevronRight />
        </IconButton>
      )}

      {/* Dots Indicator */}
      {videos.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1,
            zIndex: 3,
          }}
        >
          {videos.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: index === currentIndex 
                  ? theme.palette.primary.dark
                  : "rgba(255, 255, 255, 0.5)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: index === currentIndex 
                    ? theme.palette.primary.dark
                    : "rgba(255, 255, 255, 0.8)",
                  transform: "scale(1.2)",
                },
              }}
            />
          ))}
        </Box>
      )}

      {/* Progress Bar */}
      {autoPlay && isPlaying && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 4,
            background: "rgba(255, 255, 255, 0.3)",
            zIndex: 3,
          }}
        >
          <motion.div
            style={{
              height: "100%",
              background: theme.palette.primary.dark,
            }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: interval / 1000,
              ease: "linear",
            }}
            onAnimationComplete={() => {
              if (isPlaying) {
                nextSlide();
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default VideoSlider;
