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
          <Card
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
              boxShadow: "0 10px 30px rgba(15, 118, 110, 0.3)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>
                Total Submissions
              </Typography>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                {myResponses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
              boxShadow: "0 10px 30px rgba(6, 182, 212, 0.3)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>
                Courses Covered
              </Typography>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                {submittedCourses.size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
              boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>
                Last Submission
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, color: "white", fontWeight: 600 }}>
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
              background: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)",
              border: "1px solid rgba(251, 146, 60, 0.2)",
              boxShadow: "0 8px 25px rgba(251, 146, 60, 0.12)",
              "&:hover": {
                boxShadow: "0 12px 35px rgba(251, 146, 60, 0.18)",
              },
            }}
          >
            <CardContent>
              <Typography sx={{ color: "#7c2d12", fontWeight: 600 }}>
                {getFormLabel(r.formId)}
              </Typography>
              <Typography sx={{ color: "#92400e", mt: 1 }}>
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
