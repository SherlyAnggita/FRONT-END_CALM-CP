import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import OAuthSuccess from "../pages/OAuthSuccess";

// halaman user
import HomePage from "../pages/User/HomePage";
import ProfilePage from "../pages/User/ProfilePage";
import MoodJarPage from "../pages/User/MoodJarPage";
import CalendarEventPage from "../pages/User/CalendarEventPage";
import SettingPage from "../pages/User/settings/SettingPage";
import ChangePasswordPage from "../pages/User/settings/ChangePasswordPage";

import UserLayout from "../layouts/User/UserLayout";

// halaman admin
import AdminRoute from "../routes/AdminRoute";
import AdminHomePage from "../pages/Admin/AdminHomePage";
import ActivityPage from "../pages/Admin/ActivityLog/ActivityPage";
import MoodLabelPage from "../pages/Admin/MoodLabel/index";
import UsersPage from "../pages/Admin/Users/index";
import UserDetailPage from "../pages/Admin/Users/detail";
import AdminProfilePage from "../pages/Admin/AdminProfilePage";
import StatusBatteryPage from "../pages/Admin/StatusBattery/index";
import StatusBatteryDetailPage from "../pages/Admin/StatusBattery/detail";

import AdminLayout from "../layouts/Admin/AdminLayout";

import { tokenStorage } from "../lib/token";

// Route milik User
function ProtectedRoute({ children }) {
  const accessToken = tokenStorage.getAccessToken();
  const user = tokenStorage.getUser();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

function GuestRoute({ children }) {
  const accessToken = tokenStorage.getAccessToken();
  const user = tokenStorage.getUser();

  if (accessToken) {
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/user" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              {" "}
              <LoginPage />{" "}
            </GuestRoute>
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute>
              {" "}
              <RegisterPage />{" "}
            </GuestRoute>
          }
        />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        <Route path="/" element={<Navigate to="/user" replace />} />

        {/* halaman user */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              {" "}
              <UserLayout />{" "}
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="mood" element={<MoodJarPage />} />
          <Route path="calendar" element={<CalendarEventPage />} />
          <Route path="settings" element={<SettingPage />} />
          <Route
            path="settings/change-password"
            element={<ChangePasswordPage />}
          />
        </Route>

        {/* halaman admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminHomePage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="mood-labels" element={<MoodLabelPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<UserDetailPage />} />
          <Route path="status-battery" element={<StatusBatteryPage />}/>
          <Route path="status-battery/:id" element={<StatusBatteryDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
