import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Stack,
  Divider,
  Paper,
  Chip,
  Alert,
} from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const chartColors = ["#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

const DashboardInsights = ({
  user,
  message,
  formStats,
  responsesByFormData,
  publishStatusData,
  issueData,
  recentSuggestions,
}) => {
  return (
    <>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Welcome back, {user?.name || user.email}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Quick insights for your forms, responses, and actions that need attention.
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
            <CardContent>
              <Typography color="text.secondary">Total Forms</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {formStats.totalForms}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
            <CardContent>
              <Typography color="text.secondary">Published</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {formStats.publishedForms}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
            <CardContent>
              <Typography color="text.secondary">Total Responses</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {formStats.totalResponses}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
            <CardContent>
              <Typography color="text.secondary">Average Rating</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {formStats.averageRating}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "var(--shadow-1)",
              height: "100%",
              minHeight: 430,
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Responses by Form
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {responsesByFormData.length === 0 ? (
                <Typography color="text.secondary">
                  No form data available yet for charts.
                </Typography>
              ) : (
                <Box sx={{ height: 360 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={responsesByFormData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="responses"
                        fill="#0ea5e9"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            <Card
              sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)", minHeight: 205 }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Form Status
                </Typography>

                {publishStatusData.length === 0 ? (
                  <Typography color="text.secondary">No forms yet.</Typography>
                ) : (
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={publishStatusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          label
                        >
                          {publishStatusData.map((entry, index) => (
                            <Cell
                              key={`status-${entry.name}`}
                              fill={chartColors[index % chartColors.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card
              sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)", minHeight: 205 }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Improvement Focus
                </Typography>

                {issueData.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No issue trends yet. Collect a few responses to view
                    improvement areas.
                  </Typography>
                ) : (
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={issueData}
                        layout="vertical"
                        margin={{ left: 8, right: 8 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis type="category" dataKey="name" width={110} />
                        <Tooltip />
                        <Bar
                          dataKey="count"
                          fill="#f59e0b"
                          radius={[0, 6, 6, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)", minHeight: 320 }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                What Students Say to Improve
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {recentSuggestions.length === 0 ? (
                <Typography color="text.secondary">
                  No written suggestions yet.
                </Typography>
              ) : (
                <Stack spacing={1.25}>
                  {recentSuggestions.map((suggestion, index) => (
                    <Paper
                      key={`${index}-${suggestion.slice(0, 12)}`}
                      sx={{ p: 1.5, borderRadius: 2 }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Suggestion {index + 1}
                      </Typography>
                      <Typography variant="body1">{suggestion}</Typography>
                    </Paper>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)", minHeight: 320 }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Priority Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Based on your latest response trends:
              </Typography>
              <Stack spacing={1}>
                <Chip
                  label={
                    issueData[0]
                      ? `Fix top issue: ${issueData[0].name}`
                      : "Collect more responses for issue trend"
                  }
                  color="warning"
                  variant="outlined"
                />
                <Chip
                  label={
                    formStats.lowResponseForms > 0
                      ? `Boost participation for ${formStats.lowResponseForms} form(s)`
                      : "Participation looks healthy"
                  }
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={
                    formStats.averageRating !== "N/A" &&
                    Number(formStats.averageRating) < 3.5
                      ? "Improve clarity and engagement for low ratings"
                      : "Maintain current teaching quality"
                  }
                  color="success"
                  variant="outlined"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardInsights;
