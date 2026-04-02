import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import RequirePermission from "../auth/RequirePermission";
import RequireRole from "../auth/RequireRole";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/auth/LoginPage";
import ReservationPage from "../pages/student/ReservationPage";

import UsersPage from "../pages/admin/UsersPage";
import MealsPage from "../pages/staff/MealsPage";
import MenuPage from "../pages/staff/MenuPage";
import ReservationsPage from "../pages/staff/ReservationsPage";
import ComplaintsPage from "../pages/complaints/ComplaintsPage";

function HomePage() {
  return <div>Welcome</div>;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },

          {
            element: <RequireRole role="admin" />,
            children: [
              {
                path: "/admin/users",
                element: <UsersPage />,
              },
              {
                path: "/student/complaints",
                element: <ComplaintsPage />,
              },
            ],
          },

          {
            element: <RequirePermission permission="manage_meals" />,
            children: [
              {
                path: "/staff/meals",
                element: <MealsPage />,
              },
            ],
          },
          {
            element: <RequirePermission permission="manage_menu" />,
            children: [
              {
                path: "/staff/menu",
                element: <MenuPage />,
              },
            ],
          },
          {
            element: <RequirePermission permission="view_reservations" />,
            children: [
              {
                path: "/staff/reservations",
                element: <ReservationsPage />,
              },
            ],
          },
          {
            element: <RequirePermission permission="reserve_meals" />,
            children: [
              {
                path: "/student/reservations",
                element: <ReservationPage />,
              },
            ],
          },
          // {
          //   element: <RequirePermission permission="submit_complaints" />,
          //   children: [
          //     {
          //       path: "/student/complaints",
          //       element: <ComplaintsPage />,
          //     },
          //   ],
          // },
        ],
      },
    ],
  },
]);