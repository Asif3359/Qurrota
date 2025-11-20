import { Typography, useTheme } from "@mui/material";
import { Box } from "@mui/material";
import React from "react";
import { useMediaQuery } from "@mui/material";

function SectionHeaders({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box>
      <Typography
        variant={isMobile ? "h4" : "h3"}
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: 2,
          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
        }}
      >
        {title}
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
        {description}
      </Typography>
    </Box>
  );
}

export default SectionHeaders;
