import React from "react";
import { Typography, Grid, Card, CardContent, Stack, Chip } from "@mui/material";

const DashboardHome = ({ user, forms, responses }) => {
  const myResponses = responses.filter((r) => r.submittedBy === user.email);
  const submittedIds = new Set(myResponses.map((r) => r.formId));
  const totalForms = forms.length;
  const submittedCount = submittedIds.size;
  const pendingCount = Math.max(totalForms - submittedCount, 0);
  const courseList = forms.map((form) => form.course);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.email}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Select a section from the sidebar to begin.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
            <CardContent>
              <Typography color="text.secondary">Total Feedback Forms</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {totalForms}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
            <CardContent>
              <Typography color="text.secondary">Submitted By You</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {submittedCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
            <CardContent>
              <Typography color="text.secondary">Pending For You</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {pendingCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            My Courses
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {courseList.length === 0 ? (
              <Typography color="text.secondary">
                No courses available yet.
              </Typography>
            ) : (
              courseList.map((course) => (
                <Chip key={course} label={course} sx={{ mb: 1 }} />
              ))
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Feedback Guidance
          </Typography>
          <Typography color="text.secondary">
            Short, specific feedback helps the most. Use the multiple-choice and
            rating fields so results stay consistent and easy to analyze.
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardHome;
