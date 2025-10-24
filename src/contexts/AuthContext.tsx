'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';

export interface User {
  id?: string;
  name?: string;
  email: string;
  role?: 'user' | 'admin' | 'moderator';
  image?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  isReady: boolean;
  // Optional helpers for future screens
  verifyEmail?: (email: string, code: string) => Promise<boolean>;
  resendVerification?: (email: string) => Promise<boolean>;
  forgotPassword?: (email: string) => Promise<boolean>;
  resetPassword?: (email: string, code: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'authUser';
const AUTH_TOKEN_KEY = 'authToken';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Cookie options for secure token storage
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  const buildHeaders = (base: Record<string, string> = { 'Content-Type': 'application/json' }): HeadersInit => {
    const headers: Record<string, string> = { ...base };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  // Rehydrate user from storage on mount
  useEffect(() => {
    try {
      console.log('AuthContext: Rehydrating user from storage...');
      
      // Try to get user from sessionStorage first (for current session)
      const storedUser = typeof window !== 'undefined' ? sessionStorage.getItem(AUTH_USER_KEY) : null;
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('AuthContext: Found user in sessionStorage:', parsedUser);
        setUser(parsedUser);
      }
      
      // Try to get token from cookies (persists across sessions)
      const cookieToken = Cookies.get(AUTH_TOKEN_KEY);
      if (cookieToken) {
        console.log('AuthContext: Found token in cookies');
        setToken(cookieToken);
        // If we have a token but no user in sessionStorage, try to get user from cookie too
        if (!storedUser) {
          const cookieUser = Cookies.get(AUTH_USER_KEY);
          if (cookieUser) {
            const parsedCookieUser = JSON.parse(cookieUser);
            console.log('AuthContext: Found user in cookies:', parsedCookieUser);
            setUser(parsedCookieUser);
          }
        }
      }
      
      console.log('AuthContext: Final state - user:', user, 'token:', token ? 'present' : 'missing');
    } catch (error) {
      console.error('AuthContext: Error rehydrating user:', error);
    }
    setIsReady(true);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; needsVerification?: boolean }> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        let message = 'Login failed';
        let needsVerification = false;
        try {
          const errData = await res.json();
          if (errData?.message) {
            message = errData.message;
            // Check if the error indicates email verification is needed
            if (errData?.code === 'EMAIL_NOT_VERIFIED' || 
                errData?.message?.toLowerCase().includes('verify') ||
                errData?.message?.toLowerCase().includes('verification')) {
              needsVerification = true;
            }
          }
        } catch {}
        
        return { 
          success: false, 
          error: message,
          needsVerification 
        };
      }

      const data = await res.json().catch(() => ({}));
      const apiUser = data?.user || {};
      const apiToken: string | undefined = data?.token || data?.accessToken;

      console.log('AuthContext: Login response data:', data);
      console.log('AuthContext: API user data:', apiUser);
      console.log('AuthContext: API token:', apiToken ? 'present' : 'missing');

      // Extract user ID from JWT token if not in response
      let userId = apiUser.id || apiUser._id;
      if (!userId && apiToken) {
        try {
          const tokenPayload = JSON.parse(atob(apiToken.split('.')[1]));
          userId = tokenPayload.user?.id;
          console.log('Extracted user ID from JWT token:', userId);
        } catch (error) {
          console.error('Failed to extract user ID from token:', error);
        }
      }

      const normalizedUser: User = {
        id: userId,
        name: apiUser.name,
        email: apiUser.email ?? email,
        role: apiUser.role,
        image: apiUser.image,
        bio: apiUser.bio
      };

      setUser(normalizedUser);
      try {
        if (typeof window !== 'undefined') {
          // Store in sessionStorage for current session
          sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(normalizedUser));
          if (apiToken) {
            setToken(apiToken);
            // Store in cookies for persistence across sessions
            Cookies.set(AUTH_TOKEN_KEY, apiToken, COOKIE_OPTIONS);
            Cookies.set(AUTH_USER_KEY, JSON.stringify(normalizedUser), COOKIE_OPTIONS);
          }
        }
      } catch {
        // ignore storage errors
      }
      return { success: true };
    } catch (e: unknown) {
      // Bubble up error so UI can show specific message
      if (e instanceof Error) throw e;
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      if (typeof window !== 'undefined') {
        // Clear sessionStorage
        sessionStorage.removeItem(AUTH_USER_KEY);
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        // Clear cookies
        Cookies.remove(AUTH_USER_KEY);
        Cookies.remove(AUTH_TOKEN_KEY);
      }
    } catch {}
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ name, email, password })
      });

      if (!res.ok) {
        let errorMessage = 'Registration failed. Please try again.';
        try {
          const errorData = await res.json();
          if (errorData?.message) {
            errorMessage = errorData.message;
          } else if (res.status === 409 || errorData?.code === 'EMAIL_EXISTS') {
            errorMessage = 'This email is already registered. Please use a different email or try signing in.';
          } else if (res.status === 400) {
            errorMessage = 'Invalid registration data. Please check your information and try again.';
          }
        } catch {
          // Use default error message if parsing fails
        }
        return { success: false, error: errorMessage };
      }

      // Many APIs require email verification after signup. We do not auto-login here.
      const data = await res.json().catch(() => ({}));
      const apiUser = data?.user || { name, email };
      const newUser: User = {
        id: apiUser.id,
        name: apiUser.name ?? name,
        email: apiUser.email ?? email,
        role: apiUser.role,
        image: apiUser.image,
        bio: apiUser.bio
      };

      setUser(newUser);
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
        }
      } catch {}
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed. Please try again.' 
      };
    }
  };

  const verifyEmail = async (email: string, code: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-email`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ email, code })
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ email })
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const resendVerification = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/resend-verification`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ email })
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ email, code, newPassword })
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      // Update sessionStorage and cookies
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
          Cookies.set(AUTH_USER_KEY, JSON.stringify(updatedUser), COOKIE_OPTIONS);
        }
      } catch {
        // ignore storage errors
      }
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    register,
    updateUser,
    isAuthenticated: !!user,
    isReady,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
