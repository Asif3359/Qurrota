"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  Tabs,
  Tab,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from "js-cookie";
import {
  Save,
  PhotoCamera,
  Visibility,
  VisibilityOff,
  Delete,
  CheckCircle,
} from "@mui/icons-material";

interface ProfileData {
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  bio: string;
  image: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Helper function to get token from the same source as AuthContext
export const getAuthToken = () => {
  // Try cookies (primary source used by AuthContext)
  const cookieToken = Cookies.get("authToken");
  if (cookieToken) return cookieToken;

  // Try sessionStorage (current session)
  const sessionToken = sessionStorage.getItem("authToken");
  if (sessionToken) return sessionToken;

  return null;
};

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const { updateUser } = useAuth();

  // State management
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    bio: "",
    image: "",
    role: "",
    isVerified: false,
    isActive: false,
    createdAt: "",
    updatedAt: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Delete account state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Image upload state
  const [imageUploading, setImageUploading] = useState(false);

  // Helper function to format date for HTML date input (YYYY-MM-DD format)
  const formatDateForInput = (
    dateString: string | null | undefined
  ): string => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      // Format as YYYY-MM-DD for HTML date input
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.warn("Error formatting date:", error);
      return "";
    }
  };

  // Helper function to normalize user data and prevent controlled/uncontrolled input warnings
  const normalizeUserData = (
    userData: Partial<ProfileData> | null | undefined
  ): ProfileData => {
    return {
      name: userData?.name || "",
      email: userData?.email || "",
      phoneNumber: userData?.phoneNumber || "",
      dateOfBirth: formatDateForInput(userData?.dateOfBirth),
      bio: userData?.bio || "",
      image: userData?.image || "",
      role: userData?.role || "",
      isVerified: userData?.isVerified || false,
      isActive: userData?.isActive || false,
      createdAt: userData?.createdAt || "",
      updatedAt: userData?.updatedAt || "",
    };
  };

  // API Functions
  const fetchProfile = async () => {
    try {
      setLoading(true);
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
        throw new Error("No authentication token found. Please log in again.");
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
      console.log("✅ Profile Data:", data);
      console.log("📅 Raw dateOfBirth from API:", data.user?.dateOfBirth);
      console.log(
        "📅 Formatted dateOfBirth:",
        formatDateForInput(data.user?.dateOfBirth)
      );

      // Normalize user data to prevent controlled/uncontrolled input warnings
      const normalizedData = normalizeUserData(data.user);
      setProfileData(normalizedData);
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load profile data"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      setError(null);

      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profileData.name,
            phoneNumber: profileData.phoneNumber,
            dateOfBirth: profileData.dateOfBirth,
            bio: profileData.bio,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await response.json();

      // Normalize user data to prevent controlled/uncontrolled input warnings
      const normalizedData = normalizeUserData(data.user);
      setProfileData(normalizedData);
      updateUser(data.user);
      setSuccess("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async () => {
    try {
      setSaving(true);
      setError(null);

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error("New passwords do not match");
      }

      if (passwordData.newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters long");
      }

      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update password");
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccess("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update password"
      );
    } finally {
      setSaving(false);
    }
  };

  const uploadProfileImage = async (file: File) => {
    try {
      setImageUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("image", file);

      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/image`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image");
      }

      const data = await response.json();

      // Normalize user data to prevent controlled/uncontrolled input warnings
      const normalizedData = normalizeUserData(data.user);
      setProfileData(normalizedData);
      updateUser(data.user);
      setSuccess("Profile image updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setImageUploading(false);
    }
  };

  const deleteAccount = async () => {
    try {
      setDeleting(true);
      setError(null);

      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: deletePassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete account");
      }

      // Redirect to home page after successful deletion
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete account"
      );
    } finally {
      setDeleting(false);
    }
  };

  // Load profile data on component mount
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      // No token found, redirect to login
      window.location.href = "/login";
      return;
    }
    fetchProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle file input change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadProfileImage(file);
    }
  };

  // Handle form input changes
  const handleInputChange =
    (field: keyof ProfileData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setProfileData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handlePasswordChange =
    (field: keyof typeof passwordData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "200px",
          background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
          zIndex: 0,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          py: { xs: 3, sm: 4, md: 5, lg: 6 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            {/* Profile Header */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: { xs: "flex-start", sm: "center" },
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 2, sm: 2 },
                  mb: 3,
                }}
              >
                <Box sx={{ position: "relative", px: 1, mt: 1 }}>
                  <Avatar
                    src={profileData.image}
                    sx={{
                      width: { xs: 70, sm: 100 },
                      height: { xs: 70, sm: 100 },
                      bgcolor: theme.palette.primary.main,
                      fontSize: { xs: "2rem", sm: "2.5rem" },
                      border: `4px solid ${theme.palette.primary.light}`,
                      boxShadow: "0 4px 20px rgba(210, 122, 230, 0.3)",
                    }}
                  >
                    {profileData.name?.charAt(0) || "U"}
                  </Avatar>
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: { xs: 30, sm: 40 },
                      height: { xs: 30, sm: 40 },
                      bgcolor: theme.palette.primary.main,
                      color: "white",
                      "&:hover": {
                        bgcolor: theme.palette.primary.dark,
                      },
                    }}
                    component="label"
                    disabled={imageUploading}
                  >
                    {imageUploading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <PhotoCamera />
                    )}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </IconButton>
                </Box>
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        px: { xs: 1, sm: 1 },
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        fontSize: { xs: "1.25rem", sm: "2rem" },
                      }}
                    >
                      {profileData.name || "Your Profile"}
                    </Typography>
                    {profileData.isVerified && (
                      <CheckCircle sx={{ color: theme.palette.success.main }} />
                    )}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", px: { xs: 1, sm: 1 } }}>
                    <Chip
                      label={profileData.role || "user"}
                      size="small"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        color: "white",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    />
                    <Chip
                      label={profileData.isActive ? "Active" : "Inactive"}
                      size="small"
                      color={profileData.isActive ? "success" : "default"}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 0.75,
                      px: { xs: 1, sm: 1 },
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      fontWeight: 400,
                      wordBreak: "break-word",
                    }}
                  >
                    {profileData.email || "Not signed in"}
                  </Typography>
                </Box>
              </Box>

              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: "divider" , width: "100%" }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="profile tabs"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Profile" />
                  <Tab label="Security" />
                  <Tab label="Account" />
                </Tabs>
              </Box>
            </Box>

            {/* Tab Panels */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ px: { xs: 3, md: 4 } }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "1fr 1fr",
                    },
                    gap: 3,
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Personal Information
                    </Typography>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={profileData.name}
                      onChange={handleInputChange("name")}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Email Address"
                      value={profileData.email}
                      variant="outlined"
                      disabled
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={profileData.phoneNumber}
                      onChange={handleInputChange("phoneNumber")}
                      placeholder="Enter your phone number"
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={handleInputChange("dateOfBirth")}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      helperText={
                        !profileData.dateOfBirth
                          ? "Select your date of birth"
                          : ""
                      }
                    />
                  </Box>

                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Additional Information
                    </Typography>
                    <TextField
                      fullWidth
                      label="Bio"
                      value={profileData.bio}
                      onChange={handleInputChange("bio")}
                      multiline
                      rows={4}
                      placeholder="Tell us about yourself..."
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Member Since"
                      value={
                        profileData.createdAt
                          ? new Date(profileData.createdAt).toLocaleDateString()
                          : "N/A"
                      }
                      variant="outlined"
                      disabled
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Last Updated"
                      value={
                        profileData.updatedAt
                          ? new Date(profileData.updatedAt).toLocaleDateString()
                          : "N/A"
                      }
                      variant="outlined"
                      disabled
                    />
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mt: 4,
                    flexWrap: "wrap",
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={
                      saving ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <Save />
                      )
                    }
                    onClick={updateProfile}
                    disabled={saving}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "0.9rem",
                      boxShadow: "0 4px 16px rgba(210, 122, 230, 0.4)",
                      "&:hover": {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(210, 122, 230, 0.5)",
                      },
                    }}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ px: { xs: 3, md: 4 } }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Change Password
                </Typography>
                <Box sx={{ maxWidth: 400 }}>
                  <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>Current Password</InputLabel>
                    <OutlinedInput
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange("currentPassword")}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility("current")}
                            edge="end"
                          >
                            {showPasswords.current ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Current Password"
                    />
                  </FormControl>
                  <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>New Password</InputLabel>
                    <OutlinedInput
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange("newPassword")}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility("new")}
                            edge="end"
                          >
                            {showPasswords.new ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="New Password"
                    />
                  </FormControl>
                  <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
                    <InputLabel>Confirm New Password</InputLabel>
                    <OutlinedInput
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange("confirmPassword")}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility("confirm")}
                            edge="end"
                          >
                            {showPasswords.confirm ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm New Password"
                    />
                  </FormControl>
                  <Button
                    variant="contained"
                    startIcon={
                      saving ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <Save />
                      )
                    }
                    onClick={updatePassword}
                    disabled={
                      saving ||
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword
                    }
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "0.9rem",
                      boxShadow: "0 4px 16px rgba(210, 122, 230, 0.4)",
                      "&:hover": {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(210, 122, 230, 0.5)",
                      },
                    }}
                  >
                    {saving ? "Updating..." : "Update Password"}
                  </Button>
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ px: { xs: 3, md: 4 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: theme.palette.error.main,
                  }}
                >
                  Danger Zone
                </Typography>
                <Box
                  sx={{
                    p: 3,
                    border: `2px solid ${theme.palette.error.light}`,
                    borderRadius: 2,
                    bgcolor: theme.palette.error.light + "10",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ mb: 1, color: theme.palette.error.main }}
                  >
                    Delete Account
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => setDeleteDialogOpen(true)}
                    sx={{
                      borderWidth: 2,
                      "&:hover": {
                        borderWidth: 2,
                        bgcolor: theme.palette.error.main,
                        color: "white",
                      },
                    }}
                  >
                    Delete Account
                  </Button>
                </Box>
              </Box>
            </TabPanel>
          </Paper>
        </motion.div>
      </Container>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: theme.palette.error.main }}>
          Delete Account
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            All your data will be permanently removed from our servers.
          </Typography>
          <TextField
            fullWidth
            label="Enter your password to confirm"
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={deleteAccount}
            color="error"
            variant="contained"
            disabled={deleting || !deletePassword}
            startIcon={
              deleting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Delete />
              )
            }
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccess(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;
