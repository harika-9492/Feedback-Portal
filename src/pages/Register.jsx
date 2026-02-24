import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  MenuItem,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [registerNo, setRegisterNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState({ type: "", text: "" });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleRegister = () => {
    if (!name || !email || !registerNo || !password || !confirmPassword) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }

    // Email validation
    if (!emailRegex.test(email)) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    const emailDomain = email.trim().toLowerCase().split("@")[1];
    const validDomains = ["gmail.com", "yahoo.com", "outlook.com", "kluniversity.in", "klu.ac.in"];
    
    if (!validDomains.includes(emailDomain)) {
      setMessage({
        type: "error",
        text: `Email must be from a valid domain (e.g., ${validDomains.join(", ")}).`,
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Password and Confirm Password do not match.",
      });
      return;
    }

    // Detailed password validation
    const passwordIssues = [];
    if (password.length < 8) {
      passwordIssues.push("at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      passwordIssues.push("1 uppercase letter");
    }
    if (!/\d/.test(password)) {
      passwordIssues.push("1 number");
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      passwordIssues.push("1 special character");
    }

    if (passwordIssues.length > 0) {
      setMessage({
        type: "error",
        text: `Password is missing: ${passwordIssues.join(", ")}.`,
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() ||
        (u.registerNo && u.registerNo === registerNo.trim())
    );
    if (existingUser) {
      setMessage({
        type: "error",
        text: "User already exists with this email or register number.",
      });
      return;
    }

    const newUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      registerNo: registerNo.trim(),
      password,
      role,
    };
    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
    setMessage({
      type: "success",
      text: "Registered successfully! Redirecting to login...",
    });

    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  return (
    <Box
      className="page-fade"
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(1200px circle at 10% -10%, rgba(20, 184, 166, 0.22), transparent 55%), radial-gradient(900px circle at 90% 10%, rgba(249, 115, 22, 0.2), transparent 55%), linear-gradient(135deg, #f8fafc 0%, #ecfeff 55%, #fff7ed 100%)",
        "&:before": {
          content: '""',
          position: "absolute",
          top: -120,
          right: -120,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(14, 116, 144, 0.15)",
          filter: "blur(2px)",
        },
        "&:after": {
          content: '""',
          position: "absolute",
          bottom: -140,
          left: -120,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "rgba(249, 115, 22, 0.16)",
          filter: "blur(2px)",
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5,
          width: { xs: "92vw", sm: 420 },
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.7)",
          boxShadow: "var(--shadow-2)",
          position: "relative",
          zIndex: 1,
          backdropFilter: "blur(14px)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        >
          Register
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ mt: 1, mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Name"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          fullWidth
          type="email"
          label="Mail ID"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Register No"
          margin="normal"
          value={registerNo}
          onChange={(e) => setRegisterNo(e.target.value)}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="Min 8 chars, 1 uppercase, 1 number, 1 special character"
        />

        <TextField
          fullWidth
          type="password"
          label="Confirm Password"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <TextField
          select
          fullWidth
          label="Role"
          margin="normal"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="faculty">Faculty</MenuItem>
        </TextField>

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            textTransform: "none",
            fontWeight: 600,
            background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
            boxShadow: "0 14px 30px rgba(15, 118, 110, 0.28)",
            "&:hover": {
              background:
                "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
            },
          }}
          onClick={handleRegister}
        >
          Register
        </Button>

        <Button
          fullWidth
          variant="text"
          sx={{
            mt: 1,
            textTransform: "none",
            fontWeight: 600,
            color: "#0f766e",
          }}
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Register;