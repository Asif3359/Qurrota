'use client';

import React, { useEffect, useState, Suspense } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { Email, Security } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { getRgbaColor, appGradients } from '@/theme/colors';

const VerificationForm: React.FC = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { verifyEmail, resendVerification } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const primaryMain = theme.palette.primary.main;
  const primaryDark = theme.palette.primary.dark;
  const backgroundDefault = theme.palette.background.default;
  const backgroundPaper = theme.palette.background.paper;
  const white = theme.palette.common.white;
  const black = theme.palette.common.black;

  useEffect(() => {
    setMounted(true);
    // Get email from URL params if available
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  // Cooldown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendCooldown]);

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

    if (resendCooldown > 0) {
      setError(`Please wait ${resendCooldown} seconds before requesting another code`);
      return;
    }

    setResendLoading(true);
    
    try {
      const success = await (resendVerification ? resendVerification(email) : Promise.resolve(false));
      if (success) {
        setSuccessMsg('Verification code resent to your email');
        setResendCooldown(60); // 60 seconds cooldown
      } else {
        setError('Failed to resend verification code. Please try again.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to resend code';
      setError(message);
    } finally {
      setResendLoading(false);
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
        background: backgroundDefault,
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
              background: backgroundPaper,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${getRgbaColor(primaryMain, 0.2)}`,
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
                  color: primaryMain,
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
                      <Email sx={{ color: primaryMain, mr: 1 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: getRgbaColor(primaryMain, 0.3),
                      },
                      '&:hover fieldset': {
                        borderColor: primaryMain,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: primaryDark,
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
                      <Security sx={{ color: primaryMain, mr: 1 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: getRgbaColor(primaryMain, 0.3),
                      },
                      '&:hover fieldset': {
                        borderColor: primaryMain,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: primaryDark,
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
                    background: appGradients.primary(theme),
                    color: theme.palette.primary.contrastText,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    '&:hover': {
                      background: appGradients.primary(theme),
                    },
                    '&:disabled': {
                      background: getRgbaColor(primaryMain, 0.5),
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
                    disabled={loading || resendLoading || resendCooldown > 0}
                    sx={{
                      color: resendCooldown > 0 ? 'text.disabled' : primaryDark,
                      fontWeight: 600,
                      '&:hover': {
                        color: resendCooldown > 0 ? 'text.disabled' : primaryMain,
                        backgroundColor: resendCooldown > 0 ? 'transparent' : getRgbaColor(primaryMain, 0.04),
                      },
                    }}
                  >
                    {resendLoading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} color="inherit" />
                        Sending...
                      </Box>
                    ) : resendCooldown > 0 ? (
                      `Resend Code (${resendCooldown}s)`
                    ) : (
                      'Resend Code'
                    )}
                  </Button>
                  {resendCooldown > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Please wait before requesting another code
                    </Typography>
                  )}
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
                        color: primaryMain,
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

const VerificationPage: React.FC = () => {
  const theme = useTheme();
  return (
    <Suspense fallback={
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.palette.background.default,
        }}
      >
        <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
      </Box>
    }>
      <VerificationForm />
    </Suspense>
  );
};

export default VerificationPage;