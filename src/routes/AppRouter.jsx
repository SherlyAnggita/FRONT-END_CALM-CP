import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import OAuthSuccess from "../pages/OAuthSuccess";
import ProtectedRoute from "./ProtectedRoute";

// Policy Privasi & Terms of Service
import PrivacyPolicy from "../pages/PolicyPage";
import Terms from "../pages/TermsPage";

// halaman user
// import HomePage from "../pages/User/HomePage";
import DashboardUserPage from "../pages/User/DashboardUserPage";
import ProfilePage from "../pages/User/ProfilePage";
import MoodJarPage from "../pages/User/MoodJarPage";
import CalendarEventPage from "../pages/User/CalendarEventPage";
import SocialBatteryPage from "../pages/User/SocialBatteryPage";
import SettingPage from "../pages/User/settings/SettingPage";
import ChangePasswordPage from "../pages/User/settings/ChangePasswordPage";
import SocialBatteryHistoryPage from "../pages/User/SocialBatteryHistoryPage";
import NotificationsPage from "../pages/User/notifications/index";

import UserLayout from "../layouts/User/UserLayout";

// halaman admin
import AdminRoute from "../routes/AdminRoute";
// import AdminHomePage from "../pages/Admin/AdminHomePage";
import DashboardPage from "../pages/Admin/DashboardAdmin/index";
import ActivityPage from "../pages/Admin/ActivityLog/ActivityPage";
import MoodLabelPage from "../pages/Admin/MoodLabel/index";
import UsersPage from "../pages/Admin/Users/index";
import UserDetailPage from "../pages/Admin/Users/detail";
import AdminProfilePage from "../pages/Admin/AdminProfilePage";
import StatusBatteryPage from "../pages/Admin/StatusBattery/index";
import StatusBatteryDetailPage from "../pages/Admin/StatusBattery/detail";
import MoodEntryPage from "../pages/Admin/MoodEntry/index";
import MoodEntryDetailPage from "../pages/Admin/MoodEntry/detail";
import EncouragementResultPage from "../pages/Admin/EncouragementResult/index";
import EncouragementResultDetailPage from "../pages/Admin/EncouragementResult/detail";
import SocialBatteryLogsPage from "../pages/Admin/SocialBatteryLogs/index";
import SocialBatteryLogsDetailPage from "../pages/Admin/SocialBatteryLogs/detail";
import ChangePasswordAdmin from "../pages/Admin/Setting/ChangePasswordAdmin";
import AdminSettingPage from "../pages/Admin/Setting/AdminSettingPage";

import AdminLayout from "../layouts/Admin/AdminLayout";

import { tokenStorage } from "../lib/token";

// Route milik User
// function ProtectedRoute({ children }) {
//   const accessToken = tokenStorage.getAccessToken();
//   const user = tokenStorage.getUser();

//   if (!accessToken) {
//     return <Navigate to="/login" replace />;
//   }

//   if (user?.role === "admin") {
//     return <Navigate to="/admin" replace />;
//   }

//   return children;
// }

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

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />

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
          {/* <Route index element={<HomePage />} /> */}
          <Route index element={<DashboardUserPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="mood" element={<MoodJarPage />} />
          <Route path="calendar" element={<CalendarEventPage />} />
          <Route path="social-battery" element={<SocialBatteryPage />} />
          <Route
            path="social-battery/history"
            element={<SocialBatteryHistoryPage />}
          />
          <Route path="settings" element={<SettingPage />} />
          <Route
            path="settings/change-password"
            element={<ChangePasswordPage />}
          />
          <Route path="notifications" element={<NotificationsPage />} />
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
          <Route index element={<DashboardPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="mood-labels" element={<MoodLabelPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<UserDetailPage />} />
          <Route path="status-battery" element={<StatusBatteryPage />} />
          <Route
            path="status-battery/:id"
            element={<StatusBatteryDetailPage />}
          />
          <Route path="mood-entries" element={<MoodEntryPage />} />
          <Route path="mood-entries/:id" element={<MoodEntryDetailPage />} />
          <Route
            path="encouragement-results"
            element={<EncouragementResultPage />}
          />
          <Route
            path="encouragement-results/:id"
            element={<EncouragementResultDetailPage />}
          />
          <Route
            path="social-battery-logs"
            element={<SocialBatteryLogsPage />}
          />
          <Route
            path="social-battery-logs/:id"
            element={<SocialBatteryLogsDetailPage />}
          />
          <Route path="settings" element={<AdminSettingPage />} />
          <Route
            path="settings/change-password"
            element={<ChangePasswordAdmin />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
