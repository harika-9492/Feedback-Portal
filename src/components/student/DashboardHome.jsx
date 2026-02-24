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
          <Card
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>
                Total Feedback Forms
              </Typography>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                {totalForms}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)",
              boxShadow: "0 10px 30px rgba(0, 212, 255, 0.3)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>
                Submitted By You
              </Typography>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                {submittedCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
              boxShadow: "0 10px 30px rgba(249, 115, 22, 0.3)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>
                Pending For You
              </Typography>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                {pendingCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
          boxShadow: "0 10px 30px rgba(6, 182, 212, 0.25)",
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: "white", fontWeight: 600 }}>
            My Courses
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {courseList.length === 0 ? (
              <Typography sx={{ color: "rgba(255,255,255,0.8)" }}>
                No courses available yet.
              </Typography>
            ) : (
              courseList.map((course) => (
                <Chip
                  key={course}
                  label={course}
                  sx={{ mb: 1, background: "rgba(255,255,255,0.25)", color: "white" }}
                />
              ))
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card
        sx={{
          borderRadius: 3,
          background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
          boxShadow: "0 10px 30px rgba(139, 92, 246, 0.25)",
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: "white", fontWeight: 600 }}>
            Feedback Guidance
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>
            Short, specific feedback helps the most. Use the multiple-choice and
            rating fields so results stay consistent and easy to analyze.
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardHome;
