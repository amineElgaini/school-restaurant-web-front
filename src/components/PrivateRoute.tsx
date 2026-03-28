import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, roles, permissions }) {
  const token = localStorage.getItem('token');
  const userRoles = JSON.parse(localStorage.getItem('role') || '[]');
  const userPermissions = JSON.parse(localStorage.getItem('permissions') || '[]');

  if (!token) return <Navigate to="/login" replace />;

  // Check role
  if (roles && !roles.some(r => userRoles.includes(r))) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check permissions
  if (permissions && !permissions.every(p => userPermissions.includes(p))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default PrivateRoute;