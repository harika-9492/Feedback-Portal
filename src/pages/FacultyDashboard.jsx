import React, { useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Drawer,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardHeader from "../components/DashboardHeader";
import FormAnalyticsCharts from "../components/analytics/FormAnalyticsCharts";
import { AuthContext } from "../context/AuthContextValue";
import {
  getAnalyticsByForm,
  getFacultyAssignedForms,
  getResponses,
  refreshAnalyticsData,
} from "../utils/feedbackData";

const drawerWidth = 240;

const getFormDisplayLabel = (form) => {
  const legacyLabel = [form.course, form.subject, form.title].filter(Boolean).join(" - ");
  if (legacyLabel) return legacyLabel;
  return [form.course, form.description].filter(Boolean).join(" • ") || `Form ${form.id}`;
};

const FacultyDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedSection = location.pathname.split("/")[2] || "dashboard";

  const [assignedForms] = useState(() => getFacultyAssignedForms(user.email));
  const [responses] = useState(() => getResponses());
  const [analyticsByForm, setAnalyticsByForm] = useState(() => getAnalyticsByForm());
  const [selectedFormId, setSelectedFormId] = useState("");

  const refresh = () => {
    setAnalyticsByForm(refreshAnalyticsData());
  };

  const formResponseCount = useMemo(
    () =>
      assignedForms.reduce((sum, form) => {
        return sum + responses.filter((response) => response.formId === form.id).length;
      }, 0),
    [assignedForms, responses]
  );

  const averageAssignedRating = useMemo(() => {
    if (!assignedForms.length) return 0;

    const total = assignedForms.reduce((sum, form) => {
      const analytics = analyticsByForm[form.id];
      return sum + (analytics?.overallRating || 0);
    }, 0);

    return Number((total / assignedForms.length).toFixed(2));
  }, [assignedForms, analyticsByForm]);

  const selectedAnalytics = selectedFormId ? analyticsByForm[selectedFormId] : null;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          "radial-gradient(1200px circle at 10% -10%, rgba(20, 184, 166, 0.18), transparent 55%), radial-gradient(900px circle at 90% 10%, rgba(249, 115, 22, 0.14), transparent 55%), linear-gradient(135deg, #f8fafc 0%, #ecfeff 55%, #fff7ed 100%)",
        marginTop: "64px",
      }}
    >
      <DashboardHeader />

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #ecfdf5 0%, #cffafe 100%)",
            borderRight: "2px solid rgba(15, 118, 110, 0.25)",
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate("/faculty")}
              selected={selectedSection === "dashboard"}
            >
              <ListItemText primary="Summary" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate("/faculty/analytics")}
              selected={selectedSection === "analytics"}
            >
              <ListItemText primary="My Analytics" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 3, md: 4 } }}>
        {selectedSection === "analytics" ? (
          <>
            <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)", mb: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                  Analytics for Assigned Forms
                </Typography>
                <FormControl sx={{ minWidth: 340 }}>
                  <InputLabel>Select Assigned Form</InputLabel>
                  <Select
                    value={selectedFormId}
                    label="Select Assigned Form"
                    onChange={(event) => setSelectedFormId(event.target.value)}
                  >
                    {assignedForms.map((form) => (
                      <MenuItem key={form.id} value={String(form.id)}>
                        {getFormDisplayLabel(form)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>

            <FormAnalyticsCharts analytics={selectedAnalytics} />
          </>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
                <CardContent>
                  <Typography color="text.secondary">Assigned Forms</Typography>
                  <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                    {assignedForms.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
                <CardContent>
                  <Typography color="text.secondary">Student Submissions</Typography>
                  <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                    {formResponseCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
                <CardContent>
                  <Typography color="text.secondary">Average Rating</Typography>
                  <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                    {averageAssignedRating.toFixed(2)} / 5
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, boxShadow: "var(--shadow-1)" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Assigned Form List
                  </Typography>
                  {assignedForms.length === 0 ? (
                    <Alert severity="info">No forms are assigned to your account yet.</Alert>
                  ) : (
                    assignedForms.map((form) => (
                      <Box key={form.id} sx={{ mb: 1.5 }}>
                        <Typography sx={{ fontWeight: 600 }}>
                          {form.title || form.course || `Form ${form.id}`}
                        </Typography>
                        <Typography color="text.secondary">{form.description || form.subject || ""}</Typography>
                      </Box>
                    ))
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography
            component="button"
            onClick={refresh}
            sx={{
              border: 0,
              p: 0,
              background: "none",
              color: "primary.main",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Refresh analytics
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default FacultyDashboard;
