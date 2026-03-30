import { Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { hasPermission, hasRole } from "../../utils/permissions";
import Button from "../ui/Button";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-4">
      <h1 className="text-xl font-bold">Cafeteria</h1>

      <nav className="flex items-center gap-4">
        <Link to="/">Home</Link>

        {hasRole(user, "admin") && (
          <Link to="/admin/users">Users</Link>
        )}

        {hasPermission(user, "manage_meals") && (
          <Link to="/staff/meals">Meals</Link>
        )}

        {hasPermission(user, "manage_menu") && (
          <Link to="/staff/menu">Menu</Link>
        )}

        {hasPermission(user, "view_reservations") && (
          <Link to="/staff/reservations">Reservations</Link>
        )}

        {hasPermission(user, "reserve_meals") && (
          <Link to="/student/reservations">My Meals</Link>
        )}

        {hasPermission(user, "submit_complaints") && (
          <Link to="/student/complaints">Complaints</Link>
        )}
      </nav>

      <div className="flex items-center gap-4">
        {user && (
          <div className="text-sm text-right">
            <p className="font-medium">{user.name}</p>
            <p className="text-gray-500">{user.role?.name}</p>
          </div>
        )}

        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}