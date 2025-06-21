import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaFileAlt, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const UserFiles = () => {
  const { userId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scrollShadow, setScrollShadow] = useState(false);
  const navigate = useNavigate();
  const contentRef = useRef();

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_URL}/admin/files/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFiles(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user files');
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [userId, token]);

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
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10"
      >
        <div className="fixed top-0 left-0 w-full h-24 pointer-events-none" style={{ background: scrollShadow ? 'linear-gradient(to bottom, rgba(79,70,229,0.10), transparent)' : 'none', transition: 'background 0.3s' }} />
        <div ref={contentRef} className="p-6 max-w-4xl mx-auto min-h-screen overflow-y-auto" style={{ position: 'relative', zIndex: 10 }}>
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-all text-lg font-semibold"
          >
            <FaArrowLeft /> Back to Admin Dashboard
          </button>
          <h1 className="text-2xl font-bold mb-6 text-blue-800 drop-shadow">Files Uploaded by User</h1>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {loading ? (
            <div>Loading...</div>
          ) : files.length === 0 ? (
            <div className="text-gray-600">No files uploaded by this user.</div>
          ) : (
            <div className="bg-white bg-opacity-90 rounded shadow-lg p-4">
              <table className="min-w-full bg-white border rounded">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border text-left"><FaFileAlt className="inline mr-2 text-blue-500" />File Name</th>
                    <th className="px-4 py-2 border text-left"><FaCalendarAlt className="inline mr-2 text-green-600" />Upload Date</th>
                    <th className="px-4 py-2 border text-left">File ID</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, idx) => (
                    <motion.tr
                      key={file._id}
                      className="text-center hover:bg-blue-50 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <td className="px-4 py-2 border text-left">{file.originalname || file.filename}</td>
                      <td className="px-4 py-2 border text-left">{new Date(file.uploadedAt || file.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-2 border text-left">{file._id}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UserFiles; 