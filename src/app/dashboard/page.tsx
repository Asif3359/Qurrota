'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardRouter() {
  const { user, isAuthenticated, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    const role = user?.role ?? 'user';
    if (role === 'admin') router.replace('/dashboard/admin');
    else if (role === 'moderator') router.replace('/dashboard/moderator');
    else router.replace('/dashboard/user');
  }, [isReady, isAuthenticated, router, user?.role]);

  return null;
}


