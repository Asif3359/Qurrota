import { Box, Link, Container, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { getRgbaColor } from "../../theme/colors";

const JoinUsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        pb: 16,
        pt: 10,
        // borderTop: `2px solid ${theme.palette.primary.light}`,
        display: "flex",
        flexDirection: "column",
        // gap: 2,
        background: getRgbaColor(theme.palette.primary.main, 0.76),
        backdropFilter: "blur(10px)", 
      }}
    >
      <Container maxWidth="lg" >
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Box
            sx={{
              p: 4,
              background: getRgbaColor(theme.palette.primary.light, 0.75),
              border: `2px solid ${theme.palette.primary.light}`,
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
                background: getRgbaColor(theme.palette.primary.light, 0.79),
              },
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                variant={isMobile ? "h4" : "h3"}
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 3,
                }}
              >
                Ready to Get Started?
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
                Join thousands of families who trust Qurrota Kids. Start
                shopping today!
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
                      boxShadow: `0 10px 20px ${getRgbaColor(theme.palette.primary.main, 0.3)}`,
                    },
                  }}
                >
                  Shop Now
                </Link>
                <Link
                  href="/about"
                  sx={{
                    textDecoration: "none",
                    px: 4,
                    py: 2,
                    border: `2px solid ${theme.palette.primary.dark}`,
                    color: theme.palette.secondary.main,
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
                  Learn More
                </Link>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default JoinUsSection;
