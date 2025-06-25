import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaUser, FaEnvelope, FaUserTag, FaKey } from 'react-icons/fa';
import { getProfile } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Profile pic should be less than 10MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/profile-picture', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      dispatch(getProfile());
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-red-600">
          <p className="text-xl font-semibold mb-2">Error Loading Profile</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-gray-600">
          <p className="text-xl font-semibold">No User Data Found</p>
          <p>Please try logging in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg border-4 border-blue-100">
                  <FaUser className="h-16 w-16 text-white" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-2 shadow-lg cursor-pointer">
                <label htmlFor="profile-pic-upload" className="h-6 w-6 rounded-full bg-white flex items-center justify-center cursor-pointer">
                  <FaUser className="h-3 w-3 text-blue-600" />
                  <input
                    id="profile-pic-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleProfilePicChange}
                    ref={fileInputRef}
                    disabled={uploading}
                  />
                </label>
              </div>
              {uploading && <div className="text-xs text-blue-600 mt-2">Uploading...</div>}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{user?.name || 'User'}</h2>
              <p className="text-gray-600 mb-1">{user?.email || 'No email provided'}</p>
              <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {user?.role?.toUpperCase() || 'USER'}
              </span>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-3">
              <FaKey className="h-4 w-4 text-white" />
            </span>
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FaUser className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-600">Name</p>
              </div>
              <p className="text-gray-900 ml-11">{user?.name || 'Not provided'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FaEnvelope className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-600">Email</p>
              </div>
              <p className="text-gray-900 ml-11">{user?.email || 'Not provided'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FaUserTag className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-600">Role</p>
              </div>
              <p className="text-gray-900 ml-11 capitalize">{user?.role || 'User'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FaKey className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-600">Account Type</p>
              </div>
              <p className="text-gray-900 ml-11">
                {user?.googleId ? 'Google Account' : user?.githubId ? 'GitHub Account' : 'Email Account'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 