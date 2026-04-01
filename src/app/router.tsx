import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import RequirePermission from "../auth/RequirePermission";
import RequireRole from "../auth/RequireRole";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/auth/LoginPage";
import ReservationPage from "../pages/student/ReservationPage";

import UsersPage from "../pages/admin/UsersPage";

function HomePage() {
  return <div>Welcome</div>;
}

function MealsPage() {
  return <div>Staff Meals Page</div>;
}

function MenuPage() {
  return <div>Staff Menu Page</div>;
}

function ReservationsPage() {
  return <div>Staff Reservations Page</div>;
}

// function ReservationPage() {
//   return <div>Student Reservation Page</div>;
// }

function ComplaintsPage() {
  return <div>Student Complaints Page</div>;
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
          {
            element: <RequirePermission permission="submit_complaints" />,
            children: [
              {
                path: "/student/complaints",
                element: <ComplaintsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);