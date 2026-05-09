import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  refreshAccessToken,
  getCurrentUser,
  isAuthenticated,
} from "../services/authService";

function ProtectedRoute({ children }) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        // kalau belum ada access token → coba refresh
        if (!isAuthenticated()) {
          await refreshAccessToken();
        }

        const user = getCurrentUser();

        setRole(user?.role || null);
        setAllowed(true);
      } catch  {
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

  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;
