# Dashboard Components

This directory contains reusable dashboard components for the user dashboard interface.

## Components

### DashboardCard
A flexible card component for displaying information with optional icons, gradients, and click handlers.

**Props:**
- `title`: Card title (required)
- `value`: Main value to display
- `subtitle`: Subtitle text
- `icon`: React icon component
- `gradient`: Color gradient variant ('primary', 'secondary', 'success', 'info', 'warning', 'error')
- `onClick`: Click handler function
- `children`: Custom content
- `elevation`: Material-UI elevation level
- `sx`: Custom styles

### QuickActionButton
A button component for quick actions with icons and labels.

**Props:**
- `icon`: React icon component (required)
- `label`: Button label (required)
- `onClick`: Click handler (required)
- `variant`: Button variant ('primary', 'secondary', 'outlined')
- `disabled`: Disabled state
- `sx`: Custom styles

### ActivityItem
A component for displaying activity feed items with timestamps and status indicators.

**Props:**
- `id`: Unique identifier (required)
- `type`: Activity type ('login', 'profile_update', 'order', 'message', 'system')
- `title`: Activity title (required)
- `description`: Activity description (required)
- `timestamp`: Activity timestamp (required)
- `user`: User information object
- `status`: Status indicator ('success', 'warning', 'error', 'info')

### StatsOverview
A component that displays user statistics in a grid layout.

**Props:**
- `userStats`: Object containing user statistics
  - `totalOrders`: Number of total orders
  - `totalSpent`: Total amount spent
  - `loyaltyPoints`: Available loyalty points
  - `notifications`: Number of unread notifications

### QuickActions
A grid of quick action buttons for common user tasks.

**Props:**
- `onActionClick`: Callback function for action clicks

### RecentActivity
A component that displays recent user activities.

**Props:**
- `activities`: Array of activity objects
- `maxItems`: Maximum number of items to display (default: 5)

### UserProfileSummary
A component that displays user profile information with edit options.

**Props:**
- `onEditProfile`: Callback function for edit profile action

### DashboardLayout
A complete layout component that wraps the dashboard with drawer and header.

**Props:**
- `children`: Dashboard content (required)
- `title`: Page title for header
- `currentPath`: Current route path for navigation highlighting

### DashboardDrawer
A collapsible sidebar navigation drawer with user profile and navigation items.

**Props:**
- `open`: Whether drawer is open (required)
- `onClose`: Callback for closing drawer (required)
- `onToggle`: Callback for toggling drawer (required)
- `currentPath`: Current route path for active state

### DashboardHeader
A header component with menu toggle, notifications, and user profile menu.

**Props:**
- `onMenuClick`: Callback for menu button click (required)
- `title`: Page title to display

## Usage

```tsx
import { 
  DashboardCard, 
  QuickActionButton, 
  StatsOverview,
  QuickActions,
  RecentActivity,
  UserProfileSummary,
  DashboardLayout,
  DashboardDrawer,
  DashboardHeader
} from '@/components/dashboard';

// Use the complete layout
<DashboardLayout title="User Dashboard" currentPath="/dashboard/user">
  <StatsOverview userStats={{ totalOrders: 12, totalSpent: 1250 }} />
  <QuickActions onActionClick={(action) => console.log(action)} />
</DashboardLayout>

// Or use individual components
<DashboardDrawer 
  open={drawerOpen} 
  onClose={handleClose} 
  onToggle={handleToggle}
  currentPath="/dashboard/user"
/>
```

## Performance Features

- All components are wrapped with `React.memo` for optimal re-rendering
- Arrays and objects are memoized with `useMemo` where appropriate
- Components use proper TypeScript interfaces for type safety
- Responsive design with Material-UI Grid system and CSS Grid

## Drawer Features

The drawer system includes:
- **Collapsible Sidebar**: Toggle between expanded and collapsed states
- **Responsive Design**: Mobile drawer (temporary) vs desktop permanent
- **User Profile Section**: Shows user avatar, name, and email
- **Navigation Items**: Dashboard, Profile, Orders, History, Wishlist, Notifications
- **Settings Section**: Payment, Settings, Security, Support
- **Active State Highlighting**: Current page is highlighted
- **Smooth Animations**: Transitions for drawer open/close
- **Logout Functionality**: Integrated logout with confirmation

## Theme Integration

All components integrate with the existing theme system:
- Uses theme colors and gradients from `@/theme/colors`
- Responsive to theme changes
- Consistent with the app's design system
- Purple (#D27AE6) and yellow color scheme maintained
