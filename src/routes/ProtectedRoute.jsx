import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  refreshAccessToken,
  getCurrentUser,
  isAuthenticated,
} from "../services/authService";

function ProtectedRoute({ children }) {
  const location = useLocation();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [allowed, setAllowed] = useState(false);
  // const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        // kalau belum ada access token → coba refresh
        if (!isAuthenticated()) {
          await refreshAccessToken();
        }

        // const user = getCurrentUser();

        // setRole(user?.role || null);
        // setAllowed(true);

        const currentUser = getCurrentUser();

        setUser(currentUser);
        setAllowed(true);
      } catch {
        setAllowed(false);
      } finally {
        setCheckingAuth(false);
      }
    }

    checkAuth();
  }, []);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const isOnboardingRequired =
    user?.role === "user" && !user?.onboardingCompleted;

  if (isOnboardingRequired && location.pathname !== "/user/mood") {
    return <Navigate to="/user/mood" replace />;
  }

  return children;
}

export default ProtectedRoute;
