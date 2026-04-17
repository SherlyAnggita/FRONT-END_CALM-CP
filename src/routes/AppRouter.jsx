import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

// halaman user
import HomePage from "../pages/User/HomePage";
import ProfilePage from "../pages/User/ProfilePage";
import MoodJarPage from "../pages/User/MoodJarPage";
import CalendarEventPage from "../pages/User/CalendarEventPage";

import UserLayout from "../layouts/User/UserLayout";

// halaman admin
import AdminRoute from "../routes/AdminRoute";
import AdminHomePage from "../pages/Admin/AdminHomePage";
import ActivityPage from "../pages/Admin/ActivityLog/ActivityPage";
import MoodLabelPage from "../pages/Admin/MoodLabel/index";

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
              <LoginPage />
            </GuestRoute>
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />

        <Route path="/" element={<Navigate to="/user" replace />} />

        {/* halaman user */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="mood" element={<MoodJarPage />} />
          <Route path="calendar" element={<CalendarEventPage />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
