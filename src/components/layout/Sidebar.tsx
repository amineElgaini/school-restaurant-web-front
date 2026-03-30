import { Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { hasPermission, hasRole } from "../../utils/permissions";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="min-h-screen w-64 border-r bg-white p-4">
      <nav className="space-y-2">
        <Link to="/" className="block rounded px-3 py-2 hover:bg-gray-100">
          Home
        </Link>

        {hasRole(user, "admin") && (
          <Link to="/admin/users" className="block rounded px-3 py-2 hover:bg-gray-100">
            Manage Users
          </Link>
        )}

        {hasPermission(user, "manage_meals") && (
          <Link to="/staff/meals" className="block rounded px-3 py-2 hover:bg-gray-100">
            Meals
          </Link>
        )}

        {hasPermission(user, "manage_menu") && (
          <Link to="/staff/menu" className="block rounded px-3 py-2 hover:bg-gray-100">
            Menu
          </Link>
        )}

        {hasPermission(user, "view_reservations") && (
          <Link
            to="/staff/reservations"
            className="block rounded px-3 py-2 hover:bg-gray-100"
          >
            Reservations
          </Link>
        )}

        {hasPermission(user, "reserve_meals") && (
          <Link
            to="/student/reservations"
            className="block rounded px-3 py-2 hover:bg-gray-100"
          >
            My Reservations
          </Link>
        )}

        {hasPermission(user, "submit_complaints") && (
          <Link
            to="/student/complaints"
            className="block rounded px-3 py-2 hover:bg-gray-100"
          >
            Complaints
          </Link>
        )}
      </nav>
    </aside>
  );
}