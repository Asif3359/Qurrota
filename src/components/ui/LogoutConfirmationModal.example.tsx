/**
 * Example usage of LogoutConfirmationModal component
 * This file demonstrates different ways to use the reusable modal
 */

import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import LogoutConfirmationModal from './LogoutConfirmationModal';

// Example 1: Basic usage with default props
export const BasicLogoutExample: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Simulate logout process
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('User logged out');
    setModalOpen(false);
    setIsLoggingOut(false);
  };

  return (
    <Box>
      <Button onClick={() => setModalOpen(true)}>
        Logout (Basic)
      </Button>
      
      <LogoutConfirmationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
        user={{
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://example.com/avatar.jpg'
        }}
      />
    </Box>
  );
};

// Example 2: Custom text and no user info
export const CustomLogoutExample: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Simulate logout process
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Custom logout completed');
    setModalOpen(false);
    setIsLoggingOut(false);
  };

  return (
    <Box>
      <Button onClick={() => setModalOpen(true)}>
        Custom Logout
      </Button>
      
      <LogoutConfirmationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
        title="Leave Application"
        subtitle="Are you sure you want to leave?"
        description="Your session will be terminated and you'll need to sign in again to access your account."
        confirmText="Leave Now"
        cancelText="Stay Logged In"
        showUserInfo={false}
      />
    </Box>
  );
};

// Example 3: Minimal usage (no user info, default text)
export const MinimalLogoutExample: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Simulate logout process
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Minimal logout completed');
    setModalOpen(false);
    setIsLoggingOut(false);
  };

  return (
    <Box>
      <Button onClick={() => setModalOpen(true)}>
        Minimal Logout
      </Button>
      
      <LogoutConfirmationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
        showUserInfo={false}
      />
    </Box>
  );
};
