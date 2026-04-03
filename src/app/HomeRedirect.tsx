import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { hasPermission, hasRole } from "../utils/permissions";

export default function HomeRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (hasRole(user, "admin")) {
    return <Navigate to="/admin/users" replace />;
  }

  if (hasPermission(user, "view_reservations")) {
    return <Navigate to="/staff/reservations" replace />;
  }

  if (hasPermission(user, "manage_menu")) {
    return <Navigate to="/staff/menu" replace />;
  }

  if (hasPermission(user, "manage_meals")) {
    return <Navigate to="/staff/meals" replace />;
  }

  if (hasPermission(user, "reserve_meals")) {
    return <Navigate to="/student/reservations" replace />;
  }

  if (hasPermission(user, "submit_complaints")) {
    return <Navigate to="/student/complaints" replace />;
  }

  return <div className="p-6">No page available for your account.</div>;
}