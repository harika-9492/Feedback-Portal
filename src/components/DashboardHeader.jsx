import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
} from "@mui/material";
import { AuthContext } from "../context/AuthContextValue";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    setProfileOpen(true);
    handleMenuClose();
  };

  const handleProfileClose = () => {
    setProfileOpen(false);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  const getInitials = (email) => {
    return email.substring(0, 2).toUpperCase();
  };

  const getRoleColor = (role) => {
    if (role === "admin") return "warning";
    if (role === "faculty") return "primary";
    return "success";
  };

  const getRoleLabel = (role) => {
    if (role === "admin") return "Admin";
    if (role === "faculty") return "Faculty";
    return "Student";
  };

  return (
    <>
      <AppBar position="fixed" sx={{ background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)", zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            📝 Student Feedback System
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              onClick={handleMenuOpen}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                textTransform: "none",
                color: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: "rgba(255,255,255,0.3)",
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                }}
              >
                {getInitials(user?.email || "")}
              </Avatar>
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="body2" sx={{ lineHeight: 1 }}>
                  {user?.email}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9, lineHeight: 1 }}>
                  {getRoleLabel(user?.role)}
                </Typography>
              </Box>
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleProfileClick} sx={{ minWidth: 200 }}>
                👤 View Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                🚪 Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog open={profileOpen} onClose={handleProfileClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)", color: "white" }}>
          User Profile
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  backgroundColor: "#14b8a6",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                {getInitials(user?.email || "")}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {user?.email}
                </Typography>
                <Chip
                  label={getRoleLabel(user?.role)}
                  color={getRoleColor(user?.role)}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>

            <Divider />

            {user?.name && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "text.secondary" }}>
                  Name
                </Typography>
                <Typography variant="body2">{user.name}</Typography>
              </Box>
            )}

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "text.secondary" }}>
                Email
              </Typography>
              <Typography variant="body2">{user?.email}</Typography>
            </Box>

            {user?.registerNo && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "text.secondary" }}>
                  Register No.
                </Typography>
                <Typography variant="body2">{user.registerNo}</Typography>
              </Box>
            )}

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "text.secondary" }}>
                Role
              </Typography>
              <Typography variant="body2">
                {getRoleLabel(user?.role)} {user?.role === "faculty" ? "👨‍🏫" : user?.role === "admin" ? "🛠️" : "👨‍🎓"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "text.secondary" }}>
                Status
              </Typography>
              <Chip label="Active" color="success" size="small" />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProfileClose} variant="contained" sx={{ textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DashboardHeader;
