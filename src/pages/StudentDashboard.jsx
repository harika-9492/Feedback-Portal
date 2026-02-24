import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Grid,
  Card,
  CardContent,
  TextField,
  Stack,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Rating,
  Alert,
} from "@mui/material";
import { AuthContext } from "../context/AuthContextValue";
import DashboardHeader from "../components/DashboardHeader";
import DashboardHome from "../components/student/DashboardHome";
import AvailableForms from "../components/student/AvailableForms";
import MySubmissions from "../components/student/MySubmissions";
import AggregatedResults from "../components/student/AggregatedResults";

const drawerWidth = 220;

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current section from URL path
  const pathParts = location.pathname.split("/");
  const selectedSection = pathParts[2] || "dashboard";
  
  const [forms] = useState(() => {
    const storedForms = JSON.parse(localStorage.getItem("forms")) || [];
    return storedForms.filter((form) => form.facultyEmail);
  });
  const [responses, setResponses] = useState(
    () => JSON.parse(localStorage.getItem("responses")) || []
  );
  const [currentForm, setCurrentForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = () => {
    // Validate that all questions have been answered
    const unansweredQuestions = currentForm.questions.filter((_, index) => {
      const answer = answers[index];
      
      // Check based on question type
      if (currentForm.questions[index].type === "rating") {
        return !answer || answer === 0;
      } else if (currentForm.questions[index].type === "multi_choice") {
        return !answer || answer.length === 0;
      } else if (currentForm.questions[index].type === "single_choice") {
        return !answer || answer === "";
      } else if (currentForm.questions[index].type === "text") {
        // Text questions are optional
        return false;
      }
      return false;
    });

    if (unansweredQuestions.length > 0) {
      setMessage({
        type: "error",
        text: "Please answer all required questions.",
      });
      return;
    }

    const newResponse = {
      formId: currentForm.id,
      student: null,
      submittedBy: user.email,
      answers: answers,
      date: new Date().toLocaleString(),
    };

    const updatedResponses = [...responses, newResponse];
    localStorage.setItem("responses", JSON.stringify(updatedResponses));
    setResponses(updatedResponses);

    setCurrentForm(null);
    setAnswers({});
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
    const form = forms.find((f) => f.id === formId);
    const formResponses = responses.filter((r) => r.formId === formId);
    
    if (!form || !form.questions) {
      return { total: formResponses.length, averageRating: "N/A", issueCounts: {} };
    }

    // Find rating questions and calculate average
    const ratingQuestionIndices = form.questions
      .map((q, idx) => (q.type === "rating" ? idx : -1))
      .filter((idx) => idx !== -1);

    let ratingValues = [];
    ratingQuestionIndices.forEach((qIdx) => {
      formResponses.forEach((r) => {
        const value = r.answers?.[qIdx];
        if (typeof value === "number" && value > 0) {
          ratingValues.push(value);
        }
      });
    });

    // Backwards compatibility - check for old rating structure
    if (ratingValues.length === 0) {
      ratingValues = formResponses
        .map((r) => r.answers?.rating)
        .filter((v) => typeof v === "number" && v > 0);
    }

    const averageRating = ratingValues.length
      ? (ratingValues.reduce((sum, v) => sum + v, 0) / ratingValues.length).toFixed(1)
      : "N/A";

    // Collect multi-choice answers
    const issueCounts = {};
    form.questions.forEach((q, qIdx) => {
      if (q.type === "multi_choice") {
        formResponses.forEach((r) => {
          const answers = r.answers?.[qIdx];
          if (Array.isArray(answers)) {
            answers.forEach((ans) => {
              issueCounts[ans] = (issueCounts[ans] || 0) + 1;
            });
          }
        });
      }
    });

    // Backwards compatibility - check for old issues structure
    if (Object.keys(issueCounts).length === 0) {
      formResponses.forEach((r) => {
        const issues = r.answers?.issues || [];
        issues.forEach((issue) => {
          issueCounts[issue] = (issueCounts[issue] || 0) + 1;
        });
      });
    }

    return {
      total: formResponses.length,
      averageRating,
      issueCounts,
    };
  };

  const renderContent = () => {
    if (selectedSection === "dashboard") {
      return <DashboardHome user={user} forms={forms} responses={responses} />;
    }

    if (selectedSection === "forms") {
      return (
        <AvailableForms
          forms={forms}
          alreadySubmitted={alreadySubmitted}
          setCurrentForm={setCurrentForm}
          setMessage={setMessage}
          setAnswers={setAnswers}
        />
      );
    }

    if (selectedSection === "submissions") {
      return (
        <MySubmissions
          user={user}
          responses={responses}
          getFormLabel={getFormLabel}
        />
      );
    }

    if (selectedSection === "results") {
      return (
        <AggregatedResults
          forms={forms}
          responses={responses}
          getAggregates={getAggregates}
        />
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
              onClick={() => navigate("/student")}
              selected={selectedSection === "dashboard"}
            >
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate("/student/forms")}
              selected={selectedSection === "forms"}
            >
              <ListItemText primary="Available Forms" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate("/student/submissions")}
              selected={selectedSection === "submissions"}
            >
              <ListItemText primary="My Submissions" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => navigate("/student/results")}
              selected={selectedSection === "results"}
            >
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

            {currentForm.questions.map((q, index) => {
              const gradients = [
                {
                  background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
                  border: "1px solid rgba(139, 92, 246, 0.2)",
                  boxShadow: "0 8px 25px rgba(139, 92, 246, 0.12)",
                  labelColor: "#581c87",
                },
                {
                  background: "linear-gradient(135deg, #fef2f2 0%, #fce7f3 100%)",
                  border: "1px solid rgba(236, 72, 153, 0.2)",
                  boxShadow: "0 8px 25px rgba(236, 72, 153, 0.12)",
                  labelColor: "#831843",
                },
                {
                  background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                  boxShadow: "0 8px 25px rgba(34, 197, 94, 0.12)",
                  labelColor: "#15803d",
                },
                {
                  background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  boxShadow: "0 8px 25px rgba(59, 130, 246, 0.12)",
                  labelColor: "#1e3a8a",
                },
              ];

              const style = gradients[index % gradients.length];

              return (
                <Card
                  key={index}
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    background: style.background,
                    border: style.border,
                    boxShadow: style.boxShadow,
                  }}
                >
                  <CardContent>
                    <FormControl component="fieldset" fullWidth>
                      <FormLabel component="legend" sx={{ mb: 1, color: style.labelColor }}>
                        {q.question}
                      </FormLabel>

                      {q.type === "rating" && (
                        <Rating
                          name={`question-${index}`}
                          value={answers[index] || 0}
                          onChange={(_, value) =>
                            setAnswers({ ...answers, [index]: value || 0 })
                          }
                        />
                      )}

                      {q.type === "single_choice" && (
                        <RadioGroup
                          value={answers[index] || ""}
                          onChange={(e) =>
                            setAnswers({ ...answers, [index]: e.target.value })
                          }
                        >
                          {q.options.map((option, optIndex) => (
                            <FormControlLabel
                              key={optIndex}
                              value={option}
                              control={<Radio />}
                              label={option}
                            />
                          ))}
                        </RadioGroup>
                      )}

                      {q.type === "multi_choice" && (
                        <Stack>
                          {q.options.map((option, optIndex) => (
                            <FormControlLabel
                              key={optIndex}
                              control={
                                <Checkbox
                                  checked={(answers[index] || []).includes(option)}
                                  onChange={(e) => {
                                    const currentAnswers = answers[index] || [];
                                    const nextAnswers = e.target.checked
                                      ? [...currentAnswers, option]
                                      : currentAnswers.filter((v) => v !== option);
                                    setAnswers({ ...answers, [index]: nextAnswers });
                                  }}
                                />
                              }
                              label={option}
                            />
                          ))}
                        </Stack>
                      )}

                      {q.type === "text" && (
                        <TextField
                          fullWidth
                          multiline
                          minRows={3}
                          placeholder="Your answer"
                          value={answers[index] || ""}
                          onChange={(e) =>
                            setAnswers({ ...answers, [index]: e.target.value })
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: style.labelColor,
                            },
                          }}
                        />
                      )}
                    </FormControl>
                  </CardContent>
                </Card>
              );
            })}

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