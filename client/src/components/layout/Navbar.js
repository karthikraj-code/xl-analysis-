import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { FaChartLine, FaUpload, FaFileAlt, FaSignInAlt, FaUserPlus, FaBars, FaTimes, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Navbar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const publicPaths = ['/login', '/register'];
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // If it's a login or register page, don't show the sidebar
  if (publicPaths.includes(location.pathname)) {
    return null;
  }

  const getNavLinkClasses = (path) => {
    const baseClasses = "flex items-center px-4 py-3.5 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200";
    const activeClasses = location.pathname === path 
      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700" 
      : "hover:text-blue-600";
    return `${baseClasses} ${activeClasses}`;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-50 
          ${isMobile 
            ? (isOpen ? 'w-64' : '-translate-x-full') 
            : (isOpen ? 'w-64' : 'w-16')
          } 
          flex flex-col`}
      >
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-4 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <FaTimes className="text-gray-600" /> : <FaBars className="text-gray-600" />}
        </button>

        {/* Navigation Links */}
        <nav className="mt-6 flex-grow overflow-y-auto">
          {isAuthenticated ? (
            <>
              <Link
                to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                className={getNavLinkClasses(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard')}
              >
                <FaChartLine className={`text-xl ${location.pathname === (user?.role === 'admin' ? '/admin/dashboard' : '/dashboard') ? 'text-white' : 'text-blue-500'}`} />
                {isOpen && <span className="ml-3 font-medium">Dashboard</span>}
              </Link>
              {user?.role !== 'admin' && (
                <>
                  <Link
                    to="/upload"
                    className={getNavLinkClasses('/upload')}
                  >
                    <FaUpload className={`text-xl ${location.pathname === '/upload' ? 'text-white' : 'text-blue-500'}`} />
                    {isOpen && <span className="ml-3 font-medium">Upload</span>}
                  </Link>
                  <Link
                    to="/files"
                    className={getNavLinkClasses('/files')}
                  >
                    <FaFileAlt className={`text-xl ${location.pathname === '/files' ? 'text-white' : 'text-blue-500'}`} />
                    {isOpen && <span className="ml-3 font-medium">Files</span>}
                  </Link>
                </>
              )}
              <Link
                to="/profile"
                className={getNavLinkClasses('/profile')}
              >
                <FaUser className={`text-xl ${location.pathname === '/profile' ? 'text-white' : 'text-blue-500'}`} />
                {isOpen && <span className="ml-3 font-medium">Profile</span>}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={getNavLinkClasses('/login')}
              >
                <FaSignInAlt className={`text-xl ${location.pathname === '/login' ? 'text-white' : 'text-blue-500'}`} />
                {isOpen && <span className="ml-3 font-medium">Login</span>}
              </Link>
              <Link
                to="/register"
                className={getNavLinkClasses('/register')}
              >
                <FaUserPlus className={`text-xl ${location.pathname === '/register' ? 'text-white' : 'text-blue-500'}`} />
                {isOpen && <span className="ml-3 font-medium">Register</span>}
              </Link>
            </>
          )}
        </nav>

        {/* Logout Button - Only show when authenticated */}
        {isAuthenticated && (
          <div className="border-t border-gray-200 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3.5 text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200"
            >
              <FaSignOutAlt className="text-xl text-red-500" />
              {isOpen && <span className="ml-3 font-medium">Logout</span>}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar; 