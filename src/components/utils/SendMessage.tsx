import { Card, CardContent, Alert, Box, TextField, Button } from '@mui/material'
import { Send } from '@mui/icons-material'
import { useState, useEffect } from 'react';

const SendMessage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

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
    <Card
    elevation={0}
    sx={{
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      border: "2px solid rgba(255, 215, 0, 0.3)",
      borderRadius: 4,
      position: "relative",
      overflow: "hidden",
      height: "100%",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(255, 215, 0, 0.05)",
      },
    }}
  >
    <CardContent
      sx={{
        p: { xs: 3, md: 4 },
        position: "relative",
        zIndex: 1,
      }}
    >
      {submitted && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Thank you for your message! We&apos;ll get back to you
          soon.
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3,
            mb: 3,
            py: 2,
          }}
        >
          <TextField
            fullWidth
            label="Your Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            inputProps={{
              suppressHydrationWarning: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255, 215, 0, 0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "#FFD700",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#9C27B0",
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            inputProps={{
              suppressHydrationWarning: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255, 215, 0, 0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "#FFD700",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#9C27B0",
                },
              },
            }}
          />
        </Box>

        <TextField
          fullWidth
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          inputProps={{
            suppressHydrationWarning: true,
          }}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgba(255, 215, 0, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: "#FFD700",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#9C27B0",
              },
            },
          }}
        />

        <TextField
          fullWidth
          label="Message"
          name="message"
          multiline
          rows={5}
          value={formData.message}
          onChange={handleChange}
          required
          inputProps={{
            suppressHydrationWarning: true,
          }}
          sx={{
            mb: 4,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgba(255, 215, 0, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: "#FFD700",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#9C27B0",
              },
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={<Send />}
          sx={{
            background: "#FFD700",
            color: "#000",
            fontWeight: 700,
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
            borderRadius: 3,
            transition: "all 0.3s ease",
            "&:hover": {
              background: "#FFC000",
              transform: "translateY(-2px)",
              boxShadow: "0 10px 20px rgba(255, 215, 0, 0.3)",
            },
          }}
        >
          Send Message
        </Button>
      </Box>
    </CardContent>
  </Card>
  )
}

export default SendMessage