import { motion } from "framer-motion";
import { Box, Typography, Chip, Container } from "@mui/material";
import { 
  Spa, 
  Support, 
  EmojiEvents, 
  VerifiedUser, 
  LocalShipping,
  CheckCircle,
  Headset
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import { useTheme, withTheme } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import { getRgbaColor } from "../../theme/colors";
import { orange, cyan, green } from "@mui/material/colors";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { additionalColors } from "@/theme/colors";

const StorySection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Video slider state
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videos = [
    "/videos/ad1.mp4",
    "/videos/ad2.mp4",
    "/videos/ad3.mp4",
  ];

  // Feature boxes data
  const features = [
    {
      icon: VerifiedUser,
      title: "100% Safe & Non-Toxic",
    },
    {
      icon: LocalShipping,
      title: "Free Shipping Over $50",
    },
    {
      icon: CheckCircle,
      title: "Certified Organic",
    },
    {
      icon: Headset,
      title: "24/7 Customer Support",
    },
  ];

  const primaryMain = theme.palette.primary.main;
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;
  const secondaryDark = theme.palette.secondary.dark;
  const successMain = theme.palette.success.main;
  const infoMain = theme.palette.info.main;
  const warningMain = theme.palette.warning.main;
  const errorMain = theme.palette.error.main;
  const textPrimary = theme.palette.text.primary;
  const textSecondary = theme.palette.text.secondary;
  const white = theme.palette.common.white;
  const black = theme.palette.common.black;

  // Auto-advance video slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [videos.length]);

  const goToNextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const goToPrevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        backdropFilter: "blur(10px)",
        borderRadius: 2,
      }}
    >
      <Container maxWidth="lg">
        {/* Feature Boxes Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { 
                xs: "1fr", 
                sm: "repeat(2, 1fr)", 
                md: "repeat(4, 1fr)" 
              },
              gap: 3,
              mb: { xs: 6, md: 10},
            }}
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      background: additionalColors.white,
                      borderRadius: 2,
                      p: 3,
                      textAlign: "center",
                      border: `1px solid ${getRgbaColor(theme.palette.primary.main, 0.2)}`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 3,
                        background: getRgbaColor(theme.palette.primary.light, 0.15),
                      },
                    }}
                  >
                    <IconComponent
                      sx={{
                        fontSize: 40,
                        color: theme.palette.primary.main,
                        mb: 1.5,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        fontSize: { xs: "0.875rem", md: "0.95rem" },
                      }}
                    >
                      {feature.title}
                    </Typography>
                  </Box>
                </motion.div>
              );
            })}
          </Box>
        </motion.div>

        {/* About Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: { xs: 8, md: 6 },
              alignItems: "center",
            }}
          >
            {/* Left Side - Text Content */}
            <Box sx={{ position: "relative" }}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant={isMobile ? "h4" : "h3"}
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 3,
                    position: "relative",
                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -10,
                      left: 0,
                      width: 60,
                      height: 4,
                      background: primaryMain,
                      borderRadius: 2,
                    },
                  }}
                >
                  About Us
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.8,
                    mb: 3,
                    fontSize: "1.1rem",
                    fontWeight: 400,
                  }}
                >
                  Qurrota Kids was born from a simple yet powerful belief:{" "}
                  <strong>every child deserves the best</strong>. Founded by
                  parents who intimately understood the challenges of finding
                  quality, safe, and beautiful products for their little ones,
                  we set out to create a destination where families could shop
                  with complete confidence.
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.8,
                    fontSize: "1.1rem",
                    fontWeight: 400,
                  }}
                >
                  Today, we&apos;re proud to serve{" "}
                  <strong>thousands of families</strong> across the country,
                  offering a carefully curated selection of premium products
                  that combine safety, quality, and style. Our mission is to
                  make parenting a little easier and a lot more joyful.
                </Typography>
              </motion.div>
            </Box>

            {/* Right Side - Video with Floating Badges */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  position: "relative",
                }}
              >
                {/* Video Container */}
                <Box
                  sx={{
                    height: { xs: 400, md: 400 },
                    borderRadius: 10,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Video Element */}
                  <video
                    key={currentVideoIndex}
                    src={videos[currentVideoIndex]}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  {/* Navigation Arrows */}
                  <Box
                    onClick={goToPrevVideo}
                    sx={{
                      position: "absolute",
                      left: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 1)",
                        transform: "translateY(-50%) scale(1.1)",
                      },
                    }}
                  >
                    <ChevronLeft sx={{ color: theme.palette.text.primary }} />
                  </Box>

                  <Box
                    onClick={goToNextVideo}
                    sx={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 1)",
                        transform: "translateY(-50%) scale(1.1)",
                      },
                    }}
                  >
                    <ChevronRight sx={{ color: theme.palette.text.primary }} />
                  </Box>

                  {/* Dots Indicator */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 15,
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: 1,
                      zIndex: 2,
                    }}
                  >
                    {videos.map((_, index) => (
                      <Box
                        key={index}
                        onClick={() => setCurrentVideoIndex(index)}
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background:
                            index === currentVideoIndex
                              ? theme.palette.primary.main
                              : "rgba(255, 255, 255, 0.5)",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background:
                              index === currentVideoIndex
                                ? theme.palette.primary.main
                                : "rgba(255, 255, 255, 0.8)",
                            transform: "scale(1.2)",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Floating Badges */}
                  <Chip
                    label="24/7 Support"
                    icon={<Headset sx={{ color: additionalColors.white }} />}
                    sx={{
                      position: "absolute",
                      top:  { xs: -5, md: -30 },
                      left:  { xs: -25, md: -80 },
                      rotate:  { xs: -45, md: -45 },
                      transform: "rotate(-30deg)" ,
                      transformOrigin: "center",
                      background: "#0FC9EA",
                      color: white,
                      fontWeight: 600,
                      fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                      px: { xs: 0.5, sm: 0.75, md: 1 },
                      py: { xs: 2, sm: 2.5, md: 3 },
                      borderRadius: "30px",
                      boxShadow: 3,
                    }}
                  />


                  <Chip
                    icon={<Spa sx={{ color: additionalColors.white }} />}
                    label="Eco-Friendly"
                    sx={{
                      position: "absolute",
                      top:  { xs: -5, md: -30 },
                      right:  { xs: -25, md: -80 },
                      rotate:  { xs: -45, md: -45 },
                      transform: "rotate(30deg)" ,
                      transformOrigin: "center",
                      background: "#1FB55D",
                      color: white,
                      fontWeight: 600,
                      fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                      px: { xs: 0.5, sm: 0.75, md: 1 },
                      py: { xs: 2, sm: 2.5, md: 3 },
                      borderRadius: "30px",
                      boxShadow: 3,
                    }}
                  />
                  <Chip
                    icon={<EmojiEvents sx={{ color: additionalColors.white }} />}
                    label="Award-Winning"
                    sx={{
                      position: "absolute",
                      bottom: { xs: -35, md: -50 },
                      left:  { xs: '50%', md: '50%' },
                      transform: "translateX(-50%)" ,
                      transformOrigin: "center",
                      background: "#F6A800",
                      color: white,
                      fontWeight: 600,
                      fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                      px: { xs: 0.5, sm: 0.75, md: 1 },
                      py: { xs: 2, sm: 2.5, md: 3 },
                      borderRadius: "30px",
                      boxShadow: 3,
                    }}
                  />
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default StorySection;
