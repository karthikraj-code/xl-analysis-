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
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20">
            <div className="text-center text-red-400">
              <p className="text-xl font-semibold mb-2">Error Loading Profile</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20">
            <div className="text-center text-gray-400">
              <p className="text-xl font-semibold mb-2">No User Data Found</p>
              <p>Please try logging in again.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
            <div className="relative">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover border-4 border-white/20 shadow-lg"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg border-4 border-white/20">
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
              <h2 className="text-3xl font-bold text-white mb-2">{user?.name || 'User'}</h2>
              <p className="text-gray-300 mb-1">{user?.email || 'No email provided'}</p>
              <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30">
                {user?.role?.toUpperCase() || 'USER'}
              </span>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-3">
                <FaKey className="h-4 w-4 text-white" />
              </span>
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <FaUser className="h-4 w-4 text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-400">Name</p>
                </div>
                <p className="text-white ml-11">{user?.name || 'Not provided'}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <FaEnvelope className="h-4 w-4 text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-400">Email</p>
                </div>
                <p className="text-white ml-11">{user?.email || 'Not provided'}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <FaUserTag className="h-4 w-4 text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-400">Role</p>
                </div>
                <p className="text-white ml-11 capitalize">{user?.role || 'User'}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <FaKey className="h-4 w-4 text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-400">Account Type</p>
                </div>
                <p className="text-white ml-11">
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