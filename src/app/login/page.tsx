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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { motion } from 'framer-motion';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login, forgotPassword, resetPassword } = useAuth();
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid email or password';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    setError('');
    setSuccessMsg('');
    if (!forgotEmail) {
      setError('Please enter your email');
      return;
    }
    try {
      const ok = await (forgotPassword ? forgotPassword(forgotEmail) : Promise.resolve(false));
      if (ok) {
        setSuccessMsg('Reset code sent to your email');
        setForgotOpen(false);
        setResetEmail(forgotEmail);
        setResetOpen(true);
      } else {
        setError('Failed to send reset code');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send reset code';
      setError(message);
    }
  };

  const handleReset = async () => {
    setError('');
    setSuccessMsg('');
    if (!resetEmail || !resetCode || !newPassword) {
      setError('Please fill all fields');
      return;
    }
    try {
      const ok = await (resetPassword ? resetPassword(resetEmail, resetCode, newPassword) : Promise.resolve(false));
      if (ok) {
        setSuccessMsg('Password reset successful. You can login now.');
        setResetOpen(false);
      } else {
        setError('Password reset failed');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      setError(message);
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
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                align="center"
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                Sign in to your Qurrota Kids account
              </Typography>
            </motion.div>

            {(error || successMsg) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error && (
                  <Alert severity="error" sx={{ mb: 1 }}>
                    {error}
                  </Alert>
                )}
                {successMsg && (
                  <Alert severity="success" sx={{ mb: 1 }}>
                    {successMsg}
                  </Alert>
                )}
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
                        <Email sx={{ color: '#FFD700' }} />
                      </InputAdornment>
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
                        <Lock sx={{ color: '#FFD700' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
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
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
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
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Don&apos;t have an account?{' '}
                    <Link
                      href="/signup"
                      sx={{
                        color: '#9C27B0',
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          color: '#FFD700',
                        },
                      }}
                    >
                      Sign up here
                    </Link>
                    {' '}•{' '}
                    <Link
                      href="#"
                      onClick={(e) => { e.preventDefault(); setForgotOpen(true); }}
                      sx={{
                        color: '#9C27B0',
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': { color: '#FFD700' },
                        ml: 1
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

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onClose={() => setForgotOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            fullWidth
            label="Email"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForgotOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleForgot}>Send Code</Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetOpen} onClose={() => setResetOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Verification Code"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleReset}>Reset</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoginPage;
