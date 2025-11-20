import { Box, Container, Divider, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { Email, LocationOn, Phone } from "@mui/icons-material";
import { getRgbaColor } from "../../theme/colors";
import SendMessage from "../utils/SendMessage";
import SectionHeaders from "../Headers/SectionHeaders";

const contactInfo = [
  {
    icon: Email,
    title: "Email",
    info: "info@qurrota.com",
    description: "We'll get back to you within 24 hours",
    borderColor: "#EFE24E",
    bgColor: "#FFFFFF",
    iconBg: "#FFF3CC",
    iconColor: "#EFE24E",
  },
  {
    icon: Phone,
    title: "Call",
    info: "+880 01789846204",
    description: "Monday - Friday from 8am to 6pm",
    borderColor: "#D44EEF",
    bgColor: "#FFFFFF",
    iconBg: "#F3E8FF",
    iconColor: "#D44EEF",
  },
  {
    icon: Email,
    title: "Email",
    info: "info@qurrota.com",
    description: "We'll get back to you within 24 hours",
    borderColor: "#EFE24E",
    bgColor: "#FFFFFF",
    iconBg: "#FFF3CC",
    iconColor: "#EFE24E",
  },
];

const GetInTouch = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <Container
        maxWidth="lg"
        sx={{
          background: theme.palette.background.default,
          paddingY: { xs: 2, md: 4 },
          borderRadius: 2,
        }}
      >
        {/* Main Content Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 4, md: 0 },
              alignItems: "stretch",
            }}
          >
            {/* Left Side - Contact Information Cards */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <Box
                    key={index}
                    sx={{
                      background: info.bgColor,
                      border: `2px solid ${info.borderColor}`,
                      borderRadius: 3,
                      p: { xs: 1, md: 2 },
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 8px 24px ${getRgbaColor(info.borderColor, 0.2)}`,
                      },
                    }}
                  >
                    {/* Icon Container */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: { xs: 56, md: 64 },
                        height: { xs: 56, md: 64 },
                        borderRadius: "50%",
                        background: info.iconBg,
                        flexShrink: 0,
                      }}
                    >
                      <IconComponent 
                        sx={{ 
                          fontSize: { xs: 28, md: 32 },
                          color: info.iconColor
                        }} 
                      />
                    </Box>

                    {/* Text Content */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 500,
                          color: "#1a1a1a",
                          mb: 0.5,
                          fontSize: { xs: "1.125rem", md: "1.25rem" },
                        }}
                      >
                        {info.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          color: "#1a1a1a",
                          mb: 0.5,
                          fontSize: { xs: "1rem", md: "1.125rem" },
                        }}
                      >
                        {info.info}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 400,
                          color: "#6b7280",
                          lineHeight: 1.5,
                          fontSize: { xs: "0.875rem", md: "0.95rem" },
                        }}
                      >
                        {info.description}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {/* Divider - Vertical on desktop, hidden on mobile */}
            <Divider 
              orientation="vertical" 
              flexItem
              sx={{ 
                mx: { md: 6 },
                display: { xs: "none", md: "block" },
                borderColor: "#D6C2F9"
              }} 
            />

            {/* Right Side - Contact Form */}
            <Box sx={{ flex: 1 }}>
              <SendMessage />
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default GetInTouch;
