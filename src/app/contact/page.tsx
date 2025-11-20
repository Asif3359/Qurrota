"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Email,
  Phone,
  LocationOn,
  Support,
  VerifiedUser,
  LocalShipping,
} from "@mui/icons-material";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { getRgbaColor } from "@/theme/colors";
import SendMessage from "@/components/utils/SendMessage";
import JoinUsSection from "@/components/sections/JoinUsSection";
import GetInTouch from "@/components/sections/GetInTouch";

export default function ContactPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const primaryMain = theme.palette.primary.main;
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const successMain = theme.palette.success.main;
  const infoMain = theme.palette.info.main;
  const warningMain = theme.palette.warning.main;
  const errorMain = theme.palette.error.main;
  const textPrimary = theme.palette.text.primary;
  const textSecondary = theme.palette.text.secondary;
  const white = theme.palette.common.white;
  const black = theme.palette.common.black;
  const backgroundPaper = theme.palette.background.paper;

  const contactInfo = [
    {
      icon: <Email sx={{ fontSize: 40, color: warningMain }} />,
      title: "Email Us",
      info: "info@qurrota.com",
      description: "We'll get back to you within 24 hours",
      color: warningMain,
    },
    {
      icon: <Phone sx={{ fontSize: 40, color: primaryMain }} />,
      title: "Call Us",
      info: "+880 01789846204",
      description: "Monday - Friday from 8am to 6pm",
      color: primaryMain,
    },
    {
      icon: <LocationOn sx={{ fontSize: 40, color: infoMain }} />,
      title: "Visit Us",
      info: "Dhaka, Bangladesh",
      description: "Visit us for any questions or inquiries",
      color: infoMain,
    },
  ];

  const features = [
    {
      icon: <Support sx={{ fontSize: 30, color: successMain }} />,
      title: "24/7 Support",
      description: "Round-the-clock customer service",
      color: successMain,
    },
    {
      icon: <VerifiedUser sx={{ fontSize: 30, color: warningMain }} />,
      title: "Trusted Brand",
      description: "Thousands of happy families",
      color: warningMain,
    },
    {
      icon: <LocalShipping sx={{ fontSize: 30, color: errorMain }} />,
      title: "Fast Delivery",
      description: "Quick and reliable shipping",
      color: errorMain,
    },
  ];

  const faqs = [
    //   {
    //     question: "What are your shipping times?",
    //     answer:
    //       "We typically ship within 1-2 business days and delivery takes 3-5 business days.",
    //   },
    {
      question: "Do you offer returns?",
      answer:
        "Yes, we offer a 7-day return policy for unused items in original packaging.",
    },
    {
      question: "Are your products safe for children?",
      answer:
        "Absolutely! All our products meet or exceed safety standards and are tested for quality.",
    },
    // {
    //   question: "Do you ship internationally?",
    //   answer:
    //     "Currently, we ship to all 50 US states. International shipping coming soon!",
    // },
  ];

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      {/* Animated Background */}
      {/* <AnimatedBackground /> */}

      {/* Header */}
      <Header />
      {/* Hero Section */}
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
                sx={{ textDecoration: "none", "&:hover": { color: primaryMain } }}
              >
                Home
              </Link>
              <Typography color="text.primary">Contact</Typography>
            </Breadcrumbs>

            <Box sx={{ textAlign: "center", mb: { xs: 4, md: 8 } }}>
              <Chip
                label="Get Support"
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
                Get in Touch
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
                Have questions? We&apos;d love to hear from you. Send us a
                message and we&apos;ll respond as soon as possible.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>
      {/* Main Content */}
      <Box
        sx={{
          pt: { xs: 3, md: 4 },
          pb: 10,
          backdropFilter: "blur(10px)",
        }}
      >
        <Container maxWidth="lg">
          {/* Contact Form & Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Box sx={{ mb: 8 }}>
              <GetInTouch />
            </Box>
          </motion.div>

          {/* Features Section */}
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
                Why Choose Qurrota Kids?
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
                We&apos;re committed to providing the best experience for your
                family
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: 4,
                mb: { xs: 6, md: 10 },
              }}
            >
              {features.map((feature, index) => (
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
                      background: getRgbaColor(backgroundPaper, 0.95),
                      backdropFilter: "blur(20px)",
                      borderRadius: 4,
                      transition: "all 0.4s ease",
                      position: "relative",
                      overflow: "hidden",
                      textAlign: "center",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        boxShadow: `0 20px 40px ${getRgbaColor(feature.color, 0.2)}`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          mb: 3,
                          display: "inline-flex",
                          p: 2,
                          borderRadius: "50%",
                          background: getRgbaColor(feature.color, 0.15),
                        }}
                      >
                        {feature.icon}
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
                        {feature.title}
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
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Box
              sx={{
                p: { xs: 4, md: 6 },
                background: getRgbaColor(primaryMain, 0.1),
                backdropFilter: "blur(20px)",
                borderRadius: 4,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography
                  variant={isMobile ? "h4" : "h3"}
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: textPrimary,
                    mb: 4,
                  }}
                >
                  Frequently Asked Questions
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                    gap: 4,
                  }}
                >
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Box
                        sx={{
                          p: 3,
                          background: getRgbaColor(backgroundPaper, 0.8),
                          borderRadius: 3,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background: getRgbaColor(backgroundPaper, 0.95),
                            transform: "translateY(-2px)",
                            boxShadow: `0 8px 16px ${getRgbaColor(primaryMain, 0.15)}`,
                          },
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: textPrimary,
                            mb: 2,
                            fontSize: "1.1rem",
                          }}
                        >
                          {faq.question}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.7,
                            fontSize: "1rem",
                          }}
                        >
                          {faq.answer}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
      {/* Join Us Section */}
      <Container maxWidth="lg">
        <JoinUsSection />
      </Container>
      {/* Footer */}
      <Footer />
    </Box>
  );
}
