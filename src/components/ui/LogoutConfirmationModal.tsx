"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  Typography,
  Avatar,
  useTheme,
} from "@mui/material";
import {
  Logout,
  Warning,
} from "@mui/icons-material";
import { appGradients } from "@/theme/colors";

interface LogoutConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoggingOut?: boolean;
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
    image?: string;
  };
  title?: string;
  subtitle?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  showUserInfo?: boolean;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = React.memo(({
  open,
  onClose,
  onConfirm,
  isLoggingOut = false,
  user,
  title = "Confirm Logout",
  subtitle = "Are you sure you want to sign out?",
  description = "You will be signed out of your account and redirected to the login page. Any unsaved changes will be lost.",
  confirmText = "Sign Out",
  cancelText = "Cancel",
  showUserInfo = true,
}) => {
  const theme = useTheme();

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pb: 1,
          background: appGradients.primary(theme),
          color: 'white',
          borderRadius: '16px 16px 0 0',
          m: 0,
          p: 3,
        }}
      >
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Warning sx={{ fontSize: '1.5rem' }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
            {subtitle}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 2 }}>
        {showUserInfo && user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              src={user.avatar || user.image}
              sx={{
                width: 50,
                height: 50,
                backgroundColor: theme.palette.primary.main,
                border: `2px solid ${theme.palette.primary.light}`,
              }}
            >
              {getInitials(user.name)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                {user.name || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>
        )}
        
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {description}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, gap: 2 }}>
        <Button
          onClick={onClose}
          disabled={isLoggingOut}
          variant="outlined"
          sx={{
            borderColor: theme.palette.grey[400],
            color: theme.palette.text.secondary,
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.9rem',
            borderWidth: 2,
            '&:hover': {
              borderColor: theme.palette.grey[600],
              backgroundColor: theme.palette.grey[50],
              borderWidth: 2,
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoggingOut}
          variant="contained"
          startIcon={isLoggingOut ? <CircularProgress size={20} color="inherit" /> : <Logout />}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.9rem',
            boxShadow: '0 4px 16px rgba(211, 47, 47, 0.4)',
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.error.dark}, ${theme.palette.error.main})`,
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(211, 47, 47, 0.5)',
            },
            '&:disabled': {
              background: theme.palette.grey[300],
              color: theme.palette.grey[500],
              transform: 'none',
              boxShadow: 'none',
            },
          }}
        >
          {isLoggingOut ? 'Signing Out...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

LogoutConfirmationModal.displayName = "LogoutConfirmationModal";

export default LogoutConfirmationModal;
