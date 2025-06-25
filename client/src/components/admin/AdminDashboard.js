import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaUsers, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({ userCount: 0, fileCount: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scrollShadow, setScrollShadow] = useState(false);
  const contentRef = useRef();
  const navigate = useNavigate();
  const [userGrowth, setUserGrowth] = useState([]);
  const [chartTypeUsage, setChartTypeUsage] = useState([]);

  // Helper for auth headers
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch stats, users
  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, authHeaders),
        axios.get(`${API_URL}/admin/users`, authHeaders),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user registration stats for analytics
  const fetchUserGrowth = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/user-registration-stats`, authHeaders);
      setUserGrowth(res.data);
    } catch (err) {
      // Optionally handle error
    }
  };

  // Fetch chart type usage for analytics
  const fetchChartTypeUsage = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/chart-type-usage`, authHeaders);
      setChartTypeUsage(res.data);
    } catch (err) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    fetchAll();
    fetchUserGrowth();
    fetchChartTypeUsage();
    // eslint-disable-next-line
  }, []);

  // Block/unblock user
  const handleBlock = async (userId) => {
    try {
      await axios.patch(`${API_URL}/admin/users/${userId}/block`, {}, authHeaders);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to block/unblock user');
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`, authHeaders);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        setScrollShadow(contentRef.current.scrollTop > 0);
      }
    };
    const ref = contentRef.current;
    if (ref) ref.addEventListener('scroll', handleScroll);
    return () => { if (ref) ref.removeEventListener('scroll', handleScroll); };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10"
      >
        <div className="fixed top-0 left-0 w-full h-32 pointer-events-none" style={{ background: scrollShadow ? 'linear-gradient(to bottom, rgba(79,70,229,0.12), transparent)' : 'none', transition: 'background 0.3s' }} />
        <div ref={contentRef} className="p-6 max-w-6xl mx-auto min-h-screen overflow-y-auto" style={{ position: 'relative', zIndex: 10 }}>
          <h1 className="text-3xl font-bold mb-4 text-blue-800 drop-shadow">Admin Dashboard</h1>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex space-x-8 mb-8"
              >
                <div className="bg-blue-100 rounded p-6 text-center shadow-lg flex-1 flex flex-col items-center">
                  <FaUsers className="text-3xl text-blue-500 mb-2" />
                  <div className="text-2xl font-bold">{stats.userCount}</div>
                  <div className="text-gray-700">Total Users</div>
                </div>
                <div className="bg-green-100 rounded p-6 text-center shadow-lg flex-1 flex flex-col items-center">
                  <FaFileAlt className="text-3xl text-green-500 mb-2" />
                  <div className="text-2xl font-bold">{stats.fileCount}</div>
                  <div className="text-gray-700">Files Analyzed</div>
                </div>
              </motion.div>

              {/* Users Table */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="overflow-x-auto mb-8 bg-white bg-opacity-90 rounded shadow-lg p-4"
              >
                <h2 className="text-xl font-semibold mb-2 text-blue-700">Users</h2>
                <table className="min-w-full bg-white border rounded">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">Name</th>
                      <th className="px-4 py-2 border">Email</th>
                      <th className="px-4 py-2 border">Role</th>
                      <th className="px-4 py-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="text-center hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-2 border">{user.name}</td>
                        <td className="px-4 py-2 border">{user.email}</td>
                        <td className="px-4 py-2 border">{user.role}</td>
                        <td className="px-4 py-2 border space-x-2">
                          <button
                            onClick={() => handleBlock(user._id)}
                            className={`px-2 py-1 rounded text-white ${user.role === 'blocked' ? 'bg-yellow-500' : 'bg-blue-600'} hover:opacity-80`}
                          >
                            {user.role === 'blocked' ? 'Unblock' : 'Block'}
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="px-2 py-1 rounded bg-red-600 text-white hover:opacity-80"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => navigate(`/admin/user/${user._id}/files`)}
                            className="px-2 py-1 rounded bg-green-600 text-white hover:opacity-80"
                          >
                            View Files
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>

              {/* User Growth Analytics Graph */}
              {userGrowth.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">User Growth Over Time</h3>
                  <Line
                    data={{
                      labels: userGrowth.map(stat => `${stat._id.month}/${stat._id.year}`),
                      datasets: [
                        {
                          label: 'Users Registered',
                          data: userGrowth.map(stat => stat.count),
                          fill: false,
                          borderColor: 'rgb(75, 192, 192)',
                          backgroundColor: 'rgba(75, 192, 192, 0.2)',
                          tension: 0.2,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: true },
                        title: { display: false },
                      },
                      scales: {
                        x: { title: { display: true, text: 'Month/Year' } },
                        y: { title: { display: true, text: 'Users Registered' }, beginAtZero: true },
                      },
                    }}
                    height={100}
                  />
                </div>
              )}

              {/* Most Used Chart Types Analytics Graph */}
              {chartTypeUsage.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Most Used Chart Types</h3>
                  <Bar
                    data={{
                      labels: chartTypeUsage.map(stat => stat._id),
                      datasets: [
                        {
                          label: 'Usage Count',
                          data: chartTypeUsage.map(stat => stat.count),
                          backgroundColor: 'rgba(54, 162, 235, 0.7)',
                          borderColor: 'rgb(54, 162, 235)',
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                        title: { display: false },
                      },
                      scales: {
                        x: { title: { display: true, text: 'Chart Type' } },
                        y: { title: { display: true, text: 'Usage Count' }, beginAtZero: true },
                      },
                    }}
                    height={100}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard; 