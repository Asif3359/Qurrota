'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/dashboard';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const { isAuthenticated, user, isReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (user?.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [isReady, isAuthenticated, user?.role, router]);

  if (!isReady) {
    return null;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard/admin':
        return 'Admin Dashboard';
      default:
        return 'Admin Dashboard';
    }
  };

  return (
    <DashboardLayout title={getPageTitle()} currentPath={pathname}>
      {children}
    </DashboardLayout>
  );
}


