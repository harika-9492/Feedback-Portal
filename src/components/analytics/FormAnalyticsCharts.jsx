import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

const FormAnalyticsCharts = ({ analytics }) => {
  if (!analytics) {
    return (
      <Typography color="text.secondary">
        Select a form to view analytics.
      </Typography>
    );
  }

  const questionChartData = (analytics.averagePerQuestion || [])
    .filter((item) => item.type === "rating")
    .map((item, index) => ({
      label: `Q${index + 1}`,
      average: item.average,
      question: item.question,
    }));

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)", height: "100%" }}>
          <CardContent>
            <Typography color="text.secondary">Total Submissions</Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
              {analytics.totalSubmissions}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)", height: "100%" }}>
          <CardContent>
            <Typography color="text.secondary">Overall Rating</Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
              {analytics.overallRating.toFixed(2)} / 5
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)", height: "100%" }}>
          <CardContent>
            <Typography color="text.secondary">Rating Questions</Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
              {questionChartData.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={6}>
        <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Average Rating per Question
            </Typography>
            <Box sx={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={questionChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis domain={[0, analytics.ratingScaleMax || 5]} />
                  <Tooltip />
                  <Bar dataKey="average" fill="#0f766e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={6}>
        <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Rating Distribution
            </Typography>
            <Box sx={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={analytics.distribution || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default FormAnalyticsCharts;
