import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import EmployeeDashboard from "./pages/employee-dashboard";
import SupervisorDashboard from "./pages/supervisor-dashboard";
import AdminDashboard from "./pages/admin-dashboard";
import AppraisalForm from "./pages/appraisal-form";
import ProtectedRoute from "./components/protected-route";
import MaintenancePage from "./routes/MaintenancePage";

// ✅ Import Toaster
import { Toaster } from "./components/ui/toaster";

// ✅ Import new admin pages
import EmployeesPage from "./pages/admin/employees";
import DepartmentsPage from "./pages/admin/departments";
import AllAppraisalsPage from "./pages/admin/appraisals";
import SettingsPage from "./pages/admin/settings";

// ✅ Import supervisor pages
import MyTeam from "./pages/supervisor/team";
import PendingAppraisals from "./pages/supervisor/appraisals";

// ✅ Import employee pages
import AppraisalsPage from "./pages/employee/AppraisalsPage";
import GoalsPage from "./pages/employee/GoalsPage";

export default function App() {
  console.log("App component rendered");
  return (
    <div data-theme="corporate" className="min-h-screen bg-base-200">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/employee" element={
              <ProtectedRoute allowedRoles={["employee", "supervisor", "admin"]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            } />

            <Route path="/supervisor" element={
              <ProtectedRoute allowedRoles={["supervisor", "admin"]}>
                <SupervisorDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* ✅ Employee sub-routes */}
            <Route path="/employee/appraisals" element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <AppraisalsPage />
              </ProtectedRoute>
            } />
            <Route path="/employee/goals" element={
              <ProtectedRoute allowedRoles={["employee"]}> 
                <GoalsPage />
              </ProtectedRoute>
            } />                  

            {/* ✅ Admin sub-routes */}
            <Route path="/admin/employees" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <EmployeesPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/departments" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DepartmentsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/appraisals" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AllAppraisalsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <SettingsPage />
              </ProtectedRoute>
            } />

            {/* ✅ Supervisor sub-routes */}
            <Route path="/supervisor/team" element={
              <ProtectedRoute allowedRoles={["supervisor"]}>
                <MyTeam />
              </ProtectedRoute>
            } />
            <Route path="/supervisor/appraisals" element={
              <ProtectedRoute allowedRoles={["supervisor"]}>
                <PendingAppraisals />
              </ProtectedRoute>
            } />

            <Route path="/appraisal/:id?" element={
              <ProtectedRoute allowedRoles={["employee", "supervisor", "admin"]}>
                <AppraisalForm />
              </ProtectedRoute>
            } />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>

          {/* ✅ Global toast container */}
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}
