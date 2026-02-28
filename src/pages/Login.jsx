import React, { useState, useContext } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Link,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextValue";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      setMessage({ type: "error", text: "Invalid credentials" });
      return;
    }

    setMessage({ type: "", text: "" });

    login({
      role: foundUser.role,
      email: foundUser.email,
      name: foundUser.name,
      registerNo: foundUser.registerNo,
      department: foundUser.department || "",
    });

    if (foundUser.role === "admin") {
      navigate("/admin");
    } else if (foundUser.role === "faculty") {
      navigate("/faculty");
    } else {
      navigate("/student");
    }
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
          Login
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ mt: 1, mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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
          onClick={handleLogin}
        >
          Login
        </Button>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Demo Credentials (Faculty 1)</Typography>
          <Typography variant="body2">Email: faculty1@college.edu</Typography>
          <Typography variant="body2">Password: Faculty@123</Typography>
        </Alert>

        <Typography align="center" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Link
            component="button"
            onClick={() => navigate("/register")}
            sx={{ fontWeight: 600, color: "#0f766e" }}
          >
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;