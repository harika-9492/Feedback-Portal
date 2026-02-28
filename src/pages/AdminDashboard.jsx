import React, { useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Drawer,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardHeader from "../components/DashboardHeader";
import FormAnalyticsCharts from "../components/analytics/FormAnalyticsCharts";
import { AuthContext } from "../context/AuthContextValue";
import {
  addFacultyUser,
  createFeedbackForm,
  getAnalyticsByForm,
  getFacultyUsers,
  getForms,
  getResponses,
  refreshAnalyticsData,
  removeFacultyUser,
} from "../utils/feedbackData";

const drawerWidth = 240;

const FORM_TEMPLATES = {
  template1: {
    label: "Template 1",
    questions: [
      { question: "Rate the clarity of teaching.", type: "rating", options: [] },
      { question: "Rate pace and coverage of syllabus.", type: "rating", options: [] },
      { question: "Share one suggestion for improvement.", type: "text", options: [] },
    ],
  },
  template2: {
    label: "Template 2",
    questions: [
      { question: "How engaging were the classes?", type: "rating", options: [] },
      {
        question: "How satisfied are you with assignments and evaluations?",
        type: "rating",
        options: [],
      },
      {
        question: "Would you recommend this teaching approach?",
        type: "single_choice",
        options: ["Yes", "No", "Maybe"],
      },
      { question: "Any additional feedback?", type: "text", options: [] },
    ],
  },
};

const cloneTemplateQuestions = (templateKey) =>
  (FORM_TEMPLATES[templateKey]?.questions || []).map((question) => ({
    ...question,
    options: [...(question.options || [])],
  }));

const getFormDisplayLabel = (form) => {
  const legacyLabel = [form.course, form.subject, form.title].filter(Boolean).join(" - ");
  if (legacyLabel) return legacyLabel;
  return [form.course, form.description].filter(Boolean).join(" • ") || `Form ${form.id}`;
};

const createBlankForm = () => ({
  course: "",
  subject: "",
  title: "",
  templateKey: "builtin:template1",
  description: "",
  published: true,
  ratingScaleMax: 5,
  assignedFacultyEmails: [],
  questions: cloneTemplateQuestions("template1"),
});

const createBlankFaculty = () => ({
  name: "",
  email: "",
  department: "",
  password: "Faculty@123",
});

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedSection = location.pathname.split("/")[2] || "dashboard";

  const [forms, setForms] = useState(() => getForms());
  const [responses, setResponses] = useState(() => getResponses());
  const [facultyUsers, setFacultyUsers] = useState(() => getFacultyUsers());
  const [analyticsByForm, setAnalyticsByForm] = useState(() => getAnalyticsByForm());
  const [selectedFormId, setSelectedFormId] = useState("");
  const [newForm, setNewForm] = useState(createBlankForm());
  const [newFaculty, setNewFaculty] = useState(createBlankFaculty());
  const [message, setMessage] = useState({ type: "", text: "" });

  const syncAll = () => {
    setForms(getForms());
    setResponses(getResponses());
    setFacultyUsers(getFacultyUsers());
    setAnalyticsByForm(refreshAnalyticsData());
  };

  const selectedAnalytics = selectedFormId ? analyticsByForm[selectedFormId] : null;

  const totals = useMemo(() => {
    const submissionCount = responses.length;
    const avgOverall = forms.length
      ? (
          forms.reduce((sum, form) => {
            const analytics = analyticsByForm[form.id];
            return sum + (analytics?.overallRating || 0);
          }, 0) / forms.length
        ).toFixed(2)
      : "0.00";

    return {
      forms: forms.length,
      faculty: facultyUsers.length,
      submissions: submissionCount,
      overall: avgOverall,
    };
  }, [forms, facultyUsers, responses, analyticsByForm]);

  const handleQuestionChange = (index, key, value) => {
    setNewForm((prev) => {
      const nextQuestions = [...prev.questions];
      const updatedQuestion = { ...nextQuestions[index], [key]: value };
      if (key === "type" && value !== "single_choice") {
        updatedQuestion.options = [];
      }
      nextQuestions[index] = updatedQuestion;
      return { ...prev, questions: nextQuestions };
    });
  };

  const addQuestion = () => {
    setNewForm((prev) => ({
      ...prev,
      questions: [...prev.questions, { question: "", type: "rating", options: [] }],
    }));
  };

  const removeQuestion = (index) => {
    setNewForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, qIndex) => qIndex !== index),
    }));
  };

  const applyTemplate = (templateKey) => {
    setNewForm((prev) => {
      if (!templateKey) {
        return prev;
      }

      const builtInKey = templateKey.replace("builtin:", "");
      return {
        ...prev,
        templateKey,
        ratingScaleMax: 5,
        questions: cloneTemplateQuestions(builtInKey),
      };
    });
  };

  const handleCreateForm = () => {
    if (!newForm.course.trim()) {
      setMessage({ type: "error", text: "Course is required." });
      return;
    }

    if (!newForm.assignedFacultyEmails.length) {
      setMessage({ type: "error", text: "Assign at least one faculty member." });
      return;
    }

    const hasEmptyQuestion = newForm.questions.some((question) => !question.question.trim());
    if (hasEmptyQuestion) {
      setMessage({ type: "error", text: "Each question needs valid text." });
      return;
    }

    createFeedbackForm({
      ...newForm,
      ratingScaleMax: 5,
      subject: FORM_TEMPLATES[newForm.templateKey.replace("builtin:", "")]?.label || "Template 1",
      title: `${newForm.course.trim()} Feedback`,
      createdBy: user.email,
      questions: newForm.questions.map((question) => ({
        ...question,
        question: question.question.trim(),
        options: (question.options || []).filter(Boolean),
      })),
    });

    setMessage({ type: "success", text: "Form created and assigned successfully." });
    setNewForm(createBlankForm());
    syncAll();
  };

  const handleAddFaculty = () => {
    if (!newFaculty.name.trim() || !newFaculty.email.trim() || !newFaculty.department.trim()) {
      setMessage({ type: "error", text: "Faculty name, email and department are required." });
      return;
    }

    const result = addFacultyUser(newFaculty);
    if (!result.ok) {
      setMessage({ type: "error", text: result.message });
      return;
    }

    setMessage({ type: "success", text: "Faculty account created." });
    setNewFaculty(createBlankFaculty());
    syncAll();
  };

  const renderContent = () => {
    if (selectedSection === "create") {
      return (
        <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
              Create and Assign Feedback Form
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Course"
                  value={newForm.course}
                  onChange={(event) =>
                    setNewForm((prev) => ({ ...prev, course: event.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Select Template</InputLabel>
                  <Select
                    value={newForm.templateKey}
                    label="Select Template"
                    renderValue={(selected) =>
                      selected === "builtin:template2" ? "Template 2" : "Template 1"
                    }
                    onChange={(event) => applyTemplate(event.target.value)}
                  >
                    <MenuItem value="builtin:template1">Template 1</MenuItem>
                    <MenuItem value="builtin:template2">Template 2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Description"
                  value={newForm.description}
                  onChange={(event) =>
                    setNewForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth sx={{ minWidth: { xs: "100%", md: 320 } }}>
                  <InputLabel>Assign Faculty</InputLabel>
                  <Select
                    multiple
                    value={newForm.assignedFacultyEmails}
                    label="Assign Faculty"
                    renderValue={(selected) =>
                      selected.length ? `${selected.length} faculty selected` : "Select faculty"
                    }
                    onChange={(event) =>
                      setNewForm((prev) => ({
                        ...prev,
                        assignedFacultyEmails: event.target.value,
                      }))
                    }
                  >
                    {facultyUsers.map((faculty) => (
                      <MenuItem key={faculty.email} value={faculty.email}>
                        {faculty.name} ({faculty.email})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={2} sx={{ pt: 0.5 }}>
                  {newForm.questions.map((question, index) => (
                    <Card key={`${question.type}-${index}`} variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={7}>
                            <TextField
                              fullWidth
                              label={`Question ${index + 1}`}
                              value={question.question}
                              onChange={(event) =>
                                handleQuestionChange(index, "question", event.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                              <InputLabel>Type</InputLabel>
                              <Select
                                value={question.type}
                                label="Type"
                                onChange={(event) =>
                                  handleQuestionChange(index, "type", event.target.value)
                                }
                              >
                                <MenuItem value="rating">Rating</MenuItem>
                                <MenuItem value="single_choice">Single Choice</MenuItem>
                                <MenuItem value="text">Text</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <Button
                              color="error"
                              fullWidth
                              variant="outlined"
                              onClick={() => removeQuestion(index)}
                              disabled={newForm.questions.length === 1}
                            >
                              Remove
                            </Button>
                          </Grid>

                          {question.type === "single_choice" && (
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Options (comma separated)"
                                value={(question.options || []).join(", ")}
                                onChange={(event) =>
                                  handleQuestionChange(
                                    index,
                                    "options",
                                    event.target.value
                                      .split(",")
                                      .map((item) => item.trim())
                                      .filter(Boolean)
                                  )
                                }
                              />
                            </Grid>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="flex-end">
                  <Button variant="outlined" onClick={addQuestion}>
                    Add Question
                  </Button>
                  <Button variant="contained" onClick={handleCreateForm} sx={{ minWidth: 160 }}>
                    Create Form
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      );
    }

    if (selectedSection === "analytics") {
      return (
        <Stack spacing={3}>
          <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                Form Analytics
              </Typography>
              <FormControl sx={{ minWidth: 320 }}>
                <InputLabel>Select Form</InputLabel>
                <Select
                  value={selectedFormId}
                  label="Select Form"
                  onChange={(event) => setSelectedFormId(event.target.value)}
                >
                  {forms.map((form) => (
                    <MenuItem key={form.id} value={String(form.id)}>
                      {getFormDisplayLabel(form)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          <FormAnalyticsCharts analytics={selectedAnalytics} />
        </Stack>
      );
    }

    if (selectedSection === "faculty") {
      return (
        <Stack spacing={3}>
          <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                Manage Faculty
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={newFaculty.name}
                    onChange={(event) =>
                      setNewFaculty((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={newFaculty.email}
                    onChange={(event) =>
                      setNewFaculty((prev) => ({ ...prev, email: event.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={newFaculty.department}
                    onChange={(event) =>
                      setNewFaculty((prev) => ({ ...prev, department: event.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button fullWidth variant="contained" sx={{ height: "100%" }} onClick={handleAddFaculty}>
                    Add Faculty
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={2}>
            {facultyUsers.map((faculty) => (
              <Grid item xs={12} md={6} key={faculty.email}>
                <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {faculty.name}
                    </Typography>
                    <Typography color="text.secondary">{faculty.email}</Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {faculty.department || "Department not set"}
                    </Typography>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => {
                        removeFacultyUser(faculty.email);
                        setMessage({ type: "success", text: "Faculty removed." });
                        syncAll();
                      }}
                    >
                      Remove Faculty
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      );
    }

    return (
      <Stack spacing={3} sx={{ minHeight: "calc(100vh - 180px)" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)", height: "100%" }}>
              <CardContent>
                <Typography color="text.secondary">Forms</Typography>
                <Typography variant="h3" sx={{ mt: 1, fontWeight: 700 }}>
                  {totals.forms}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)", height: "100%" }}>
              <CardContent>
                <Typography color="text.secondary">Faculty</Typography>
                <Typography variant="h3" sx={{ mt: 1, fontWeight: 700 }}>
                  {totals.faculty}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)", height: "100%" }}>
              <CardContent>
                <Typography color="text.secondary">Submissions</Typography>
                <Typography variant="h3" sx={{ mt: 1, fontWeight: 700 }}>
                  {totals.submissions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)", height: "100%" }}>
              <CardContent>
                <Typography color="text.secondary">Average Overall Rating</Typography>
                <Typography variant="h3" sx={{ mt: 1, fontWeight: 700 }}>
                  {totals.overall}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ flexGrow: 1 }}>
          <Grid item xs={12} lg={7}>
            <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)", height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Recent Forms
                </Typography>
                {forms.length === 0 ? (
                  <Typography color="text.secondary">No forms created yet.</Typography>
                ) : (
                  forms
                    .slice()
                    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                    .slice(0, 6)
                    .map((form) => (
                      <Box
                        key={form.id}
                        sx={{
                          py: 1,
                          borderBottom: "1px solid rgba(148, 163, 184, 0.25)",
                        }}
                      >
                        <Typography sx={{ fontWeight: 600 }}>{form.course}</Typography>
                        <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                          {form.description || form.subject || "Feedback form"}
                        </Typography>
                      </Box>
                    ))
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={5}>
            <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)", height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Faculty Accounts
                </Typography>
                {facultyUsers.length === 0 ? (
                  <Typography color="text.secondary">No faculty accounts available.</Typography>
                ) : (
                  facultyUsers.slice(0, 8).map((faculty) => (
                    <Box
                      key={faculty.email}
                      sx={{
                        py: 1,
                        borderBottom: "1px solid rgba(148, 163, 184, 0.25)",
                      }}
                    >
                      <Typography sx={{ fontWeight: 600 }}>{faculty.name}</Typography>
                      <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                        {faculty.department || "Department not set"}
                      </Typography>
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          "radial-gradient(1200px circle at 10% -10%, rgba(20, 184, 166, 0.18), transparent 55%), radial-gradient(900px circle at 90% 10%, rgba(249, 115, 22, 0.14), transparent 55%), linear-gradient(135deg, #f8fafc 0%, #ecfeff 55%, #fff7ed 100%)",
        marginTop: "64px",
      }}
    >
      <DashboardHeader />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #f8fafc 0%, #ecfeff 100%)",
            borderRight: "1px solid rgba(15, 118, 110, 0.2)",
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem disablePadding>
            <ListItemButton selected={selectedSection === "dashboard"} onClick={() => navigate("/admin")}> 
              <ListItemText primary="Overview" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton selected={selectedSection === "create"} onClick={() => navigate("/admin/create")}> 
              <ListItemText primary="Create Forms" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton selected={selectedSection === "analytics"} onClick={() => navigate("/admin/analytics")}> 
              <ListItemText primary="Analytics" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton selected={selectedSection === "faculty"} onClick={() => navigate("/admin/faculty")}> 
              <ListItemText primary="Manage Faculty" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 3, md: 4 } }}>
        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
