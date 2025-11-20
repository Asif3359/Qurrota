import React from 'react'
import { Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const OutLineButton = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Button
      onClick={onClick}
      variant="outlined"
      size={isMobile ? "small" : "medium"}
      sx={{
        px: isMobile ? 2 : 3,
        py: isMobile ? 1 : 1.5,
        width: isMobile ? "100%" : "auto",
        background: "transparent",
        color: theme.palette.primary.main,
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: "8px",
        fontWeight: 500,
        fontSize: isMobile ? "0.8rem" : "0.95rem",
        textTransform: "none",
        transition: "all 0.2s ease",
        "&:hover": {
          background: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderColor: theme.palette.primary.main,
          transform: "translateY(-1px)",
        },
      }}
    >
      {children}
    </Button>
  );
};

export default OutLineButton;