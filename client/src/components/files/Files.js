import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUpload, FaFile, FaTrash, FaChartBar } from 'react-icons/fa';
import { uploadFile, getUserFiles, deleteFile } from '../../store/slices/filesSlice';
import { toast } from 'react-hot-toast';

const Files = () => {
  const dispatch = useDispatch();
  const { files, loading, error } = useSelector((state) => state.files);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    dispatch(getUserFiles());
  }, [dispatch]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch(uploadFile(file));
      setShowUploadModal(false);
      toast.success('File uploaded successfully!');
    }
  };

  const handleDeleteFile = (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      dispatch(deleteFile(fileId));
      toast.success('File deleted successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Files List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">My Files</h2>
            <button
              onClick={() => setShowUploadModal(true)}
              className="relative group inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-lg opacity-50"></span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-lg opacity-0 group-hover:opacity-100 blur transition-all duration-300"></span>
              <span className="relative flex items-center text-white">
                <FaUpload className="mr-2 h-4 w-4" />
                Upload File
              </span>
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : files.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No files uploaded yet.</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                Upload your first file
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {files.map((file) => (
                <div key={file._id} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <FaFile className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">{file.originalName || file.name}</p>
                      <p className="text-sm text-gray-500">
                        Uploaded on {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link
                      to={`/analytics/${file._id}`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <FaChartBar className="w-4 h-4 mr-2" />
                      View Analysis
                    </Link>
                    <button
                      onClick={() => handleDeleteFile(file._id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                      title="Delete file"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Upload File</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Supported formats: .xls, .xlsx, .csv
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files; 