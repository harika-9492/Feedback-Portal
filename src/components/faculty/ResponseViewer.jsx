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

export default ResponseViewer;
