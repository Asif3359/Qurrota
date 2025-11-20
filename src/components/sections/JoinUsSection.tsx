import { Box, Button, Container, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";
import { additionalColors } from "@/theme/colors";
import OutLineButton from "../buttons/OutLineButton";
import { useRouter } from "next/navigation";
import SectionHeaders from "../Headers/SectionHeaders";

const JoinUsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  return (
    <Box
      sx={{
        marginTop: 4,
        marginBottom: 4,
        // padding: { xs: 3, md: 6 },
        paddingX: { xs: 3, md: 8 },
      }}
    >
      <Container  sx={{ background: additionalColors.white, paddingX: { xs: 3, md: 8 }, paddingY: { xs: 4, md: 6 }, border: `1px solid #EBE1FC`
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              textAlign: "center",
              px: { xs: 2, sm: 4 },
            }}
          >
            {/* <Typography
              variant={isMobile ? "h4" : "h3"}
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 2,
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              }}
            >
              Ready to Get Started?
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 600,
                mx: "auto",
                mb: 4,
                fontSize: { xs: "0.95rem", sm: "1rem" },
                lineHeight: 1.6,
              }}
            >
              Join thousands of families who trust Qurrota Kids. Start shopping today!
            </Typography> */}
            <SectionHeaders title="Ready to Get Started?" description="Join thousands of families who trust Qurrota Kids. Start shopping today!" />

            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <OutLineButton
                onClick={() => router.push("/products")}
              >
                Shop Now
              </OutLineButton>
              <OutLineButton
                onClick={() => router.push("/about")}
              >
                Learn More
              </OutLineButton>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default JoinUsSection;
