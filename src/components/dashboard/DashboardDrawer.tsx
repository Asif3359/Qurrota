"use client";

import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import {
  Dashboard,
  Person,
  ShoppingCart,
  Favorite,
  Support,
  Logout,
  AdminPanelSettings,
  Inventory2,
  History,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { appGradients } from "@/theme/colors";
import LogoutConfirmationModal from "@/components/ui/LogoutConfirmationModal";
import { useRouter } from "next/navigation";

interface DashboardDrawerProps {
  open: boolean;
  onClose: () => void;
  onToggle: () => void;
  currentPath?: string;
}

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 64;

const DashboardDrawer: React.FC<DashboardDrawerProps> = React.memo(
  ({ open, onClose, onToggle, currentPath = "/dashboard/user" }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { user, logout } = useAuth();
    const router = useRouter();
    
    // Logout confirmation modal state
    const [logoutModalOpen, setLogoutModalOpen] = React.useState(false);
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);

    const roleBasePath = user?.role === 'admin'
      ? '/dashboard/admin'
      : user?.role === 'moderator'
        ? '/dashboard/moderator'
        : '/dashboard/user';

    const isUser = user?.role === 'user';
    const isAdmin = user?.role === 'admin';
    const isModerator = user?.role === 'moderator';

    const navigationItems = [
      {
        label: "Dashboard",
        icon: <Dashboard />,
        path: roleBasePath,
        active: currentPath === roleBasePath,
      },
      ...(
        isAdmin
          ? [
              {
                label: "Profile",
                icon: <Person />,
                path: `${roleBasePath}/profile`,
                active: currentPath === `${roleBasePath}/profile`,
              },
              {
                label: "Product",
                icon: <Inventory2 />,
                path: `${roleBasePath}/product`,
                active: currentPath === `${roleBasePath}/product`,
              },
              {
                label: "Order",
                icon: <History />,
                path: `${roleBasePath}/orders`,
                active: currentPath === `${roleBasePath}/orders`,
              }
            ]
          : []
      ),
      ...(
        isUser
          ? [
              {
                label: "Profile",
                icon: <Person />,
                path: `${roleBasePath}/profile`,
                active: currentPath === `${roleBasePath}/profile`,
              },
              {
                label: "Orders",
                icon: <ShoppingCart />,
                path: `${roleBasePath}/orders`,
                active: currentPath === `${roleBasePath}/orders`,
              },
              // {
              //   label: "Wishlist",
              //   icon: <Favorite />,
              //   path: `${roleBasePath}/wishlist`,
              //   active: currentPath === `${roleBasePath}/wishlist`,
              // },
              {
                label: "Cart",
                icon: <ShoppingCart />,
                path: `${roleBasePath}/cart`,
                active: currentPath === `${roleBasePath}/cart`,
              },
            ]
          : []
      ),
    ];

    const settingsItems = [
      ...(
        isUser
          ? [
              {
                label: "Support",
                icon: <Support />,
                // path: `${roleBasePath}/support`,
                // active: currentPath === `${roleBasePath}/support`,
                path: "/contact",
                active: currentPath === "/contact",
              },
            ]
          : []
      ),
    ];

    const handleNavigation = (path: string) => {
      if (path.startsWith("/")) {
        router.push(path);
      }
      if (isMobile) {
        onClose();
      }
    };

    const handleLogoutClick = () => {
      setLogoutModalOpen(true);
    };

    const handleConfirmLogout = async () => {
      try {
        setIsLoggingOut(true);
        logout();
        router.push("/login");
      } catch (error) {
        console.error('Logout error:', error);
        setIsLoggingOut(false);
      }
    };

    const handleCancelLogout = () => {
      setLogoutModalOpen(false);
      setIsLoggingOut(false);
    };

    const getInitials = (name?: string) => {
      if (!name) return "U";
      return name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

     const drawerContent = (
       <Box
         sx={{
           height: "100%",
           display: "flex",
           flexDirection: "column",
           overflow: "hidden",
           mt: 8,
         }}
       >
         {/* Header */}
         <Box
           sx={{
             p: open ? 2 : 2,
             background: appGradients.primary(theme),
             color: "white",
             display: "flex",
             alignItems: "center",
             justifyContent: open ? "space-between" : "center",
             minHeight: open ? 80 : 80,
           }}
         >
           {open && (
             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
               <Avatar
                 src={user?.image}
                 sx={{
                   width: 40,
                   height: 40,
                   backgroundColor: "rgba(255, 255, 255, 0.2)",
                   border: "2px solid rgba(255, 255, 255, 0.3)",
                 }}
               >
                 {getInitials(user?.name)}
               </Avatar>
               <Box>
                 <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                   {user?.name || "User"}
                 </Typography>
                 <Typography variant="caption" sx={{ opacity: 0.8 }}>
                   {user?.email}
                 </Typography>
               </Box>
             </Box>
           )}
           {!open && (
             <Avatar
               src={user?.image}
               sx={{
                 width: 40,
                 height: 40,
                 backgroundColor: "rgba(255, 255, 255, 0.2)",
                 border: "2px solid rgba(255, 255, 255, 0.3)",
                 cursor: "pointer",
                 "&:hover": {
                   backgroundColor: "rgba(255, 255, 255, 0.3)",
                 },
               }}
               onClick={onToggle}
             >
               {getInitials(user?.name)}
             </Avatar>
           )}
         </Box>

         {/* Navigation Items */}
         <Box sx={{ flex: 1, overflow: "hidden" }}>
           <List sx={{ px: open ? 1 : 0, py: 2 }}>
             {navigationItems.map((item, index) => (
               <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                 <ListItemButton
                   onClick={() => handleNavigation(item.path)}
                   sx={{
                     borderRadius: 2,
                     backgroundColor: item.active
                       ? theme.palette.primary.main
                       : "transparent",
                     color: item.active ? "white" : theme.palette.text.primary,
                     "&:hover": {
                       backgroundColor: item.active
                         ? theme.palette.primary.dark
                         : theme.palette.action.hover,
                     },
                     minHeight: 48,
                     px: open ? 2 : 0,
                     justifyContent: open ? "flex-start" : "center",
                     width: "100%",
                   }}
                 >
                   <ListItemIcon
                     sx={{
                       color: item.active
                         ? "white"
                         : theme.palette.text.secondary,
                       minWidth: open ? 40 : "auto",
                       justifyContent: "center",
                       display: "flex",
                     }}
                   >
                     {item.icon}
                   </ListItemIcon>
                   {open && (
                     <ListItemText
                       primary={item.label}
                       sx={{
                         "& .MuiListItemText-primary": {
                           fontWeight: item.active ? 600 : 400,
                           fontSize: "0.9rem",
                         },
                       }}
                     />
                   )}
                 </ListItemButton>
               </ListItem>
             ))}
           </List>

          <Divider sx={{ mx: open ? 2 : 1, my: 1 }} />

          <List sx={{ px: open ? 1 : 0, py: 1 }}>
            {settingsItems.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: item.active
                      ? theme.palette.primary.main
                      : "transparent",
                    color: item.active ? "white" : theme.palette.text.primary,
                    "&:hover": {
                      backgroundColor: item.active
                        ? theme.palette.primary.dark
                        : theme.palette.action.hover,
                    },
                    minHeight: 48,
                    px: open ? 2 : 0,
                    justifyContent: open ? "flex-start" : "center",
                    width: "100%",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: item.active
                        ? "white"
                        : theme.palette.text.secondary,
                      minWidth: open ? 40 : "auto",
                      justifyContent: "center",
                      display: "flex",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.label}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontWeight: item.active ? 600 : 400,
                          fontSize: "0.9rem",
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Logout Button */}
        <Box sx={{ p: open ? 2 : 1, borderTop: `1px solid ${theme.palette.divider}` }}>
          <ListItemButton
            onClick={handleLogoutClick}
            sx={{
              borderRadius: 2,
              color: theme.palette.error.main,
              "&:hover": {
                backgroundColor: theme.palette.error.light,
                color: "white",
              },
              minHeight: 48,
              px: open ? 2 : 0,
              justifyContent: open ? "flex-start" : "center",
              width: "100%",
            }}
          >
            <ListItemIcon
              sx={{
                color: "inherit",
                minWidth: open ? 40 : "auto",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Logout />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Logout"
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  },
                }}
              />
            )}
          </ListItemButton>
        </Box>
      </Box>
    );

    return (
      <>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={open}
          onClose={onClose}
          sx={{
            width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
              boxSizing: "border-box",
              borderRight: `1px solid ${theme.palette.divider}`,
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: "hidden",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Logout Confirmation Modal */}
        <LogoutConfirmationModal
          open={logoutModalOpen}
          onClose={handleCancelLogout}
          onConfirm={handleConfirmLogout}
          isLoggingOut={isLoggingOut}
          user={user ? {
            name: user.name,
            email: user.email,
            image: user.image
          } : undefined}
        />
      </>
    );
  }
);

DashboardDrawer.displayName = "DashboardDrawer";

export default DashboardDrawer;
