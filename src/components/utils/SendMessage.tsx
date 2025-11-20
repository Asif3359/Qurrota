'use client';

import { Alert, Box, TextField, Button, useTheme, useMediaQuery } from '@mui/material'
import { useState, useEffect } from 'react';
import { getRgbaColor } from '@/theme/colors';

const SendMessage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  const primaryMain = theme.palette.primary.main;
  const primaryDark = theme.palette.primary.dark;
  const textPrimary = theme.palette.text.primary;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to send');
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!mounted) return null;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {submitted && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Thank you for your message! We&apos;ll get back to you soon.
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        {/* Name and Email Row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3,
            mb: 3,
          }}
        >
          <TextField
            fullWidth
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="standard"
            inputProps={{
              suppressHydrationWarning: true,
            }}
            sx={{
              "& .MuiInput-underline:before": {
                borderBottomColor: getRgbaColor(theme.palette.divider, 0.3),
              },
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: primaryMain,
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: primaryMain,
              },
              "& input": {
                fontSize: "0.95rem",
                color: textPrimary,
              },
              "& input::placeholder": {
                color: theme.palette.text.secondary,
                opacity: 0.7,
              },
            }}
          />
          <TextField
            fullWidth
            name="email"
            type="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleChange}
            required
            variant="standard"
            inputProps={{
              suppressHydrationWarning: true,
            }}
            sx={{
              "& .MuiInput-underline:before": {
                borderBottomColor: getRgbaColor(theme.palette.divider, 0.3),
              },
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: primaryMain,
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: primaryMain,
              },
              "& input": {
                fontSize: "0.95rem",
                color: textPrimary,
              },
              "& input::placeholder": {
                color: theme.palette.text.secondary,
                opacity: 0.7,
              },
            }}
          />
        </Box>

        {/* Subject */}
        <TextField
          fullWidth
          name="subject"
          placeholder="Your Subject"
          value={formData.subject}
          onChange={handleChange}
          required
          variant="standard"
          inputProps={{
            suppressHydrationWarning: true,
          }}
          sx={{
            mb: 3,
            "& .MuiInput-underline:before": {
              borderBottomColor: getRgbaColor(theme.palette.divider, 0.3),
            },
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: primaryMain,
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: primaryMain,
            },
            "& input": {
              fontSize: "0.95rem",
              color: textPrimary,
            },
            "& input::placeholder": {
              color: theme.palette.text.secondary,
              opacity: 0.7,
            },
          }}
        />

        {/* Message */}
        <TextField
          fullWidth
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          multiline
          rows={6}
          required
          variant="standard"
          inputProps={{
            suppressHydrationWarning: true,
          }}
          sx={{
            mb: 4,
            "& .MuiInput-underline:before": {
              borderBottomColor: getRgbaColor(theme.palette.divider, 0.3),
            },
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: primaryMain,
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: primaryMain,
            },
            "& textarea": {
              fontSize: "0.95rem",
              color: textPrimary,
            },
            "& textarea::placeholder": {
              color: theme.palette.text.secondary,
              opacity: 0.7,
            },
          }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="outlined"
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
          Send Message
        </Button>
      </Box>
    </Box>
  )
}

export default SendMessage