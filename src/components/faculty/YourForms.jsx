import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
} from "@mui/material";

const YourForms = ({
  forms,
  responses,
  pendingDeleteFormId,
  setPendingDeleteFormId,
  handleDeleteForm,
}) => {
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

export default YourForms;
