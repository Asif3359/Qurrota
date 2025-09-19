'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Box } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';

export default function ModeratorDashboardPage() {
  const { isAuthenticated, user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (user?.role !== 'moderator') {
      router.replace('/dashboard');
    }
  }, [isReady, isAuthenticated, user?.role, router]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Moderator Dashboard</Typography>
      <Typography>Welcome, {user?.name ?? 'Moderator'}.</Typography>
    </Box>
  );
}


