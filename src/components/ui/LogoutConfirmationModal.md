# Logout Confirmation Modal

A reusable logout confirmation modal component that provides a consistent user experience across the application.

## Overview

The `LogoutConfirmationModal` component ensures users don't accidentally log out by requiring confirmation before terminating their session. It maintains theme consistency and provides a professional user experience.

## Implementation Locations

The logout confirmation modal has been implemented in the following components:

### 1. DashboardDrawer (`src/components/dashboard/DashboardDrawer.tsx`)
- **Location**: Sidebar logout button
- **Usage**: When user clicks logout in the collapsible sidebar
- **Features**: Shows user info, themed styling

### 2. DashboardHeader (`src/components/dashboard/DashboardHeader.tsx`)
- **Location**: Profile dropdown menu in dashboard header
- **Usage**: When user clicks logout from the profile menu
- **Features**: Shows user info, themed styling

### 3. Main Header (`src/components/layout/Header.tsx`)
- **Location**: Profile dropdown menu in main site header
- **Usage**: When user clicks logout from the main site header
- **Features**: Shows user info, themed styling, redirects to login page

## Component Props

```typescript
interface LogoutConfirmationModalProps {
  open: boolean;                    // Controls modal visibility
  onClose: () => void;             // Called when modal is closed/cancelled
  onConfirm: () => void;           // Called when user confirms logout
  isLoggingOut?: boolean;          // Shows loading state during logout
  user?: {                         // User information to display
    name?: string;
    email?: string;
    avatar?: string;
  };
  title?: string;                  // Modal title (default: "Confirm Logout")
  subtitle?: string;               // Modal subtitle (default: "Are you sure you want to sign out?")
  description?: string;            // Modal description text
  confirmText?: string;            // Confirm button text (default: "Sign Out")
  cancelText?: string;             // Cancel button text (default: "Cancel")
  showUserInfo?: boolean;          // Whether to show user info (default: true)
}
```

## Usage Examples

### Basic Usage
```typescript
<LogoutConfirmationModal
  open={logoutModalOpen}
  onClose={() => setLogoutModalOpen(false)}
  onConfirm={handleLogout}
  isLoggingOut={isLoggingOut}
  user={user}
/>
```

### Custom Text
```typescript
<LogoutConfirmationModal
  open={logoutModalOpen}
  onClose={() => setLogoutModalOpen(false)}
  onConfirm={handleLogout}
  isLoggingOut={isLoggingOut}
  title="Leave Application"
  subtitle="Are you sure you want to leave?"
  description="Your session will be terminated and you'll need to sign in again."
  confirmText="Leave Now"
  cancelText="Stay Logged In"
  showUserInfo={false}
/>
```

## State Management Pattern

Each component using the logout modal follows this pattern:

```typescript
// State for modal
const [logoutModalOpen, setLogoutModalOpen] = useState(false);
const [isLoggingOut, setIsLoggingOut] = useState(false);

// Handler to show modal
const handleLogoutClick = () => {
  setLogoutModalOpen(true);
  // Close any open menus
  handleMenuClose();
};

// Handler to confirm logout
const handleConfirmLogout = async () => {
  try {
    setIsLoggingOut(true);
    logout();
    // Redirect or handle post-logout logic
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
    setIsLoggingOut(false);
  }
};

// Handler to cancel logout
const handleCancelLogout = () => {
  setLogoutModalOpen(false);
  setIsLoggingOut(false);
};
```

## Design Features

### Theme Integration
- **Primary Gradients**: Uses `appGradients.primary(theme)` for header
- **Error Colors**: Uses theme's error colors for logout button
- **Typography**: Consistent with design system
- **Glassmorphism**: Semi-transparent background with blur effect

### Visual Elements
- **Warning Icon**: Clear visual indicator in header
- **User Avatar**: Shows user initials if no avatar provided
- **Loading States**: Spinner and disabled states during logout
- **Hover Effects**: Smooth animations and transitions
- **Professional Shadows**: Layered shadows for depth

### Responsive Design
- **Mobile Friendly**: Works on all screen sizes
- **Touch Targets**: Proper button sizes for mobile
- **Full Width**: Responsive modal width

## Benefits

1. **Consistent UX**: Same logout experience across the app
2. **Accident Prevention**: Prevents accidental logouts
3. **Professional Look**: Maintains design consistency
4. **Easy Maintenance**: Update once, applies everywhere
5. **Flexible**: Customizable for different contexts
6. **Type Safe**: Full TypeScript support
7. **Performance**: Optimized with React.memo

## File Structure

```
src/components/ui/
├── LogoutConfirmationModal.tsx           # Main component
├── LogoutConfirmationModal.example.tsx   # Usage examples
├── LogoutConfirmationModal.md           # This documentation
└── index.ts                             # Export file
```

## Export

```typescript
// From src/components/ui/index.ts
export { default as LogoutConfirmationModal } from './LogoutConfirmationModal';

// Usage anywhere in your app:
import { LogoutConfirmationModal } from '@/components/ui';
```

## Future Enhancements

- Add keyboard shortcuts (Escape to cancel, Enter to confirm)
- Add animation transitions for modal open/close
- Add sound effects for user feedback
- Add analytics tracking for logout events
- Add customizable themes for different contexts
