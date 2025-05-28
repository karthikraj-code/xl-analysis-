import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserFiles } from '../../store/slices/filesSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { files, loading } = useSelector((state) => state.files);

  useEffect(() => {
    dispatch(getUserFiles());
  }, [dispatch]);

  // Get the 5 most recently uploaded files by creating a new array before sorting
  const recentFiles = [...files]
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-4 text-gray-600">Welcome to your dashboard.</p>
      </div>

      {/* Recently Uploaded Files Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recently Uploaded Files</h2>
          <Link
            to="/files"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All Files
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : recentFiles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentFiles.map((file) => (
                  <tr key={file._id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {file.originalName}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(file.uploadedAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/analytics/${file._id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View Analysis
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No files uploaded yet.</p>
            <Link
              to="/upload"
              className="mt-2 inline-block text-primary-600 hover:text-primary-700"
            >
              Upload your first file
            </Link>
          </div>
        )}
      </div>

      {/* Recent Charts Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Charts</h2>
          <Link
            to="/analytics"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All Charts
          </Link>
        </div>
        
        {recentFiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentFiles.map((file) => (
              <Link
                key={file._id}
                to={`/analytics/${file._id}`}
                className="block p-4 border rounded-lg hover:border-primary-500 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {file.originalName}
                </div>
                <div className="text-xs text-gray-500">
                  {file.columns?.length || 0} columns
                </div>
                <div className="mt-2 text-xs text-primary-600">
                  View Charts →
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No charts available yet.</p>
            <Link
              to="/upload"
              className="mt-2 inline-block text-primary-600 hover:text-primary-700"
            >
              Upload a file to generate charts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 