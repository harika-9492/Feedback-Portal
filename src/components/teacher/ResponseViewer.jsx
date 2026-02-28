import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Paper,
} from "@mui/material";

const ResponseViewer = ({ forms, responses }) => {
  const getRatingValues = (response, form) => {
    if (!form?.questions) {
      const legacyRating = response?.answers?.rating;
      return typeof legacyRating === "number" && legacyRating > 0 ? [legacyRating] : [];
    }

    const values = [];
    form.questions.forEach((question, questionIndex) => {
      if (question.type !== "rating") return;
      const value = response.answers?.[questionIndex];
      if (typeof value === "number" && value > 0) {
        values.push(value);
      }
    });

    const legacyRating = response.answers?.rating;
    if (values.length === 0 && typeof legacyRating === "number" && legacyRating > 0) {
      values.push(legacyRating);
    }

    return values;
  };

  const getIssueValues = (response, form) => {
    const values = [];

    if (form?.questions) {
      form.questions.forEach((question, questionIndex) => {
        if (question.type === "single_choice") {
          const value = response.answers?.[questionIndex];
          if (typeof value === "string" && value.trim()) {
            values.push(value.trim());
          }
        }

        if (question.type === "multi_choice") {
          const answerList = response.answers?.[questionIndex];
          if (Array.isArray(answerList)) {
            answerList.forEach((item) => {
              if (typeof item === "string" && item.trim()) {
                values.push(item.trim());
              }
            });
          }
        }
      });
    }

    const legacyIssues = response.answers?.issues;
    if (Array.isArray(legacyIssues)) {
      legacyIssues.forEach((item) => {
        if (typeof item === "string" && item.trim()) {
          values.push(item.trim());
        }
      });
    }

    return values;
  };

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

            const ratings = formResponses.flatMap((response) =>
              getRatingValues(response, form)
            );

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
                            {(() => {
                              const responseRatings = getRatingValues(response, form);
                              const responseIssues = getIssueValues(response, form);
                              const responseRating = responseRatings.length
                                ? (
                                    responseRatings.reduce((sum, value) => sum + value, 0) /
                                    responseRatings.length
                                  ).toFixed(1)
                                : "N/A";

                              return (
                                <>
                            <Typography variant="caption" color="text.secondary">
                              {response.date}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              Rating: {responseRating}
                            </Typography>
                            <Typography variant="body2">
                              Issues: {responseIssues.join(", ") || "N/A"}
                            </Typography>
                                </>
                              );
                            })()}
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

export default ResponseViewer;
