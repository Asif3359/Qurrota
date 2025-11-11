import { motion } from "framer-motion";
import { Box, Typography, Chip, Container } from "@mui/material";
import { Spa, Support, EmojiEvents } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import { useTheme, withTheme } from "@mui/material/styles";
import React from "react";
import { getRgbaColor } from "../../theme/colors";
import { orange } from "@mui/material/colors";

const StorySection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


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

  return (
    <Box
      sx={{
        pt: 6,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        background: theme.palette.background.default,
        backdropFilter: "blur(10px)",
        borderRadius: 2,
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant={isMobile ? "h4" : "h3"}
            component="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: "1.75rem", sm: "2.125rem", md: "3rem" },
            }}
          >
            About Us
          </Typography>

          <Typography
            variant={isMobile ? "body1" : "h6"}
            align="center"
            color="text.secondary"
            sx={{
              mb: { xs: 4, sm: 5, md: 6 },
              maxWidth: 600,
              mx: "auto",
              px: { xs: 1, sm: 2 },
              fontSize: { xs: "0.875rem", sm: "1.25rem" },
            }}
          >
            Empowering families with premium, safe, and beautiful products for
            their little ones
          </Typography>
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
              alignItems: "center",
            }}
          >
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
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 3,
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -10,
                      left: 0,
                      width: 60,
                      height: 4,
                      background: theme.palette.primary.main,
                      borderRadius: 2,
                    },
                  }}
                >
                  Our Story
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
                    mb: 4,
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

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Chip
                    icon={<Spa />}
                    label="Eco-Friendly"
                    sx={{
                      background: successMain,
                      color: white,
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    icon={<Support />}
                    label="24/7 Support"
                    sx={{
                      background: getRgbaColor(infoMain, 0.8),
                      color: white,
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    icon={<EmojiEvents />}
                    label="Award Winning"
                    sx={{
                      background: orange[600],
                      color: white,
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </motion.div>
            </Box>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  height: { xs: 300, md: 400 },
                  background: getRgbaColor(theme.palette.primary.light, 0.75),
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `2px solid ${theme.palette.primary.main}`,
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: getRgbaColor(theme.palette.primary.light, 0.75),
                  },
                }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    p: 4,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      mb: 2,
                      fontStyle: "italic",
                    }}
                  >
                    &quot;Every child deserves the best start in life&quot;
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontStyle: "italic",
                      fontSize: "1.1rem",
                    }}
                  >
                    Our Promise to Every Family.
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default StorySection;
