import { Navigate } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../services/authService";

export default function AdminRoute({ children }) {
  const user = getCurrentUser();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/user" replace />;
  }

  return children;
}
