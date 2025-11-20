"use client";

import React from "react";
import { Box, Container } from "@mui/material";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import ProductsSection from "@/components/sections/ProductsSection";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import StorySection from "@/components/sections/StorySection";
import GetInTouch from "@/components/sections/GetInTouch";
import JoinUsSection from "@/components/sections/JoinUsSection";
import StructuredData, {
  OrganizationData,
  WebSiteData,
  HomePageData,
} from "@/components/seo/StructuredData";
import SectionHeaders from "@/components/Headers/SectionHeaders";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData type="Organization" data={OrganizationData} />
      <StructuredData type="WebSite" data={WebSiteData} />
      <StructuredData type="WebPage" data={HomePageData} />

      <Box
        sx={{
          minHeight: "100dvh",
          position: "relative",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Animated Background */}
        {/* <AnimatedBackground /> */}

        {/* Header */}
        <Header />

        {/* Main Content */}
        <Box
          sx={{
            pt: { xs: 5, sm: 6, md: 7 },
          }}
        >
          <HeroSection />
          <ProductsSection isHomePage={true} />
          {/* <StorySection /> */}
          <Box sx={{
            marginTop: 6,
            marginBottom: 16,
          }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Box sx={{ textAlign: "center", mb: { xs: 2, md: 4 } }}>
                <SectionHeaders
                  title="Why Choose Us"
                  description="The number speak for themselves"
                />
              </Box>
            </motion.div>
            <StorySection />
          </Box>

          <Box sx={{
            marginTop: 4,
            marginBottom: 8,
          }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Box sx={{ textAlign: "center", mb: { xs: 2, md: 4 } }}>
                <SectionHeaders
                  title="Get in Touch"
                  description="Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
                />
              </Box>
            </motion.div>
            <GetInTouch />
          </Box>
          <Box sx={{ marginBottom: 8 , marginTop: 4 }}>
            <Container maxWidth="lg">
              <JoinUsSection />
            </Container>
          </Box>
        </Box>
        {/* Footer */}
        <Footer />
      </Box>
    </>
  );
}
