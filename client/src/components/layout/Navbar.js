import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { FaUser, FaUpload, FaChartBar, FaFolder, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getNavLinkClasses = (path) => {
    const baseClasses = "relative group inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300";
    const activeClasses = isActive(path) ? "ring-2 ring-white/50" : "";
    return `${baseClasses} ${activeClasses}`;
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="relative">
                  <span className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></span>
                  <span className="relative inline-block text-2xl font-bold bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent font-mono tracking-wider">
                    EXCEL ANALYSIS PLATFORM
                  </span>
                </div>
              </Link>
            </div>
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/dashboard"
                  className={getNavLinkClasses('/dashboard')}
                >
                  <span className={`absolute inset-0 w-full h-full bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 rounded-lg ${isActive('/dashboard') ? 'opacity-100' : 'opacity-50'}`}></span>
                  <span className={`absolute inset-0 w-full h-full bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600 rounded-lg opacity-0 group-hover:opacity-100 blur transition-all duration-300 ${isActive('/dashboard') ? 'opacity-100' : ''}`}></span>
                  <span className="relative flex items-center text-white">
                    <FaChartBar className="mr-2 h-4 w-4" />
                    Dashboard
                  </span>
                </Link>
                <Link
                  to="/upload"
                  className={getNavLinkClasses('/upload')}
                >
                  <span className={`absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg ${isActive('/upload') ? 'opacity-100' : 'opacity-50'}`}></span>
                  <span className={`absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg opacity-0 group-hover:opacity-100 blur transition-all duration-300 ${isActive('/upload') ? 'opacity-100' : ''}`}></span>
                  <span className="relative flex items-center text-white">
                    <FaUpload className="mr-2 h-4 w-4" />
                    Upload
                  </span>
                </Link>
                <Link
                  to="/files"
                  className={getNavLinkClasses('/files')}
                >
                  <span className={`absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-lg ${isActive('/files') ? 'opacity-100' : 'opacity-50'}`}></span>
                  <span className={`absolute inset-0 w-full h-full bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 rounded-lg opacity-0 group-hover:opacity-100 blur transition-all duration-300 ${isActive('/files') ? 'opacity-100' : ''}`}></span>
                  <span className="relative flex items-center text-white">
                    <FaFolder className="mr-2 h-4 w-4" />
                    Files
                  </span>
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={getNavLinkClasses('/admin')}
                  >
                    <span className={`absolute inset-0 w-full h-full bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 rounded-lg ${isActive('/admin') ? 'opacity-100' : 'opacity-50'}`}></span>
                    <span className={`absolute inset-0 w-full h-full bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 rounded-lg opacity-0 group-hover:opacity-100 blur transition-all duration-300 ${isActive('/admin') ? 'opacity-100' : ''}`}></span>
                    <span className="relative flex items-center text-white">
                      <FaUser className="mr-2 h-4 w-4" />
                      Admin
                    </span>
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 text-gray-700 hover:text-gray-900 ${isActive('/profile') ? 'text-blue-600' : ''}`}
                >
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className={`h-8 w-8 rounded-full object-cover ${isActive('/profile') ? 'ring-2 ring-blue-500' : ''}`}
                    />
                  ) : (
                    <div className={`h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ${isActive('/profile') ? 'ring-2 ring-blue-500' : ''}`}>
                      <FaUser className="h-4 w-4 text-gray-500" />
                    </div>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="relative group inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 rounded-lg"></span>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 rounded-lg opacity-0 group-hover:opacity-100 blur transition-all duration-300"></span>
                  <span className="relative flex items-center text-white">
                    <FaSignOutAlt className="mr-2 h-4 w-4" />
                    Logout
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`text-gray-500 hover:text-gray-700 text-sm font-medium ${isActive('/login') ? 'text-blue-600' : ''}`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/register') ? 'ring-2 ring-blue-500' : ''}`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 