import React, { useContext, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { AuthContext } from "../context/AuthContextValue";
import DashboardHeader from "../components/DashboardHeader";
import DashboardInsights from "../components/faculty/DashboardInsights";
import CreateForm from "../components/faculty/CreateForm";
import YourForms from "../components/faculty/YourForms";
import ResponseViewer from "../components/faculty/ResponseViewer";

const drawerWidth = 240;

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
  const { user } = useContext(AuthContext);
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

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          "radial-gradient(1200px circle at 10% -10%, rgba(20, 184, 166, 0.2), transparent 55%), radial-gradient(1000px circle at 95% 8%, rgba(249, 115, 22, 0.18), transparent 55%), linear-gradient(135deg, #f8fafc 0%, #ecfeff 55%, #fff7ed 100%)",
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
            background: "linear-gradient(180deg, #ecfdf5 0%, #cffafe 100%)",
            color: "#0f172a",
            borderRight: "2px solid rgba(15, 118, 110, 0.22)",
            boxShadow: "2px 0 15px rgba(15, 118, 110, 0.12)",
            marginTop: "64px",
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
        {(selectedSection === "dashboard" || selectedSection === "") && renderInsights()}
        {selectedSection === "create-form" && (
          <CreateForm
            selectedTemplate={selectedTemplate}
            newForm={newForm}
            setNewForm={setNewForm}
            templates={templates}
            message={message}
            handleTemplateSelect={handleTemplateSelect}
            addQuestion={addQuestion}
            removeQuestion={removeQuestion}
            updateQuestion={updateQuestion}
            addOption={addOption}
            removeOption={removeOption}
            updateOption={updateOption}
            handleSaveForm={handleSaveForm}
            selectedSection={selectedSection}
          />
        )}
        {selectedSection === "your-forms" && (
          <YourForms
            forms={forms}
            responses={responses}
            pendingDeleteFormId={pendingDeleteFormId}
            setPendingDeleteFormId={setPendingDeleteFormId}
            handleDeleteForm={handleDeleteForm}
          />
        )}
        {selectedSection === "responses" && (
          <ResponseViewer
            forms={forms}
            responses={responses}
          />
        )}
      </Box>
    </Box>
  );
};

export default FacultyDashboard;