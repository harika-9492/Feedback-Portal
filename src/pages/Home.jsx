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
      <Container sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Student Feedback & Evaluation System
        </Typography>

        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 720, mx: "auto" }}
        >
          A smarter way to collect, analyze, and improve educational feedback.
        </Typography>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{ maxWidth: 960, mx: "auto" }}
        >
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.86)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(12px)",
                boxShadow: "var(--shadow-1)",
                transition: "0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "var(--shadow-2)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  For Students
                </Typography>
                <Typography color="text.secondary">
                  Submit course feedback, rate instructors, and help improve
                  academic quality.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.86)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(12px)",
                boxShadow: "var(--shadow-1)",
                transition: "0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "var(--shadow-2)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  For Admin / Teachers
                </Typography>
                <Typography color="text.secondary">
                  Create feedback forms, analyze trends, and improve
                  institutional performance.
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
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 5,
              textTransform: "none",
              fontWeight: 600,
              background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
              boxShadow: "0 14px 30px rgba(15, 118, 110, 0.28)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
              },
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>

          <Button
            variant="outlined"
            size="large"
            sx={{
              px: 5,
              textTransform: "none",
              fontWeight: 600,
              borderColor: "rgba(15, 118, 110, 0.5)",
              color: "#0f766e",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              "&:hover": {
                borderColor: "rgba(15, 118, 110, 0.8)",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
            }}
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