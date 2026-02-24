import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Box,
  Divider,
} from "@mui/material";

const AggregatedResults = ({ forms, responses, getAggregates }) => {
  const totalResponses = responses.length;

  // Calculate overall ratings from all forms
  const overallRatings = [];
  responses.forEach((r) => {
    // Find the form to get question types
    const form = forms.find((f) => f.id === r.formId);
    if (form && form.questions) {
      form.questions.forEach((q, qIdx) => {
        if (q.type === "rating") {
          const value = r.answers?.[qIdx];
          if (typeof value === "number" && value > 0) {
            overallRatings.push(value);
          }
        }
      });
    }
    // Backwards compatibility
    const legacyRating = r.answers?.rating;
    if (typeof legacyRating === "number" && legacyRating > 0) {
      overallRatings.push(legacyRating);
    }
  });

  const overallAverage = overallRatings.length
    ? (
        overallRatings.reduce((sum, v) => sum + v, 0) / overallRatings.length
      ).toFixed(1)
    : "N/A";

  // Count all multi-choice answers
  const issueCounts = {};
  responses.forEach((r) => {
    const form = forms.find((f) => f.id === r.formId);
    if (form && form.questions) {
      form.questions.forEach((q, qIdx) => {
        if (q.type === "multi_choice") {
          const answers = r.answers?.[qIdx];
          if (Array.isArray(answers)) {
            answers.forEach((ans) => {
              issueCounts[ans] = (issueCounts[ans] || 0) + 1;
            });
          }
        }
      });
    }
    // Backwards compatibility
    const legacyIssues = r.answers?.issues || [];
    legacyIssues.forEach((issue) => {
      issueCounts[issue] = (issueCounts[issue] || 0) + 1;
    });
  });

  const topIssues = Object.entries(issueCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Aggregated Results
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Results are shown in summary form only. Individual comments are not
        displayed.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>
                Total Responses
              </Typography>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                {totalResponses}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
              boxShadow: "0 10px 30px rgba(244, 63, 94, 0.3)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>
                Overall Avg Rating
              </Typography>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                {overallAverage}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
              boxShadow: "0 10px 30px rgba(20, 184, 166, 0.3)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>
                Top Issues
              </Typography>
              {topIssues.length === 0 ? (
                <Typography
                  variant="body1"
                  sx={{ mt: 1, color: "white", fontWeight: 600 }}
                >
                  N/A
                </Typography>
              ) : (
                <Stack spacing={0.5} sx={{ mt: 1 }}>
                  {topIssues.map(([issue, count]) => (
                    <Typography
                      key={issue}
                      sx={{
                        color: "rgba(255,255,255,0.85)",
                        fontSize: "0.9rem",
                      }}
                    >
                      {issue}: {count}
                    </Typography>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {forms.map((form) => {
          const aggregates = getAggregates(form.id);
          const issues = Object.entries(aggregates.issueCounts);
          return (
            <Grid key={form.id} item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #ecfdf5 100%)",
                  border: "2px solid rgba(16, 185, 129, 0.2)",
                  boxShadow: "0 12px 35px rgba(16, 185, 129, 0.15)",
                  "&:hover": {
                    boxShadow: "0 16px 45px rgba(16, 185, 129, 0.25)",
                    transform: "translateY(-4px)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{ color: "#0f766e", fontWeight: 800, mb: 0.5 }}
                  >
                    {form.course}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#0d9488",
                      mb: 2,
                      fontSize: "0.95rem",
                      fontWeight: 500,
                    }}
                  >
                    👨‍🏫 {form.instructor}
                  </Typography>

                  <Stack direction="row" spacing={2} sx={{ mb: 3, gap: 1.5 }}>
                    <Box
                      sx={{
                        flex: 1,
                        background:
                          "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)",
                        padding: "12px 14px",
                        borderRadius: 2,
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#7f1d1d",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          mb: 0.3,
                        }}
                      >
                        Avg Rating
                      </Typography>
                      <Typography
                        sx={{
                          color: "#991b1b",
                          fontWeight: 800,
                          fontSize: "1.3rem",
                        }}
                      >
                        {aggregates.averageRating}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        background:
                          "linear-gradient(135deg, #a5f3fc 0%, #67e8f9 100%)",
                        padding: "12px 14px",
                        borderRadius: 2,
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#164e63",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          mb: 0.3,
                        }}
                      >
                        Submissions
                      </Typography>
                      <Typography
                        sx={{
                          color: "#0c4a6e",
                          fontWeight: 800,
                          fontSize: "1.3rem",
                        }}
                      >
                        {aggregates.total}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider
                    sx={{ mb: 2, borderColor: "rgba(15, 118, 110, 0.15)" }}
                  />

                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#0f766e", fontWeight: 700, mb: 1.2 }}
                  >
                    📊 Top Issues
                  </Typography>
                  {issues.length === 0 ? (
                    <Box
                      sx={{
                        background: "rgba(15, 118, 110, 0.05)",
                        padding: "10px",
                        borderRadius: 1.5,
                        border: "1px solid rgba(15, 118, 110, 0.1)",
                      }}
                    >
                      <Typography
                        sx={{ color: "#0f766e", fontSize: "0.9rem" }}
                      >
                        ✓ No issues reported
                      </Typography>
                    </Box>
                  ) : (
                    <Stack spacing={0.8}>
                      {issues.map(([issue, count]) => (
                        <Box
                          key={issue}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "rgba(15, 118, 110, 0.06)",
                            padding: "8px 12px",
                            borderRadius: 1.5,
                            border: "1px solid rgba(15, 118, 110, 0.12)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#0d9488",
                              fontWeight: 500,
                              fontSize: "0.95rem",
                            }}
                          >
                            {issue}
                          </Typography>
                          <Box
                            sx={{
                              background:
                                "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                              color: "white",
                              padding: "2px 10px",
                              borderRadius: "20px",
                              fontSize: "0.85rem",
                              fontWeight: 700,
                            }}
                          >
                            {count}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default AggregatedResults;
