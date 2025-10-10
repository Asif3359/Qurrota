'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/dashboard';

interface UserDashboardLayoutProps {
  children: React.ReactNode;
}

export default function UserDashboardLayout({ children }: UserDashboardLayoutProps) {
  const { isAuthenticated, user, isReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (user?.role !== 'user') {
      router.replace('/dashboard');
    }
  }, [isReady, isAuthenticated, user?.role, router]);

  // Show loading state while checking authentication
  if (!isReady) {
    return null;
  }

  // Don't render if not authenticated or wrong role
  if (!isAuthenticated || user?.role !== 'user') {
    return null;
  }

  // Determine the title based on the current path
  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard/user':
        return 'User Dashboard';
      case '/dashboard/user/profile':
        return 'Profile Settings';
      case '/dashboard/user/cart':
        return 'Cart';
      default:
        return 'User Dashboard';
    }
  };

  return (
    <DashboardLayout title={getPageTitle()} currentPath={pathname}>
      {children}
    </DashboardLayout>
  );
}
