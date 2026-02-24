import React, { useContext, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Grid,
  Card,
  CardContent,
  TextField,
  Divider,
  Stack,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Rating,
  Chip,
  Alert,
} from "@mui/material";
import { AuthContext } from "../context/AuthContextValue";

const drawerWidth = 220;
const demoFormKeys = new Set([
  "Math 101::Dr. Sharma",
  "Physics 201::Prof. Kumar",
  "CS 220::Ms. Iyer",
  "English 102::Dr. Patel",
  "Chemistry 110::Dr. Rao",
  "Economics 205::Prof. Singh",
  "Data Structures::Ms. Nair",
  "Operating Systems::Dr. Fernandes",
]);

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [forms] = useState(() => {
    const storedForms = JSON.parse(localStorage.getItem("forms")) || [];

    const cleanedForms = storedForms.filter((form) => {
      const key = `${form.course}::${form.instructor}`;
      if (form.facultyEmail) return true;
      return !demoFormKeys.has(key);
    });

    if (cleanedForms.length !== storedForms.length) {
      localStorage.setItem("forms", JSON.stringify(cleanedForms));
    }

    return cleanedForms;
  });
  const [responses, setResponses] = useState(
    () => JSON.parse(localStorage.getItem("responses")) || []
  );
  const [currentForm, setCurrentForm] = useState(null);
  const [answers, setAnswers] = useState({
    rating: 0,
    issues: [],
    suggestion: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = () => {
    if (!answers.rating || answers.issues.length === 0) {
      setMessage({
        type: "error",
        text: "Please provide a rating and select at least one issue.",
      });
      return;
    }

    const newResponse = {
      formId: currentForm.id,
      student: null,
      submittedBy: user.email,
      answers: {
        rating: answers.rating,
        issues: answers.issues,
        suggestion: answers.suggestion,
      },
      date: new Date().toLocaleString(),
    };

    const updatedResponses = [...responses, newResponse];
    localStorage.setItem("responses", JSON.stringify(updatedResponses));
    setResponses(updatedResponses);

    setCurrentForm(null);
    setAnswers({
      rating: 0,
      issues: [],
      suggestion: "",
    });
    setMessage({ type: "success", text: "Feedback submitted successfully!" });
  };

  const alreadySubmitted = (formId) => {
    return responses.some(
      (r) => r.formId === formId && r.submittedBy === user.email
    );
  };

  const getFormLabel = (formId) => {
    const form = forms.find((f) => f.id === formId);
    return form ? `${form.course} - ${form.instructor}` : `Form ${formId}`;
  };

  const getAggregates = (formId) => {
    const formResponses = responses.filter((r) => r.formId === formId);
    const ratingValues = formResponses
      .map((r) => r.answers?.rating)
      .filter((v) => typeof v === "number" && v > 0);

    const averageRating = ratingValues.length
      ? (
          ratingValues.reduce((sum, v) => sum + v, 0) /
          ratingValues.length
        ).toFixed(1)
      : "N/A";

    const issueCounts = formResponses.reduce((acc, r) => {
      const issues = r.answers?.issues || [];
      issues.forEach((issue) => {
        acc[issue] = (acc[issue] || 0) + 1;
      });
      return acc;
    }, {});

    return {
      total: formResponses.length,
      averageRating,
      issueCounts,
    };
  };

  const renderContent = () => {
    if (selectedSection === "dashboard") {
      const courseList = forms.map((form) => form.course);
      const myResponses = responses.filter(
        (r) => r.submittedBy === user.email
      );
      const submittedIds = new Set(myResponses.map((r) => r.formId));
      const totalForms = forms.length;
      const submittedCount = submittedIds.size;
      const pendingCount = Math.max(totalForms - submittedCount, 0);
      return (
        <>
          <Typography variant="h4" gutterBottom>
            Welcome, {user.email}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Select a section from the sidebar to begin.
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>
                    Total Feedback Forms
                  </Typography>
                  <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                    {totalForms}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)",
                  boxShadow: "0 10px 30px rgba(0, 212, 255, 0.3)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>
                    Submitted By You
                  </Typography>
                  <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                    {submittedCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
                  boxShadow: "0 10px 30px rgba(249, 115, 22, 0.3)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>
                    Pending For You
                  </Typography>
                  <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                    {pendingCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
              boxShadow: "0 10px 30px rgba(6, 182, 212, 0.25)",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "white", fontWeight: 600 }}>
                My Courses
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {courseList.length === 0 ? (
                  <Typography sx={{ color: "rgba(255,255,255,0.8)" }}>
                    No courses available yet.
                  </Typography>
                ) : (
                  courseList.map((course) => (
                    <Chip key={course} label={course} sx={{ mb: 1, background: "rgba(255,255,255,0.25)", color: "white" }} />
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
              boxShadow: "0 10px 30px rgba(139, 92, 246, 0.25)",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "white", fontWeight: 600 }}>
                Feedback Guidance
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>
                Short, specific feedback helps the most. Use the multiple-choice
                and rating fields so results stay consistent and easy to analyze.
              </Typography>
            </CardContent>
          </Card>
        </>
      );
    }

    if (selectedSection === "forms") {
      const submittedCount = forms.filter((form) => alreadySubmitted(form.id)).length;
      const pendingCount = Math.max(forms.length - submittedCount, 0);
      return (
        <>
          <Typography variant="h4" gutterBottom>
            Available Feedback Forms
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Choose a course to submit concise, structured feedback.
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  boxShadow: "0 10px 30px rgba(79, 70, 229, 0.3)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>Total Forms</Typography>
                  <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>{forms.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>Submitted</Typography>
                  <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>{submittedCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
                  boxShadow: "0 10px 30px rgba(236, 72, 153, 0.3)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>Pending</Typography>
                  <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>{pendingCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {forms.map((form) => (
              <Grid key={form.id} item xs={12} md={6}>
                <Card
                  sx={{
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                    border: "1px solid rgba(30, 144, 255, 0.2)",
                    boxShadow: "0 8px 25px rgba(30, 144, 255, 0.12)",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "#0f766e", fontWeight: 700 }}>
                      {form.course}
                    </Typography>
                    <Typography sx={{ color: "#475569", mb: 0.5 }}>
                      Instructor: {form.instructor}
                    </Typography>
                    <Typography sx={{ color: "#64748b", mt: 1 }}>
                      Includes rating, multiple-choice, and one short suggestion.
                    </Typography>

                    {alreadySubmitted(form.id) ? (
                      <Chip
                        label="Submitted"
                        color="success"
                        size="small"
                        sx={{ mt: 2 }}
                      />
                    ) : (
                      <Button
                        variant="contained"
                        sx={{
                          mt: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          background:
                            "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
                          boxShadow:
                            "0 14px 30px rgba(15, 118, 110, 0.28)",
                        }}
                        onClick={() => {
                          setCurrentForm(form);
                          setMessage({ type: "", text: "" });
                          setAnswers({
                            rating: 0,
                            issues: [],
                            suggestion: "",
                          });
                        }}
                      >
                        Fill Form
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      );
    }

    if (selectedSection === "submissions") {
      const myResponses = responses.filter(
        (r) => r.submittedBy === user.email
      );
      const lastSubmission = myResponses.length
        ? myResponses[myResponses.length - 1]
        : null;
      const submittedCourses = new Set(
        myResponses.map((r) => getFormLabel(r.formId))
      );

      return (
        <>
          <Typography variant="h4" gutterBottom>
            My Submissions
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Track what you have already submitted. Content remains anonymous.
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
                  boxShadow: "0 10px 30px rgba(15, 118, 110, 0.3)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>Total Submissions</Typography>
                  <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>{myResponses.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                  boxShadow: "0 10px 30px rgba(6, 182, 212, 0.3)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>Courses Covered</Typography>
                  <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>{submittedCourses.size}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
                  boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>Last Submission</Typography>
                  <Typography variant="body1" sx={{ mt: 1, color: "white", fontWeight: 600 }}>
                    {lastSubmission ? lastSubmission.date : "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {myResponses.length === 0 ? (
            <Typography>No submissions yet.</Typography>
          ) : (
            myResponses.map((r, index) => (
              <Card
                key={index}
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)",
                  border: "1px solid rgba(251, 146, 60, 0.2)",
                  boxShadow: "0 8px 25px rgba(251, 146, 60, 0.12)",
                  "&:hover": {
                    boxShadow: "0 12px 35px rgba(251, 146, 60, 0.18)",
                  },
                }}
              >
                <CardContent>
                  <Typography sx={{ color: "#7c2d12", fontWeight: 600 }}>
                    {getFormLabel(r.formId)}
                  </Typography>
                  <Typography sx={{ color: "#92400e", mt: 1 }}>
                    Submitted on: {r.date}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </>
      );
    }

    if (selectedSection === "results") {
      const totalResponses = responses.length;
      const overallRatings = responses
        .map((r) => r.answers?.rating)
        .filter((v) => typeof v === "number" && v > 0);
      const overallAverage = overallRatings.length
        ? (overallRatings.reduce((sum, v) => sum + v, 0) / overallRatings.length).toFixed(1)
        : "N/A";
      const issueCounts = responses.reduce((acc, r) => {
        const issues = r.answers?.issues || [];
        issues.forEach((issue) => {
          acc[issue] = (acc[issue] || 0) + 1;
        });
        return acc;
      }, {});
      const topIssues = Object.entries(issueCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
      return (
        <>
          <Typography variant="h4" gutterBottom>
            Aggregated Results
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Results are shown in summary form only. Individual comments are not
            displayed.
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>Total Responses</Typography>
                  <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>{totalResponses}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
                  boxShadow: "0 10px 30px rgba(244, 63, 94, 0.3)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>Overall Avg Rating</Typography>
                  <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>{overallAverage}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                  boxShadow: "0 10px 30px rgba(20, 184, 166, 0.3)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>Top Issues</Typography>
                  {topIssues.length === 0 ? (
                    <Typography variant="body1" sx={{ mt: 1, color: "white", fontWeight: 600 }}>
                      N/A
                    </Typography>
                  ) : (
                    <Stack spacing={0.5} sx={{ mt: 1 }}>
                      {topIssues.map(([issue, count]) => (
                        <Typography key={issue} sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem" }}>
                          {issue}: {count}
                        </Typography>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {forms.map((form) => {
              const aggregates = getAggregates(form.id);
              const issues = Object.entries(aggregates.issueCounts);
              return (
                <Grid key={form.id} item xs={12} md={6}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      background: "linear-gradient(135deg, #f8fafc 0%, #ecfdf5 100%)",
                      border: "2px solid rgba(16, 185, 129, 0.2)",
                      boxShadow: "0 12px 35px rgba(16, 185, 129, 0.15)",
                      "&:hover": {
                        boxShadow: "0 16px 45px rgba(16, 185, 129, 0.25)",
                        transform: "translateY(-4px)",
                        transition: "all 0.3s ease",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h5" sx={{ color: "#0f766e", fontWeight: 800, mb: 0.5 }}>
                        {form.course}
                      </Typography>
                      <Typography sx={{ color: "#0d9488", mb: 2, fontSize: "0.95rem", fontWeight: 500 }}>
                        👨‍🏫 {form.instructor}
                      </Typography>

                      <Stack direction="row" spacing={2} sx={{ mb: 3, gap: 1.5 }}>
                        <Box
                          sx={{
                            flex: 1,
                            background: "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)",
                            padding: "12px 14px",
                            borderRadius: 2,
                            textAlign: "center",
                          }}
                        >
                          <Typography sx={{ color: "#7f1d1d", fontSize: "0.8rem", fontWeight: 600, mb: 0.3 }}>
                            Avg Rating
                          </Typography>
                          <Typography sx={{ color: "#991b1b", fontWeight: 800, fontSize: "1.3rem" }}>
                            {aggregates.averageRating}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            flex: 1,
                            background: "linear-gradient(135deg, #a5f3fc 0%, #67e8f9 100%)",
                            padding: "12px 14px",
                            borderRadius: 2,
                            textAlign: "center",
                          }}
                        >
                          <Typography sx={{ color: "#164e63", fontSize: "0.8rem", fontWeight: 600, mb: 0.3 }}>
                            Submissions
                          </Typography>
                          <Typography sx={{ color: "#0c4a6e", fontWeight: 800, fontSize: "1.3rem" }}>
                            {aggregates.total}
                          </Typography>
                        </Box>
                      </Stack>

                      <Divider sx={{ mb: 2, borderColor: "rgba(15, 118, 110, 0.15)" }} />

                      <Typography variant="subtitle2" sx={{ color: "#0f766e", fontWeight: 700, mb: 1.2 }}>
                        📊 Top Issues
                      </Typography>
                      {issues.length === 0 ? (
                        <Box
                          sx={{
                            background: "rgba(15, 118, 110, 0.05)",
                            padding: "10px",
                            borderRadius: 1.5,
                            border: "1px solid rgba(15, 118, 110, 0.1)",
                          }}
                        >
                          <Typography sx={{ color: "#0f766e", fontSize: "0.9rem" }}>
                            ✓ No issues reported
                          </Typography>
                        </Box>
                      ) : (
                        <Stack spacing={0.8}>
                          {issues.map(([issue, count]) => (
                            <Box
                              key={issue}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                background: "rgba(15, 118, 110, 0.06)",
                                padding: "8px 12px",
                                borderRadius: 1.5,
                                border: "1px solid rgba(15, 118, 110, 0.12)",
                              }}
                            >
                              <Typography sx={{ color: "#0d9488", fontWeight: 500, fontSize: "0.95rem" }}>
                                {issue}
                              </Typography>
                              <Box
                                sx={{
                                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                  color: "white",
                                  padding: "2px 10px",
                                  borderRadius: "20px",
                                  fontSize: "0.85rem",
                                  fontWeight: 700,
                                }}
                              >
                                {count}
                              </Box>
                            </Box>
                          ))}
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </>
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          "radial-gradient(1200px circle at 10% -10%, rgba(20, 184, 166, 0.18), transparent 55%), radial-gradient(900px circle at 90% 10%, rgba(249, 115, 22, 0.14), transparent 55%), linear-gradient(135deg, #f8fafc 0%, #ecfeff 55%, #fff7ed 100%)",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
          boxShadow: "0 12px 24px rgba(15, 118, 110, 0.25)",
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Student Dashboard
          </Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #ecfdf5 0%, #cffafe 100%)",
            borderRight: "2px solid rgba(15, 118, 110, 0.25)",
            boxShadow: "2px 0 15px rgba(15, 118, 110, 0.15)",
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setSelectedSection("dashboard")}
            >
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setSelectedSection("forms")}
            >
              <ListItemText primary="Available Forms" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setSelectedSection("submissions")}
            >
              <ListItemText primary="My Submissions" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => setSelectedSection("results")}>
              <ListItemText primary="Aggregated Results" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 3, md: 4 },
          minHeight: "100vh",
        }}
      >
        <Toolbar />

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        {currentForm ? (
          <>
            <Typography variant="h4" gutterBottom>
              {currentForm.course} Feedback
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Instructor: {currentForm.instructor}
            </Typography>

            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                boxShadow: "0 8px 25px rgba(139, 92, 246, 0.12)",
              }}
            >
              <CardContent>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend" sx={{ mb: 1, color: "#581c87" }}>
                    The instructor explains concepts clearly (1-5)
                  </FormLabel>
                  <Rating
                    name="rating"
                    value={answers.rating}
                    onChange={(_, value) =>
                      setAnswers({
                        ...answers,
                        rating: value || 0,
                      })
                    }
                  />
                </FormControl>
              </CardContent>
            </Card>

            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, #fef2f2 0%, #fce7f3 100%)",
                border: "1px solid rgba(236, 72, 153, 0.2)",
                boxShadow: "0 8px 25px rgba(236, 72, 153, 0.12)",
              }}
            >
              <CardContent>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend" sx={{ mb: 1, color: "#831843" }}>
                    What should improve?
                  </FormLabel>
                  <Stack>
                    {[
                      "More real-world examples",
                      "Clearer assignments",
                      "Improve pacing",
                      "Better doubt support",
                      "No issues",
                    ].map((option) => (
                      <FormControlLabel
                        key={option}
                        control={
                          <Checkbox
                            checked={answers.issues.includes(option)}
                            onChange={(e) => {
                              const nextIssues = e.target.checked
                                ? [...answers.issues, option]
                                : answers.issues.filter(
                                    (value) => value !== option
                                  );
                              setAnswers({
                                ...answers,
                                issues: nextIssues,
                              });
                            }}
                          />
                        }
                        label={option}
                      />
                    ))}
                  </Stack>
                </FormControl>
              </CardContent>
            </Card>

            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                border: "1px solid rgba(34, 197, 94, 0.2)",
                boxShadow: "0 8px 25px rgba(34, 197, 94, 0.12)",
              }}
            >
              <CardContent>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="One suggestion (optional)"
                  placeholder="Keep it short and specific"
                  value={answers.suggestion}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      suggestion: e.target.value,
                    })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#15803d",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#15803d",
                      opacity: 0.7,
                    },
                  }}
                />
              </CardContent>
            </Card>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Submissions are anonymous by default. Your identity is hidden from
              instructors and reports.
            </Typography>

            <Button
              variant="contained"
              sx={{
                mt: 2,
                textTransform: "none",
                fontWeight: 600,
                background:
                  "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
                boxShadow: "0 14px 30px rgba(15, 118, 110, 0.28)",
              }}
              onClick={handleSubmit}
            >
              Submit Feedback
            </Button>

            <Button
              sx={{ mt: 2, ml: 2 }}
              onClick={() => setCurrentForm(null)}
            >
              Cancel
            </Button>
          </>
        ) : (
          renderContent()
        )}
      </Box>
    </Box>
  );
};

export default StudentDashboard;