import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import Login from './pages/Login';
import ManageUsers from './pages/ManageUsers.tsx';
import Unauthorized from './pages/Unauthorized.tsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Dashboard accessible to both 'user' and 'admin' */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={['user', 'admin']}>
              <ManageUsers />
            </PrivateRoute>
          }
        />

        {/* Admin page only for admin role with permission 'manage_admin' */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={['admin']} permissions={['manage_admin']}>
              <ManageUsers />
            </PrivateRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />      </Routes>
    </div>
  );
}

export default App;