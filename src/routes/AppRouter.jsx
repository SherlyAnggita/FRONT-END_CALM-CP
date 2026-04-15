import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/User/HomePage";
import ProfilePage from "../pages/User/ProfilePage";
import MoodJarPage from "../pages/User/MoodJarPage";

import UserLayout from "../layouts/User/UserLayout";
import { tokenStorage } from "../lib/token";

function ProtectedRoute({ children }) {
  const accessToken = tokenStorage.getAccessToken();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function GuestRoute({ children }) {
  const accessToken = tokenStorage.getAccessToken();

  if (accessToken) {
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
