import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { hasPermission, hasRole } from "../../utils/permissions";
import restaurantLogo from "../../assets/logo.png";
import Button from "../ui/Button";

type NavItem = {
  to: string;
  label: string;
  show: boolean;
};

export default function Navbar() {
  const { user, logout } = useAuth();

  const navItems: NavItem[] = [
    {
      to: "/admin/statistics",
      label: "Statistics",
      show: hasRole(user, "admin"),
    },
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
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-10">
          <NavLink
            to="/"
            className="group flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900"
          >
            {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200"> */}
              <img
                src={restaurantLogo}
                alt="YouCode School Restaurant Logo"
                style={{ width: "100px", height: "auto" }}
              />
            {/* </div> */}
            <span className="hidden sm:inline font-display">DevDine</span>
          </NavLink>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems
              .filter((item) => item.show)
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          {user && (
            <div className="hidden items-center gap-3 lg:flex">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 overflow-hidden">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-sm"
                    />
                  ) : (
                    user.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900 leading-none">
                  {user.name}
                </p>
                <p className="mt-1 text-xs font-medium capitalize text-slate-500">
                  {user.role?.name || "Student"}
                </p>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-slate-500 hover:text-red-600 hover:bg-red-50"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="overflow-x-auto border-t border-slate-100 px-4 py-3 lg:hidden">
        <nav className="flex items-center gap-2 whitespace-nowrap">
          {navItems
            .filter((item) => item.show)
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
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
