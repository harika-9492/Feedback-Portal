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
  Typography,
  Button,
} from "@mui/material";
import { AuthContext } from "../context/AuthContextValue";
import DashboardHeader from "../components/DashboardHeader";
import DashboardHome from "../components/student/DashboardHome";
import AvailableForms from "../components/student/AvailableForms";
import MySubmissions from "../components/student/MySubmissions";
import {
  getResponses,
  getStudentForms,
  hasStudentSubmitted,
  submitFormResponse,
} from "../utils/feedbackData";

const drawerWidth = 220;

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedSection = location.pathname.split("/")[2] || "dashboard";

  const [forms] = useState(() => getStudentForms());
  const [responses, setResponses] = useState(() => getResponses());
  const [currentForm, setCurrentForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = () => {
    const unansweredQuestions = currentForm.questions.filter((question, index) => {
      const answer = answers[index];

      if (question.type === "rating") {
        return !answer || answer === 0;
      }
      if (question.type === "single_choice") {
        return !answer;
      }
      if (question.type === "multi_choice") {
        return !answer || !answer.length;
      }
      return false;
    });

    if (unansweredQuestions.length > 0) {
      setMessage({
        type: "error",
        text: "Please answer all required questions before submitting.",
      });
      return;
    }

    submitFormResponse({
      formId: currentForm.id,
      submittedBy: user.email,
      answers,
      date: new Date().toLocaleString(),
    });

    setResponses(getResponses());
    setCurrentForm(null);
    setAnswers({});
    setMessage({ type: "success", text: "Feedback submitted successfully." });
  };

  const alreadySubmitted = (formId) => hasStudentSubmitted(formId, user.email);

  const getFormLabel = (formId) => {
    const form = forms.find((value) => value.id === formId);
    if (!form) return `Form ${formId}`;
    return [form.course, form.subject].filter(Boolean).join(" - ") || form.title || `Form ${formId}`;
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
        <MySubmissions user={user} responses={responses} getFormLabel={getFormLabel} />
      );
    }

    return null;
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
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 3, md: 4 } }}>
        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        {currentForm ? (
          <>
            <Typography variant="h4" gutterBottom>
              {(currentForm.title || currentForm.course || "Feedback Form").trim()}
            </Typography>

            {!!(currentForm.course || currentForm.description || currentForm.subject) && (
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {[currentForm.course, currentForm.description, currentForm.subject]
                  .filter(Boolean)
                  .join(" • ")}
              </Typography>
            )}

            {currentForm.questions.map((question, index) => (
              <Card
                key={index}
                sx={{
                  mb: 3,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  boxShadow: "0 8px 25px rgba(59, 130, 246, 0.12)",
                }}
              >
                <CardContent>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend" sx={{ mb: 1, color: "#1e3a8a" }}>
                      {question.question}
                    </FormLabel>

                    {question.type === "rating" && (
                      <Rating
                        name={`question-${index}`}
                        max={currentForm.ratingScaleMax || 5}
                        value={answers[index] || 0}
                        onChange={(_, value) =>
                          setAnswers((prev) => ({ ...prev, [index]: value || 0 }))
                        }
                      />
                    )}

                    {question.type === "single_choice" && (
                      <RadioGroup
                        value={answers[index] || ""}
                        onChange={(event) =>
                          setAnswers((prev) => ({ ...prev, [index]: event.target.value }))
                        }
                      >
                        {(question.options || []).map((option, optionIndex) => (
                          <FormControlLabel
                            key={optionIndex}
                            value={option}
                            control={<Radio />}
                            label={option}
                          />
                        ))}
                      </RadioGroup>
                    )}

                    {question.type === "multi_choice" && (
                      <Stack>
                        {(question.options || []).map((option, optionIndex) => (
                          <FormControlLabel
                            key={optionIndex}
                            control={
                              <Checkbox
                                checked={(answers[index] || []).includes(option)}
                                onChange={(event) => {
                                  const currentValues = answers[index] || [];
                                  const nextValues = event.target.checked
                                    ? [...currentValues, option]
                                    : currentValues.filter((value) => value !== option);
                                  setAnswers((prev) => ({ ...prev, [index]: nextValues }));
                                }}
                              />
                            }
                            label={option}
                          />
                        ))}
                      </Stack>
                    )}

                    {question.type === "text" && (
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        placeholder="Your answer"
                        value={answers[index] || ""}
                        onChange={(event) =>
                          setAnswers((prev) => ({ ...prev, [index]: event.target.value }))
                        }
                      />
                    )}
                  </FormControl>
                </CardContent>
              </Card>
            ))}

            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={handleSubmit}>
                Submit Feedback
              </Button>
              <Button variant="outlined" onClick={() => setCurrentForm(null)}>
                Cancel
              </Button>
            </Stack>
          </>
        ) : (
          renderContent()
        )}
      </Box>
    </Box>
  );
};

export default StudentDashboard;
