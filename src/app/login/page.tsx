'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Container,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import QurrotaKids from '../../lib/QurrotaLogo';
import { getRgbaColor, appGradients } from '@/theme/colors';

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login, resendVerification } = useAuth();
  const router = useRouter();

  const primaryMain = theme.palette.primary.main;
  const primaryDark = theme.palette.primary.dark;
  const backgroundDefault = theme.palette.background.default;
  const backgroundPaper = theme.palette.background.paper;
  const white = theme.palette.common.white;

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || 'Login failed');
        setNeedsVerification(result.needsVerification || false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid email or password';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError('');
    
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
        setError(''); // Clear any previous errors
        setResendCooldown(60); // 60 seconds cooldown
        // Show success message in a temporary way
        const originalError = error;
        setError('Verification code resent to your email');
        setTimeout(() => setError(originalError), 3000);
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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={24}
            sx={{
              padding: { xs: 4, md: 6 },
              borderRadius: 6,
              background: backgroundPaper,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${getRgbaColor(primaryMain, 0.2)}`,
              boxShadow: `0 25px 50px -12px ${getRgbaColor(theme.palette.common.black, 0.25)}, 0 0 0 1px ${getRgbaColor(white, 0.1)}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: appGradients.primary(theme),
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s ease-in-out infinite',
              },
              '@keyframes shimmer': {
                '0%': { backgroundPosition: '-200% 0' },
                '100%': { backgroundPosition: '200% 0' },
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 4,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80px',
                    height: '3px',
                    background: appGradients.primary(theme),
                    borderRadius: '2px',
                  }
                }}
              >
                 <Link href="/">
                  <QurrotaKids width={280} height={90} />
                </Link>
              </Box>
            </motion.div>
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
                  fontWeight: 800,
                  background: appGradients.primary(theme),
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                align="center"
                color="text.secondary"
                sx={{ 
                  mb: 4,
                  fontSize: '1.1rem',
                  fontWeight: 400,
                  opacity: 0.8,
                }}
              >
                Sign in to your Qurrota account
              </Typography>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  severity={error.includes('resent') ? 'success' : 'error'} 
                  sx={{ mb: 1 }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ mb: needsVerification ? 1 : 0 }}>
                      {error}
                    </Typography>
                    {needsVerification && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Need to verify your email?
                        </Typography>
                        <Button
                          variant="text"
                          onClick={handleResendVerification}
                          disabled={resendLoading || resendCooldown > 0}
                          sx={{
                            color: primaryMain,
                            textDecoration: 'none',
                            fontWeight: 600,
                            minWidth: 'auto',
                            p: 0.5,
                            '&:hover': {
                              color: primaryDark,
                              backgroundColor: getRgbaColor(primaryMain, 0.04),
                            },
                          }}
                        >
                          {resendLoading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CircularProgress size={12} color="inherit" />
                              Sending...
                            </Box>
                          ) : resendCooldown > 0 ? (
                            `Resend (${resendCooldown}s)`
                          ) : (
                            'Resend Code'
                          )}
                        </Button>
                      </Box>
                    )}
                    {needsVerification && (
                      <Box sx={{ mt: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => router.push(`/signup/veryfication?email=${encodeURIComponent(email)}`)}
                          sx={{
                            borderColor: primaryMain,
                            color: primaryMain,
                            '&:hover': {
                              borderColor: primaryDark,
                              backgroundColor: getRgbaColor(primaryMain, 0.04),
                            },
                          }}
                        >
                          Go to Verification Page
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Alert>
              </motion.div>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: primaryMain }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: getRgbaColor(backgroundPaper, 0.8),
                      '& fieldset': {
                        borderColor: getRgbaColor(primaryMain, 0.2),
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: primaryMain,
                        borderWidth: 2,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: primaryMain,
                        borderWidth: 2,
                        boxShadow: `0 0 0 3px ${getRgbaColor(primaryMain, 0.1)}`,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: primaryMain,
                      fontWeight: 500,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: primaryMain,
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
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: primaryMain }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: primaryMain }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: getRgbaColor(backgroundPaper, 0.8),
                      '& fieldset': {
                        borderColor: getRgbaColor(primaryMain, 0.2),
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: primaryMain,
                        borderWidth: 2,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: primaryMain,
                        borderWidth: 2,
                        boxShadow: `0 0 0 3px ${getRgbaColor(primaryMain, 0.1)}`,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: primaryMain,
                      fontWeight: 500,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: primaryMain,
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
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 4,
                    mb: 3,
                    py: 2,
                    background: appGradients.primary(theme),
                    color: theme.palette.primary.contrastText,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    textTransform: 'none',
                    boxShadow: `0 8px 32px ${getRgbaColor(primaryMain, 0.3)}`,
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      background: appGradients.primary(theme),
                      boxShadow: `0 12px 40px ${getRgbaColor(primaryMain, 0.4)}`,
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                    '&:disabled': {
                      background: getRgbaColor(primaryMain, 0.3),
                      boxShadow: 'none',
                      transform: 'none',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(90deg, transparent, ${getRgbaColor(white, 0.2)}, transparent)`,
                      transition: 'left 0.5s',
                    },
                    '&:hover::before': {
                      left: '100%',
                    },
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                    Don&apos;t have an account?{' '}
                    <Link
                      href="/signup"
                      sx={{
                        color: primaryMain,
                        textDecoration: 'none',
                        fontWeight: 600,
                        position: 'relative',
                        '&:hover': {
                          color: primaryDark,
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: '-2px',
                          left: 0,
                          width: '0%',
                          height: '2px',
                          background: appGradients.primary(theme),
                          transition: 'width 0.3s ease',
                        },
                        '&:hover::after': {
                          width: '100%',
                        },
                      }}
                    >
                      Sign up here
                    </Link>
                    {' '}•{' '}
                    <Link
                      href="/login/forgetpassword"
                      sx={{
                        color: primaryMain,
                        textDecoration: 'none',
                        fontWeight: 600,
                        position: 'relative',
                        '&:hover': { 
                          color: primaryDark,
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: '-2px',
                          left: 0,
                          width: '0%',
                          height: '2px',
                          background: appGradients.primary(theme),
                          transition: 'width 0.3s ease',
                        },
                        '&:hover::after': {
                          width: '100%',
                        },
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Container>

    </Box>
  );
};

export default LoginPage;
