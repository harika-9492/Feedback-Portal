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

    // Save user session
    login(
      foundUser.role,
      foundUser.email,
      foundUser.name,
      foundUser.registerNo
    );

    // Redirect based on role
    if (foundUser.role === "admin") {
      navigate("/admin");
    } else if (foundUser.role === "teacher") {
      navigate("/teacher");
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
        background:
          "linear-gradient(135deg, #f8fafc 0%, #ecfeff 55%, #fff7ed 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5,
          width: { xs: "92vw", sm: 420 },
          borderRadius: 4,
          boxShadow: "0 14px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
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
          sx={{ mt: 3, textTransform: "none", fontWeight: 600 }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Typography align="center" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Link
            component="button"
            onClick={() => navigate("/register")}
            sx={{ fontWeight: 600 }}
          >
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;