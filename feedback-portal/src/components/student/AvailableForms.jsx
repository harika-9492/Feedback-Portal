import React from "react";
import { Typography, Grid, Card, CardContent, Button, Chip } from "@mui/material";

const AvailableForms = ({ forms, alreadySubmitted, setCurrentForm, setMessage, setAnswers }) => {
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
          <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
            <CardContent>
              <Typography color="text.secondary">Total Forms</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {forms.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
            <CardContent>
              <Typography color="text.secondary">Submitted</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {submittedCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
            <CardContent>
              <Typography color="text.secondary">Pending</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {pendingCount}
              </Typography>
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
                  <Chip label="Submitted" color="success" size="small" sx={{ mt: 2 }} />
                ) : (
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
                      boxShadow: "0 14px 30px rgba(15, 118, 110, 0.28)",
                    }}
                    onClick={() => {
                      setCurrentForm(form);
                      setMessage({ type: "", text: "" });
                      setAnswers({});
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
};

export default AvailableForms;
