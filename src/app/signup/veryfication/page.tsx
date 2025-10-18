'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { Email, Security } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

const VerificationPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { verifyEmail, resendVerification } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
    // Get email from URL params if available
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleVerifyEmail = async () => {
    setError('');
    setSuccessMsg('');
    
    if (!email || !verifyCode) {
      setError('Please enter your email and verification code');
      return;
    }

    setLoading(true);

    try {
      const ok = await (verifyEmail ? verifyEmail(email, verifyCode) : Promise.resolve(false));
      if (ok) {
        setSuccessMsg('Email verified successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError('Verification failed. Please check your code and try again.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setSuccessMsg('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    
    try {
      const success = await (resendVerification ? resendVerification(email) : Promise.resolve(false));
      if (success) {
        setSuccessMsg('Verification code resent to your email');
      } else {
        setError('Failed to resend verification code. Please try again.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to resend code';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFD700',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={0}
            sx={{
              padding: { xs: 3, md: 6 },
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography
                variant="h3"
                component="h1"
                align="center"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: '#FFD700',
                  mb: 1,
                }}
              >
                Verify Your Email
              </Typography>
              <Typography
                variant="body1"
                align="center"
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                Please enter the verification code sent to your email address
              </Typography>
            </motion.div>

            {(error || successMsg) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                {successMsg && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {successMsg}
                  </Alert>
                )}
              </motion.div>
            )}

            <Box component="form" sx={{ mt: 1 }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <Email sx={{ color: '#FFD700', mr: 1 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 215, 0, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#FFD700',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#9C27B0',
                      },
                    },
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="verifyCode"
                  label="Verification Code"
                  name="verifyCode"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <Security sx={{ color: '#FFD700', mr: 1 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 215, 0, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#FFD700',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#9C27B0',
                      },
                    },
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  onClick={handleVerifyEmail}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    background: '#FFD700',
                    color: '#000',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    '&:hover': {
                      background: '#FFC000',
                    },
                    '&:disabled': {
                      background: 'rgba(255, 215, 0, 0.5)',
                    },
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      Verifying...
                    </Box>
                  ) : (
                    'Verify Email'
                  )}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Didn&apos;t receive the code?
                  </Typography>
                  <Button
                    variant="text"
                    onClick={handleResendCode}
                    disabled={loading}
                    sx={{
                      color: '#9C27B0',
                      fontWeight: 600,
                      '&:hover': {
                        color: '#FFD700',
                        backgroundColor: 'rgba(156, 39, 176, 0.04)',
                      },
                    }}
                  >
                    Resend Code
                  </Button>
                </Box>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Button
                    variant="text"
                    onClick={() => router.push('/signup')}
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        color: '#FFD700',
                      },
                    }}
                  >
                    Back to Sign Up
                  </Button>
                </Box>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default VerificationPage;