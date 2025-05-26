import React, { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Transition } from '@headlessui/react';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-600">Excel Analytics</span>
            </Link>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-3 py-2 text-gray-700 hover:text-primary-600"
                >
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className="px-3 py-2 text-gray-700 hover:text-primary-600"
                >
                  Upload
                </Link>
                <Link
                  to="/files"
                  className="px-3 py-2 text-gray-700 hover:text-primary-600"
                >
                  Files
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-3 py-2 text-gray-700 hover:text-primary-600"
                  >
                    Admin
                  </Link>
                )}

                <Menu as="div" className="ml-3 relative">
                  <Menu.Button className="flex items-center text-gray-700 hover:text-primary-600">
                    <span className="mr-2">{user?.name}</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-gray-700 hover:text-primary-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 text-gray-700 hover:text-primary-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 