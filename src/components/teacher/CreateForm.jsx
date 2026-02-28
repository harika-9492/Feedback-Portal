import React from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Paper,
  Grid,
  Alert,
} from "@mui/material";

const CreateForm = ({
  selectedTemplate,
  newForm,
  setNewForm,
  templates,
  message,
  handleTemplateSelect,
  addQuestion,
  removeQuestion,
  updateQuestion,
  addOption,
  removeOption,
  updateOption,
  handleSaveForm,
  selectedSection,
}) => {
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

export default CreateForm;
