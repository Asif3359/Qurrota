import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { Email, LocationOn, Phone } from "@mui/icons-material";
import { getRgbaColor } from "../../theme/colors";
import SendMessage from "../utils/SendMessage";

const contactInfo: {
  title: string;
  info: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    icon: <Email sx={{ fontSize: 40, color: "#FFD700" }} />,
    title: "Email Us",
    info: "info@qurrota.com",
    description: "We'll get back to you within 24 hours",
    color: "#FFD700",
  },
  {
    icon: <Phone sx={{ fontSize: 40, color: "#9C27B0" }} />,
    title: "Call Us",
    info: "+880 01789846204",
    description: "Monday - Friday from 8am to 6pm",
    color: "#9C27B0",
  },
  {
    icon: <LocationOn sx={{ fontSize: 40, color: "#2196F3" }} />,
    title: "Visit Us",
    info: "Dhaka, Bangladesh",
    description: "Visit us for any questions or inquiries",
    color: "#2196F3",
  },
] as const;

const GetInTouch = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Box
      sx={{
        pt: 6,
        display: "flex",
        flexDirection: "column",
        // gap: 2,
        background: getRgbaColor(theme.palette.primary.main, 0.76),
        backdropFilter: "blur(10px)",
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 8 } }}>
            <Typography
              variant={isSmallMobile ? "h3" : isMobile ? "h2" : "h1"}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                color: "#FFD700",
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
              Have questions? We&apos;d love to hear from you. Send us a message
              and we&apos;ll respond as soon as possible.
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: { xs: 4, md: 6 },
              mb: { xs: 6, md: 10 },
              alignItems: "start",
            }}
          >
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <Typography
                  variant={isMobile ? "h4" : "h3"}
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: "#333",
                    mb: 3,
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -10,
                      left: 0,
                      width: 60,
                      height: 4,
                      background: "#FFD700",
                      borderRadius: 2,
                    },
                  }}
                >
                  Send Us a Message
                </Typography>

                <SendMessage />
              </Box>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  height: "100%",
                }}
              >
                <Typography
                  variant={isMobile ? "h4" : "h3"}
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: "#333",
                    mb: 3,
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -10,
                      left: 0,
                      width: 60,
                      height: 4,
                      background: "#FFD700",
                      borderRadius: 2,
                    },
                  }}
                >
                  Contact Information
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5 }}
                    >
                      <Card
                        elevation={0}
                        sx={{
                          background: "rgba(255, 255, 255, 0.95)",
                          backdropFilter: "blur(20px)",
                          border: `2px solid ${info.color}20`,
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
                            background: info.color,
                            transform: "scaleX(0)",
                            transition: "transform 0.4s ease",
                          },
                          "&:hover": {
                            borderColor: info.color,
                            transform: "translateY(-5px)",
                            boxShadow: `0 15px 30px ${info.color}20`,
                            "&::before": {
                              transform: "scaleX(1)",
                            },
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 3,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                p: 2,
                                borderRadius: "50%",
                                background: `${info.color}15`,
                                border: `2px solid ${info.color}30`,
                              }}
                            >
                              {info.icon}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="h6"
                                component="h3"
                                gutterBottom
                                sx={{ fontWeight: 700, color: "#333", mb: 1 }}
                              >
                                {info.title}
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 600, color: "#666", mb: 1 }}
                              >
                                {info.info}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ lineHeight: 1.6 }}
                              >
                                {info.description}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default GetInTouch;
