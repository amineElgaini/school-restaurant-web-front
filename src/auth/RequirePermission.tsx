import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";
import { hasPermission } from "../utils/permissions";

type RequirePermissionProps = {
  permission: string;
};

export default function RequirePermission({
  permission,
}: RequirePermissionProps) {
  const { user } = useAuth();

  if (!hasPermission(user, permission)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}