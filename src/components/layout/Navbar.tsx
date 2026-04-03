import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { hasPermission, hasRole } from "../../utils/permissions";
import Button from "../ui/Button";

type NavItem = {
  to: string;
  label: string;
  show: boolean;
};

export default function Navbar() {
  const { user, logout } = useAuth();

  const navItems: NavItem[] = [
    // {
    //   to: "/",
    //   label: "Home",
    //   show: true,
    // },
    {
      to: "/admin/users",
      label: "Users",
      show: hasRole(user, "admin"),
    },
    {
      to: "/admin/complaints",
      label: "Complaints",
      show: hasRole(user, "admin"),
    },
    {
      to: "/staff/meals",
      label: "Meals",
      show: hasPermission(user, "manage_meals"),
    },
    {
      to: "/staff/menu",
      label: "Menu",
      show: hasPermission(user, "manage_menu"),
    },
    {
      to: "/staff/reservations",
      label: "Reservations",
      show: hasPermission(user, "view_reservations"),
    },
    {
      to: "/student/reservations",
      label: "My Reservations",
      show: hasPermission(user, "reserve_meals"),
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <NavLink
            to="/"
            className="text-xl font-bold tracking-tight text-slate-800"
          >
            Cafeteria
          </NavLink>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems
              .filter((item) => item.show)
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-lg px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs capitalize text-slate-500">
                {user.role?.name || "No role"}
              </p>
            </div>
          )}

          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 py-3 md:hidden">
        <nav className="flex flex-wrap gap-2">
          {navItems
            .filter((item) => item.show)
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
        </nav>
      </div>
    </header>
  );
}