import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";
import { hasRole } from "../utils/permissions";

type RequireRoleProps = {
  role: string;
};

export default function RequireRole({ role }: RequireRoleProps) {
  const { user } = useAuth();

  if (!hasRole(user, role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}