import React from "react";
import { Typography, Grid, Card, CardContent } from "@mui/material";

const MySubmissions = ({ user, responses, getFormLabel }) => {
  const myResponses = responses.filter((r) => r.submittedBy === user.email);
  const lastSubmission = myResponses.length
    ? myResponses[myResponses.length - 1]
    : null;
  const submittedCourses = new Set(
    myResponses.map((r) => getFormLabel(r.formId))
  );

  return (
    <>
      <Typography variant="h4" gutterBottom>
        My Submissions
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Track what you have already submitted. Content remains anonymous.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
            <CardContent>
              <Typography color="text.secondary">Total Submissions</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {myResponses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
            <CardContent>
              <Typography color="text.secondary">Courses Covered</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {submittedCourses.size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
            <CardContent>
              <Typography color="text.secondary">Last Submission</Typography>
              <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>
                {lastSubmission ? lastSubmission.date : "N/A"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {myResponses.length === 0 ? (
        <Typography>No submissions yet.</Typography>
      ) : (
        myResponses.map((r, index) => (
          <Card
            key={index}
            sx={{
              mb: 2,
              borderRadius: 3,
              boxShadow: "var(--shadow-1)",
              border: "1px solid rgba(0, 0, 0, 0.08)",
            }}
          >
            <CardContent>
              <Typography sx={{ fontWeight: 600 }}>
                {getFormLabel(r.formId)}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Submitted on: {r.date}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </>
  );
};

export default MySubmissions;
