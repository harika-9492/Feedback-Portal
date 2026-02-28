import React from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <Box
      className="page-fade"
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(1200px circle at 10% -10%, rgba(20, 184, 166, 0.22), transparent 55%), radial-gradient(900px circle at 90% 10%, rgba(249, 115, 22, 0.2), transparent 55%), linear-gradient(135deg, #f8fafc 0%, #ecfeff 55%, #fff7ed 100%)",
        display: "flex",
        alignItems: "center",
        py: { xs: 6, md: 10 },
      }}
    >
      <Container>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Student Feedback & Evaluation System
        </Typography>

        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Select your role to continue
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {/* Student */}
          <Grid item xs={12} md={4}>
            <Card
              onClick={() => handleRoleClick("student")}
              sx={{
                p: 3,
                borderRadius: 3,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight={700}>
                  Student
                </Typography>
                <Typography color="text.secondary">
                  Submit feedback and rate instructors.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Teacher */}
          <Grid item xs={12} md={4}>
            <Card
              onClick={() => handleRoleClick("teacher")}
              sx={{
                p: 3,
                borderRadius: 3,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight={700}>
                  Teacher
                </Typography>
                <Typography color="text.secondary">
                  View feedback and analyze course performance.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Admin */}
          <Grid item xs={12} md={4}>
            <Card
              onClick={() => handleRoleClick("admin")}
              sx={{
                p: 3,
                borderRadius: 3,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight={700}>
                  Admin
                </Typography>
                <Typography color="text.secondary">
                  Manage users, forms, and institutional analytics.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 6,
            display: "flex",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;