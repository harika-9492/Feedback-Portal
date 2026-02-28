import DashboardLayout from "./DashboardLayout";
import DashboardHeader from "./DashboardHeader";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <DashboardHeader title="Admin Dashboard" />

      <div style={{ padding: "20px" }}>
        <h2>Admin Controls</h2>

        <ul>
          <li>Manage Teachers</li>
          <li>Manage Students</li>
          <li>Create Feedback Forms</li>
          <li>View System Analytics</li>
        </ul>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;