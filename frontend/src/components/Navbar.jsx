import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">
              📝 Task Manager
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-600">Welcome, </span>
              <span className="font-medium text-gray-900">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

