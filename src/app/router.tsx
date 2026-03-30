import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import RequirePermission from "../auth/RequirePermission";
import RequireRole from "../auth/RequireRole";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/auth/LoginPage";

function HomePage() {
  return <div>Welcome</div>;
}

function UsersPage() {
  return <div>Admin Users Page</div>;
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

function StudentReservationPage() {
  return <div>Student Reservation Page</div>;
}

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
                element: <StudentReservationPage />,
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