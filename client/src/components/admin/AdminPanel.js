import React, { useRef, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { getProfile } from '../../store/slices/authSlice';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

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
      toast.success('Profile picture updated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center py-20">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <div className="mb-8">
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
            <label htmlFor="admin-profile-pic-upload" className="h-6 w-6 rounded-full bg-white flex items-center justify-center cursor-pointer">
              <FaUser className="h-3 w-3 text-blue-600" />
              <input
                id="admin-profile-pic-upload"
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
        <div className="text-center mt-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{user?.name || 'Admin'}</h2>
          <p className="text-gray-600 mb-1">{user?.email || 'No email provided'}</p>
          <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {user?.role?.toUpperCase() || 'ADMIN'}
          </span>
        </div>
      </div>
      <p className="mt-4 text-gray-600">Admin features coming soon.</p>
    </div>
  );
};

export default AdminPanel; 