import React, { useContext, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Select,
  MenuItem,
  Paper,
  Chip,
  Divider,
  Alert,
  Stack,
} from "@mui/material";
import { AuthContext } from "../context/AuthContextValue";
import DashboardInsights from "../components/faculty/DashboardInsights";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

const drawerWidth = 240;
const chartColors = ["#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

const templates = [
  {
    name: "Teaching Quality Template",
    description: "Balanced set for delivery quality and clarity.",
    questions: [
      { question: "Clarity of explanation", type: "rating", options: [] },
      {
        question: "Lecture pace",
        type: "single_choice",
        options: ["Too fast", "Appropriate", "Too slow"],
      },
      {
        question: "Was the instructor approachable?",
        type: "single_choice",
        options: ["Yes", "No"],
      },
      { question: "Suggestions for improvement", type: "text", options: [] },
    ],
  },
  {
    name: "Course Structure Template",
    description: "Checks syllabus, assessments, and relevance.",
    questions: [
      { question: "Course content relevance", type: "rating", options: [] },
      {
        question: "Was syllabus well organized?",
        type: "single_choice",
        options: ["Yes", "Partly", "No"],
      },
      { question: "Difficulty level", type: "rating", options: [] },
      { question: "Additional comments", type: "text", options: [] },
    ],
  },
];

const createBlankForm = () => ({
  course: "",
  instructor: "",
  description: "",
  published: false,
  questions: [
    {
      question: "",
      type: "text",
      options: [],
    },
  ],
});

const FacultyDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current section from URL path
  const pathParts = location.pathname.split("/");
  const selectedSection = pathParts[2] || "dashboard";
  
  const [forms, setForms] = useState(() => {
    const storedForms = JSON.parse(localStorage.getItem("forms")) || [];
    return storedForms.filter((form) => form.facultyEmail === user.email);
  });
  const [responses, setResponses] = useState(
    () => JSON.parse(localStorage.getItem("responses")) || []
  );
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [newForm, setNewForm] = useState(createBlankForm());
  const [message, setMessage] = useState({ type: "", text: "" });
  const [pendingDeleteFormId, setPendingDeleteFormId] = useState(null);

  const refreshData = () => {
    const storedForms = JSON.parse(localStorage.getItem("forms")) || [];
    const storedResponses = JSON.parse(localStorage.getItem("responses")) || [];

    setForms(storedForms.filter((f) => f.facultyEmail === user.email));
    setResponses(storedResponses);
  };

  const handleTemplateSelect = (templateName) => {
    const template = templates.find((t) => t.name === templateName);
    if (!template) return;

    setSelectedTemplate(templateName);
    setNewForm((prev) => ({
      ...prev,
      description: template.description,
      questions: template.questions.map((q) => ({
        question: q.question,
        type: q.type,
        options: Array.isArray(q.options) ? [...q.options] : [],
      })),
    }));
  };

  const addQuestion = () => {
    setNewForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: "", type: "text", options: [] },
      ],
    }));
  };

  const updateQuestion = (index, key, value) => {
    setNewForm((prev) => {
      const updatedQuestions = [...prev.questions];
      const nextQuestion = { ...updatedQuestions[index], [key]: value };

      if (key === "type" && value !== "single_choice") {
        nextQuestion.options = [];
      }

      updatedQuestions[index] = nextQuestion;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const removeQuestion = (index) => {
    setNewForm((prev) => {
      if (prev.questions.length === 1) return prev;

      return {
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index),
      };
    });
  };

  const addOption = (questionIndex) => {
    setNewForm((prev) => {
      const updatedQuestions = [...prev.questions];
      const currentOptions = updatedQuestions[questionIndex].options || [];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: [...currentOptions, ""],
      };

      return { ...prev, questions: updatedQuestions };
    });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setNewForm((prev) => {
      const updatedQuestions = [...prev.questions];
      const updatedOptions = [...(updatedQuestions[questionIndex].options || [])];
      updatedOptions[optionIndex] = value;

      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: updatedOptions,
      };

      return { ...prev, questions: updatedQuestions };
    });
  };

  const removeOption = (questionIndex, optionIndex) => {
    setNewForm((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: (updatedQuestions[questionIndex].options || []).filter(
          (_, idx) => idx !== optionIndex
        ),
      };

      return { ...prev, questions: updatedQuestions };
    });
  };

  const isFormValid = (formPayload) => {
    if (!formPayload.course.trim() || !formPayload.instructor.trim()) {
      return "Course and instructor are required.";
    }

    const hasInvalidQuestion = formPayload.questions.some(
      (q) => !q.question.trim()
    );
    if (hasInvalidQuestion) {
      return "Each question must have text.";
    }

    const hasInvalidOptions = formPayload.questions.some((q) => {
      if (q.type !== "single_choice") return false;
      const cleaned = (q.options || []).map((opt) => opt.trim()).filter(Boolean);
      return cleaned.length < 2;
    });

    if (hasInvalidOptions) {
      return "Single-choice questions need at least 2 options.";
    }

    return "";
  };

  const handleSaveForm = ({ publishNow = false } = {}) => {
    const normalizedQuestions = newForm.questions.map((q) => ({
      question: q.question.trim(),
      type: q.type,
      options:
        q.type === "single_choice"
          ? (q.options || []).map((opt) => opt.trim()).filter(Boolean)
          : [],
    }));

    const formPayload = {
      ...newForm,
      course: newForm.course.trim(),
      instructor: newForm.instructor.trim(),
      description: newForm.description.trim(),
      questions: normalizedQuestions,
    };

    const validationMessage = isFormValid(formPayload);
    if (validationMessage) {
      setMessage({ type: "error", text: validationMessage });
      return;
    }

    const storedForms = JSON.parse(localStorage.getItem("forms")) || [];

    const updatedForm = {
      ...formPayload,
      published: publishNow ? true : formPayload.published,
      facultyEmail: user.email,
    };

    const updatedForms = [
      ...storedForms,
      {
        ...updatedForm,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem("forms", JSON.stringify(updatedForms));
    refreshData();

    setMessage({
      type: "success",
      text: publishNow
        ? "Form created and sent to students."
        : "Form saved successfully.",
    });

    setSelectedTemplate("");
    setNewForm(createBlankForm());
  };

  const handleDeleteForm = (formId) => {
    const storedForms = JSON.parse(localStorage.getItem("forms")) || [];
    const storedResponses = JSON.parse(localStorage.getItem("responses")) || [];

    const updatedForms = storedForms.filter((form) => form.id !== formId);
    const updatedResponses = storedResponses.filter(
      (response) => response.formId !== formId
    );

    localStorage.setItem("forms", JSON.stringify(updatedForms));
    localStorage.setItem("responses", JSON.stringify(updatedResponses));

    setMessage({ type: "success", text: "Form deleted successfully." });
    setPendingDeleteFormId(null);
    refreshData();
  };

  const formStats = useMemo(() => {
    const totalForms = forms.length;
    const publishedForms = forms.filter((form) => form.published).length;

    const allResponses = responses.filter((response) =>
      forms.some((form) => form.id === response.formId)
    );

    const ratings = allResponses
      .map((response) => response.answers?.rating)
      .filter((value) => typeof value === "number" && value > 0);

    const averageRating = ratings.length
      ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1)
      : "N/A";

    const lowResponseForms = forms.filter((form) => {
      const total = responses.filter((response) => response.formId === form.id).length;
      return total < 3;
    }).length;

    return {
      totalForms,
      publishedForms,
      totalResponses: allResponses.length,
      averageRating,
      lowResponseForms,
    };
  }, [forms, responses]);

  const facultyResponses = useMemo(() => {
    return responses.filter((response) => forms.some((form) => form.id === response.formId));
  }, [forms, responses]);

  const responsesByFormData = useMemo(() => {
    return forms
      .map((form) => {
        const total = responses.filter((response) => response.formId === form.id).length;
        return {
          name: form.course.length > 14 ? `${form.course.slice(0, 14)}...` : form.course,
          responses: total,
        };
      })
      .slice(0, 8);
  }, [forms, responses]);

  const publishStatusData = useMemo(() => {
    const draftForms = Math.max(formStats.totalForms - formStats.publishedForms, 0);
    return [
      { name: "Sent", value: formStats.publishedForms },
      { name: "Draft", value: draftForms },
    ].filter((item) => item.value > 0);
  }, [formStats.totalForms, formStats.publishedForms]);

  const issueData = useMemo(() => {
    const counts = facultyResponses.reduce((acc, response) => {
      const issues = response.answers?.issues || [];
      if (!Array.isArray(issues)) return acc;

      issues.forEach((issue) => {
        if (!issue) return;
        acc[issue] = (acc[issue] || 0) + 1;
      });
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [facultyResponses]);

  const recentSuggestions = useMemo(() => {
    return facultyResponses
      .map((response) => response.answers?.suggestion)
      .filter((item) => typeof item === "string" && item.trim().length > 0)
      .slice(-5)
      .reverse();
  }, [facultyResponses]);

  const renderInsights = () => (
    <DashboardInsights
      user={user}
      message={message}
      formStats={formStats}
      responsesByFormData={responsesByFormData}
      publishStatusData={publishStatusData}
      issueData={issueData}
      recentSuggestions={recentSuggestions}
    />
  );

  const renderCreateForm = () => {
    return (
      <>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Create Form
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Choose a template, customize it, add your own options, and send to students.
        </Typography>

        {message.text && selectedSection === "create-form" && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <TextField
                fullWidth
                label="Course Name"
                margin="normal"
                value={newForm.course}
                onChange={(e) =>
                  setNewForm((prev) => ({ ...prev, course: e.target.value }))
                }
              />

              <TextField
                fullWidth
                label="Instructor"
                margin="normal"
                value={newForm.instructor}
                onChange={(e) =>
                  setNewForm((prev) => ({ ...prev, instructor: e.target.value }))
                }
              />

              <TextField
                fullWidth
                label="Short Description"
                margin="normal"
                value={newForm.description}
                onChange={(e) =>
                  setNewForm((prev) => ({ ...prev, description: e.target.value }))
                }
              />

              <Select
                fullWidth
                value={selectedTemplate}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                displayEmpty
                sx={{ mt: 2 }}
              >
                <MenuItem value="">Select Template</MenuItem>
                {templates.map((template) => (
                  <MenuItem key={template.name} value={template.name}>
                    {template.name}
                  </MenuItem>
                ))}
              </Select>

              <Typography variant="h6" sx={{ mt: 3 }}>
                Questions
              </Typography>

              {newForm.questions.map((questionItem, questionIndex) => (
                <Paper
                  key={questionIndex}
                  sx={{ p: 2, mt: 2, borderRadius: 2, backgroundColor: "#f8fafc" }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 7 }}>
                      <TextField
                        fullWidth
                        label={`Question ${questionIndex + 1}`}
                        value={questionItem.question}
                        onChange={(e) =>
                          updateQuestion(questionIndex, "question", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <Select
                        fullWidth
                        value={questionItem.type}
                        onChange={(e) =>
                          updateQuestion(questionIndex, "type", e.target.value)
                        }
                      >
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="rating">Rating</MenuItem>
                        <MenuItem value="single_choice">Single Choice</MenuItem>
                      </Select>
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <Button fullWidth color="error" onClick={() => removeQuestion(questionIndex)}>
                        Remove
                      </Button>
                    </Grid>
                  </Grid>

                  {questionItem.type === "single_choice" && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Options
                      </Typography>

                      {(questionItem.options || []).map((option, optionIndex) => (
                        <Box
                          key={optionIndex}
                          sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            label={`Option ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) =>
                              updateOption(questionIndex, optionIndex, e.target.value)
                            }
                          />
                          <Button
                            color="error"
                            onClick={() => removeOption(questionIndex, optionIndex)}
                          >
                            Remove
                          </Button>
                        </Box>
                      ))}

                      <Button size="small" onClick={() => addOption(questionIndex)}>
                        Add Option
                      </Button>
                    </Box>
                  )}
                </Paper>
              ))}

              <Button sx={{ mt: 2 }} onClick={addQuestion}>
                Add Question
              </Button>

              <Box sx={{ mt: 3, display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                <Button variant="outlined" onClick={() => handleSaveForm({ publishNow: false })}>
                  Save Draft
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleSaveForm({ publishNow: true })}
                >
                  Create & Send
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  };

  const renderYourForms = () => {
    return (
      <>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Your Forms
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          View all created forms and track their response status.
        </Typography>

        {forms.length === 0 ? (
          <Typography color="text.secondary">No forms yet.</Typography>
        ) : (
          <Grid container spacing={3}>
            {forms.map((form) => {
              const formResponseCount = responses.filter(
                (response) => response.formId === form.id
              ).length;

              return (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={form.id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: "var(--shadow-1)",
                      height: "100%",
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,253,250,0.85) 100%)",
                      border: "1px solid rgba(255, 255, 255, 0.75)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" fontWeight={700}>
                        {form.course}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {form.instructor}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <Chip
                          size="small"
                          label={form.published ? "Sent" : "Draft"}
                          color={form.published ? "success" : "default"}
                        />
                        <Chip
                          size="small"
                          label={`Responses: ${formResponseCount}`}
                          color="primary"
                          variant="outlined"
                        />
                      </Box>

                      <Button
                        color="error"
                        variant="text"
                        sx={{ mt: 1.5, textTransform: "none", fontWeight: 600 }}
                        onClick={() => setPendingDeleteFormId(form.id)}
                      >
                        Delete Form
                      </Button>

                      {pendingDeleteFormId === form.id && (
                        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                          <Button
                            size="small"
                            color="error"
                            variant="contained"
                            onClick={() => handleDeleteForm(form.id)}
                          >
                            Confirm Delete
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setPendingDeleteFormId(null)}
                          >
                            Cancel
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </>
    );
  };

  const renderResponses = () => {
    return (
      <>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Student Responses
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Track responses per form and quickly identify low-engagement forms.
        </Typography>

        {forms.length === 0 ? (
          <Typography color="text.secondary">No forms available.</Typography>
        ) : (
          <Grid container spacing={3}>
            {forms.map((form) => {
              const formResponses = responses.filter(
                (response) => response.formId === form.id
              );

              const ratings = formResponses
                .map((response) => response.answers?.rating)
                .filter((value) => typeof value === "number" && value > 0);

              const averageRating = ratings.length
                ? (
                    ratings.reduce((sum, value) => sum + value, 0) / ratings.length
                  ).toFixed(1)
                : "N/A";

              return (
                <Grid size={{ xs: 12, lg: 6 }} key={form.id}>
                  <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={700}>
                        {form.course}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 1 }}>
                        {form.instructor}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                        <Chip label={`Responses: ${formResponses.length}`} color="primary" />
                        <Chip label={`Avg Rating: ${averageRating}`} color="success" variant="outlined" />
                      </Box>

                      {formResponses.length === 0 ? (
                        <Typography color="text.secondary">No responses yet.</Typography>
                      ) : (
                        <Stack spacing={1.25}>
                          {formResponses.slice(-3).reverse().map((response, index) => (
                            <Paper key={`${form.id}-${index}`} sx={{ p: 1.25, borderRadius: 2 }}>
                              <Typography variant="caption" color="text.secondary">
                                {response.date}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                Rating: {response.answers?.rating || "N/A"}
                              </Typography>
                              <Typography variant="body2">
                                Issues: {(response.answers?.issues || []).join(", ") || "N/A"}
                              </Typography>
                            </Paper>
                          ))}
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          "radial-gradient(1200px circle at 10% -10%, rgba(20, 184, 166, 0.2), transparent 55%), radial-gradient(1000px circle at 95% 8%, rgba(249, 115, 22, 0.18), transparent 55%), linear-gradient(135deg, #f8fafc 0%, #ecfeff 55%, #fff7ed 100%)",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
          boxShadow: "0 10px 25px rgba(15, 118, 110, 0.25)",
        }}
      >
        <Toolbar>
          <Typography sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Faculty Dashboard
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
            background: "linear-gradient(180deg, #ecfdf5 0%, #cffafe 100%)",
            color: "#0f172a",
            borderRight: "2px solid rgba(15, 118, 110, 0.22)",
            boxShadow: "2px 0 15px rgba(15, 118, 110, 0.12)",
          },
        }}
      >
        <Toolbar />
        <List>
          {[
            { key: "dashboard", label: "Insights", path: "/faculty" },
            { key: "create-form", label: "Create Forms", path: "/faculty/create-form" },
            { key: "your-forms", label: "Your Forms", path: "/faculty/your-forms" },
            { key: "responses", label: "Responses", path: "/faculty/responses" },
          ].map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                selected={selectedSection === item.key}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Toolbar />
        {(selectedSection === "dashboard" || selectedSection === "") && renderInsights()}
        {selectedSection === "create-form" && renderCreateForm()}
        {selectedSection === "your-forms" && renderYourForms()}
        {selectedSection === "responses" && renderResponses()}
      </Box>
    </Box>
  );
};

export default FacultyDashboard;