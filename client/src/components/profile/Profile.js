import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaUser, FaEnvelope, FaUserTag, FaKey } from 'react-icons/fa';
import { getProfile } from '../../store/slices/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-red-600">
          <p className="text-xl font-semibold mb-2">Error Loading Profile</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-gray-600">
          <p className="text-xl font-semibold">No User Data Found</p>
          <p>Please try logging in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-orange-200">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
            <div className="relative">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover border-4 border-orange-200 shadow-lg"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center shadow-lg border-4 border-orange-200">
                  <FaUser className="h-16 w-16 text-white" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-2 shadow-lg">
                <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                  <FaUser className="h-3 w-3 text-emerald-600" />
                </div>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{user?.name || 'User'}</h2>
              <p className="text-gray-600 mb-1">{user?.email || 'No email provided'}</p>
              <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-800 border border-orange-500/30">
                {user?.role?.toUpperCase() || 'USER'}
              </span>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white/80 rounded-xl p-6 border border-orange-200 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center mr-3">
                <FaKey className="h-4 w-4 text-white" />
              </span>
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-orange-200 hover:border-orange-300 transition-colors shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-orange-500/20 to-yellow-500/20 flex items-center justify-center">
                    <FaUser className="h-4 w-4 text-orange-800" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Name</p>
                </div>
                <p className="text-gray-800 ml-11">{user?.name || 'Not provided'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-orange-200 hover:border-orange-300 transition-colors shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-orange-500/20 to-yellow-500/20 flex items-center justify-center">
                    <FaEnvelope className="h-4 w-4 text-orange-800" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                </div>
                <p className="text-gray-800 ml-11">{user?.email || 'Not provided'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-orange-200 hover:border-orange-300 transition-colors shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-orange-500/20 to-yellow-500/20 flex items-center justify-center">
                    <FaUserTag className="h-4 w-4 text-orange-800" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Role</p>
                </div>
                <p className="text-gray-800 ml-11 capitalize">{user?.role || 'User'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-orange-200 hover:border-orange-300 transition-colors shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-orange-500/20 to-yellow-500/20 flex items-center justify-center">
                    <FaKey className="h-4 w-4 text-orange-800" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Account Type</p>
                </div>
                <p className="text-gray-800 ml-11">
                  {user?.googleId ? 'Google Account' : user?.githubId ? 'GitHub Account' : 'Email Account'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 