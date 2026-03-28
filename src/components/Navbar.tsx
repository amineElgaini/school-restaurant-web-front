import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const role = JSON.parse(localStorage.getItem('role') || '[]');
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      {role.includes('admin') && permissions.includes('manage_admin') && (
        <Link to="/admin">Admin</Link>
      )}
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

export default Navbar;