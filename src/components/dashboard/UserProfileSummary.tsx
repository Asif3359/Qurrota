"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Button, Chip, useTheme } from "@mui/material";
import DashboardCard from "./DashboardCard";
import { Edit, Verified } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/contexts/AuthContext";
import { getAuthToken } from "@/components/profile/profile";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface UserProfileSummaryProps {
  onEditProfile?: () => void;
}

const UserProfileSummary: React.FC<UserProfileSummaryProps> = React.memo(
  ({ onEditProfile }) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [userData, setUserData] = useState<User | null>(null);
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();
    useEffect(() => {
      fetchProfile();
    }, [user]);

    // API Functions
    const fetchProfile = async () => {
      try {
        const token = getAuthToken();

        // Debug logging
        console.log("🔍 Debug Info:");
        console.log("Token exists:", !!token);
        console.log("Token length:", token?.length);
        console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
        console.log(
          "Full URL:",
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile`
        );
        console.log("Token sources checked:");
        console.log("- localStorage token:", !!localStorage.getItem("token"));
        console.log("- cookie token:", !!Cookies.get("authToken"));
        console.log(
          "- sessionStorage token:",
          !!sessionStorage.getItem("authToken")
        );

        if (!token) {
          throw new Error(
            "No authentication token found. Please log in again."
          );
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("📡 Response Status:", response.status);
        console.log(
          "📡 Response Headers:",
          Object.fromEntries(response.headers.entries())
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Error Response:", errorText);

          if (response.status === 403) {
            throw new Error(
              "Access forbidden. Please check your authentication token."
            );
          } else if (response.status === 401) {
            throw new Error("Unauthorized. Please log in again.");
          } else {
            throw new Error(
              `Failed to fetch profile: ${response.status} ${response.statusText}`
            );
          }
        }

        const data = await response.json();
        setUserData(data.user);
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
      } finally {
        console.log(userData);
      }
    };

    const handleEditProfile = () => {
      if (onEditProfile) {
        onEditProfile();
      } else {
        router.push("/dashboard/user/profile");
      }
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

    return (
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: { xs: 2, sm: 3 },
            color: theme.palette.text.primary,
            fontSize: { xs: "1.3rem", sm: "1.4rem", md: "1.5rem" },
            letterSpacing: "-0.02em",
          }}
        >
          Profile Summary
        </Typography>
        <DashboardCard
          title="Profile Summary"
          sx={{
            p: 0,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 2, sm: 2.5, md: 3 },
                mb: { xs: 2, sm: 2.5, md: 3 },
                flexDirection: { xs: "column", sm: "row" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Avatar
                src={userData?.image}
                sx={{
                  width: { xs: 70, sm: 80, md: 90 },
                  height: { xs: 70, sm: 80, md: 90 },
                  fontSize: { xs: "1.8rem", sm: "2rem", md: "2.2rem" },
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  border: `4px solid ${theme.palette.primary.light}`,
                  boxShadow: "0 4px 20px rgba(210, 122, 230, 0.3)",
                }}
              >
                {getInitials(userData?.name)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1.5,
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.4rem" },
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {userData?.name || "User"}
                  </Typography>
                  <Verified
                    sx={{
                      color: theme.palette.success.main,
                      fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.4rem" },
                      filter: "drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3))",
                    }}
                  />
                </Box>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                    fontWeight: 500,
                    textAlign: { xs: "center", sm: "left" },
                    wordBreak: "break-word",
                  }}
                >
                  {userData?.email}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >
                  <Chip
                    label={userData?.role || "user"}
                    size="small"
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      color: "white",
                      fontWeight: 600,
                      textTransform: "capitalize",
                      fontSize: { xs: "0.75rem", sm: "0.8rem" },
                      height: { xs: 24, sm: 28 },
                      boxShadow: "0 2px 8px rgba(210, 122, 230, 0.3)",
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2, mt: 2 }}>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                      fontWeight: 500,
                    }}
                  >
                    {userData?.bio || "No bio"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: { xs: 1.5, sm: 2 },
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEditProfile}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  borderRadius: 2,
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  boxShadow: "0 4px 16px rgba(210, 122, 230, 0.4)",
                  minWidth: { xs: "auto", sm: "140px" },
                  "&:hover": {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(210, 122, 230, 0.5)",
                  },
                }}
              >
                Edit Profile
              </Button>
            </Box>
          </Box>
        </DashboardCard>
      </Box>
    );
  }
);

UserProfileSummary.displayName = "UserProfileSummary";

export default UserProfileSummary;
