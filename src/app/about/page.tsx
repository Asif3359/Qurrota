"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Star,
  LocalShipping,
  People,
  LocationOn,
  VerifiedUser,
  ChildCare,
  Support,
  EmojiEvents,
  Spa,
} from "@mui/icons-material";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { getRgbaColor } from "@/theme/colors";
import { orange } from "@mui/material/colors";
import StorySection from "@/components/sections/StorySection";
export default function AboutPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const values = [
    {
      icon: <Star sx={{ fontSize: 40, color: warningMain }} />,
      title: "Premium Quality",
      description:
        "We never compromise on quality. Every product is carefully selected and tested to meet the highest standards.",
      color: warningMain,
    },
    {
      icon: <ChildCare sx={{ fontSize: 40, color: primaryMain }} />,
      title: "Child Safety First",
      description:
        "Your child's safety is our top priority. All products are made with safe, non-toxic materials.",
      color: primaryMain,
    },
    {
      icon: <VerifiedUser sx={{ fontSize: 40, color: infoMain }} />,
      title: "Trust & Reliability",
      description:
        "Building trust with families through transparent practices and reliable customer service.",
      color: infoMain,
    },
    {
      icon: <LocalShipping sx={{ fontSize: 40, color: successMain }} />,
      title: "Fast Delivery",
      description:
        "Making parenting easier with fast delivery, easy returns, and exceptional support.",
      color: successMain,
    },
  ];

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      avatar: "/images/team/sarah.jpg",
      description:
        "Former pediatric nurse with 15+ years experience in child care products.",
    },
    {
      name: "Michael Chen",
      role: "Head of Product",
      avatar: "/images/team/michael.jpg",
      description:
        "Product safety expert with certifications in child safety standards.",
    },
    {
      name: "Emma Rodriguez",
      role: "Customer Success",
      avatar: "/images/team/emma.jpg",
      description:
        "Mother of three, passionate about helping families find the best products.",
    },
  ];

  const achievements = [
    { number: "10K+", label: "Happy Families", icon: <People /> },
    { number: "500+", label: "Premium Products", icon: <EmojiEvents /> },
    { number: "50+", label: "Cities Served", icon: <LocationOn /> },
    { number: "4.9★", label: "Customer Rating", icon: <Star /> },
  ];

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      <Header />

      <Box sx={{ pt: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Breadcrumbs sx={{ mb: 4 }}>
              <Link
                href="/"
                color="inherit"
                sx={{
                  textDecoration: "none",
                  "&:hover": { color: primaryMain },
                }}
              >
                Home
              </Link>
              <Typography color="text.primary">About</Typography>
            </Breadcrumbs>

            <Box sx={{ textAlign: "center", mb: { xs: 4, md: 8 } }}>
              <Chip
                label="Est. 2020"
                sx={{
                  mb: 2,
                  background: primaryMain,
                  color: white,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              />
              <Typography
                variant={isSmallMobile ? "h3" : isMobile ? "h2" : "h1"}
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  color: primaryMain,
                  mb: 3,
                  fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" },
                }}
              >
                About Qurrota Kids
              </Typography>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                color="text.secondary"
                sx={{
                  maxWidth: 800,
                  mx: "auto",
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                Empowering families with premium, safe, and beautiful products
                for their little ones
              </Typography>
            </Box>
          </motion.div>
        </Container>
        <Box
          sx={{
            backdropFilter: "blur(10px)",
          }}
        >
          <Container maxWidth="lg" sx={{ pb: 10, pt: 6 }}>
            {/* Story Section */}
            <Box
              sx={{
                marginTop:4,
                marginBottom: 12,
              }}
            >
              <StorySection />
            </Box>

            {/* Values Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
                <Typography
                  variant={isMobile ? "h4" : "h3"}
                  component="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: textPrimary,
                    mb: 2,
                  }}
                >
                  Our Core Values
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    maxWidth: 600,
                    mx: "auto",
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                  }}
                >
                  These principles guide everything we do, ensuring we deliver
                  the best experience for your family
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  gap: 4,
                  mb: { xs: 6, md: 10 },
                }}
              >
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(20px)",
                        border: `2px solid ${value.color}20`,
                        borderRadius: 4,
                        transition: "all 0.4s ease",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 4,
                          background: value.color,
                          transform: "scaleX(0)",
                          transition: "transform 0.4s ease",
                        },
                        "&:hover": {
                          borderColor: value.color,
                          transform: "translateY(-10px)",
                          boxShadow: `0 20px 40px ${value.color}20`,
                          "&::before": {
                            transform: "scaleX(1)",
                          },
                        },
                      }}
                    >
                      <CardContent sx={{ textAlign: "center", p: 4 }}>
                        <Box
                          sx={{
                            mb: 3,
                            display: "inline-flex",
                            p: 2,
                            borderRadius: "50%",
                            background: `${value.color}15`,
                            border: `2px solid ${value.color}30`,
                          }}
                        >
                          {value.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          sx={{
                            fontWeight: 700,
                            color: textPrimary,
                            mb: 2,
                            fontSize: "1.25rem",
                          }}
                        >
                          {value.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.7,
                            fontSize: "1rem",
                            fontWeight: 400,
                          }}
                        >
                          {value.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            </motion.div>

            {/* Stats Section */}
            {/* <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Box
                sx={{
                  mt: { xs: 6, md: 10 },
                  p: { xs: 4, md: 6 },
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "2px solid rgba(255, 215, 0, 0.3)",
                  borderRadius: 4,
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(255, 215, 0, 0.05)",
                  },
                }}
              >
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: "#333",
                    mb: 4,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  Our Impact in Numbers
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(2, 1fr)",
                      md: "repeat(4, 1fr)",
                    },
                    gap: 4,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Box sx={{ textAlign: "center" }}>
                        <Box
                          sx={{
                            display: "inline-flex",
                            p: 2,
                            borderRadius: "50%",
                            background: "rgba(255, 215, 0, 0.1)",
                            mb: 2,
                            border: "2px solid rgba(255, 215, 0, 0.3)",
                          }}
                        >
                          {React.cloneElement(achievement.icon, {
                            sx: { fontSize: 30, color: "#FFD700" },
                          })}
                        </Box>
                        <Typography
                          variant={isMobile ? "h3" : "h2"}
                          sx={{
                            fontWeight: 800,
                            color: "#FFD700",
                            mb: 1,
                          }}
                        >
                          {achievement.number}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{
                            fontWeight: 600,
                            fontSize: "1rem",
                          }}
                        >
                          {achievement.label}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </motion.div> */}

            {/* Team Section */}
            {/* <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  mt: { xs: 6, md: 10 },
                  mb: { xs: 4, md: 6 },
                }}
              >
                <Typography
                  variant={isMobile ? "h4" : "h3"}
                  component="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: "#333",
                    mb: 2,
                  }}
                >
                  Meet Our Team
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    maxWidth: 600,
                    mx: "auto",
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                  }}
                >
                  The passionate individuals behind Qurrota Kids who are
                  dedicated to serving your family
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                  gap: 4,
                  mb: { xs: 6, md: 10 },
                }}
              >
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(20px)",
                        border: "2px solid rgba(255, 215, 0, 0.2)",
                        borderRadius: 4,
                        transition: "all 0.4s ease",
                        textAlign: "center",
                        "&:hover": {
                          borderColor: "#FFD700",
                          transform: "translateY(-10px)",
                          boxShadow: "0 20px 40px rgba(255, 215, 0, 0.2)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Avatar
                          sx={{
                            width: 120,
                            height: 120,
                            mx: "auto",
                            mb: 3,
                            border: "4px solid #FFD700",
                            background: "#FFD700",
                            fontSize: "3rem",
                            fontWeight: 700,
                          }}
                        >
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </Avatar>
                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          sx={{
                            fontWeight: 700,
                            color: "#333",
                            mb: 1,
                            fontSize: "1.25rem",
                          }}
                        >
                          {member.name}
                        </Typography>
                        <Chip
                          label={member.role}
                          sx={{
                            mb: 3,
                            background: "#FFD700",
                            color: "#000",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                          }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.7,
                            fontSize: "1rem",
                            fontWeight: 400,
                          }}
                        >
                          {member.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            </motion.div> */}

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <Box
                sx={{
                  mt: { xs: 6, md: 10 },
                  p: { xs: 4, md: 6 },
                  background: theme.palette.background.default,
                  borderRadius: 4,
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: theme.palette.background.default,
                  },
                }}
              >
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Typography
                    variant={isMobile ? "h4" : "h3"}
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      color: textPrimary,
                      mb: 3,
                    }}
                  >
                    Ready to Experience the Difference?
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      maxWidth: 600,
                      mx: "auto",
                      fontSize: "1.1rem",
                      lineHeight: 1.6,
                      mb: 4,
                    }}
                  >
                    Join thousands of families who trust Qurrota Kids for their
                    children`&apos;s needs. Discover our premium collection
                    today.
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Link
                      href="/products"
                      sx={{
                        textDecoration: "none",
                        px: 4,
                        py: 2,
                        background: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        borderRadius: 3,
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          background: theme.palette.primary.dark,
                          color: theme.palette.primary.contrastText,
                        },
                      }}
                    >
                      Shop Now
                    </Link>
                    <Link
                      href="/contact"
                      sx={{
                        textDecoration: "none",
                        px: 4,
                        py: 2,
                        border: `2px solid ${theme.palette.primary.dark}`,
                        color: theme.palette.primary.dark,
                        borderRadius: 3,
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: theme.palette.primary.dark,
                          color: theme.palette.primary.contrastText,
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Contact Us
                    </Link>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Container>
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}
