import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUpload, FaFile, FaTrash, FaDownload } from 'react-icons/fa';
import { uploadFile, getFiles, deleteFile } from '../../store/slices/fileSlice';

const Files = () => {
  const dispatch = useDispatch();
  const { files, loading, error } = useSelector((state) => state.files);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    dispatch(getFiles());
  }, [dispatch]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      dispatch(uploadFile(file));
      setShowUploadModal(false);
    }
  };

  const handleDeleteFile = (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      dispatch(deleteFile(fileId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ddd6f3] to-[#faaca8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-200 shadow-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">My Files</h1>
            <button
              onClick={() => setShowUploadModal(true)}
              className="relative group inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-lg opacity-50"></span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-lg opacity-0 group-hover:opacity-100 blur transition-all duration-300"></span>
              <span className="relative flex items-center text-white">
                <FaUpload className="mr-2 h-4 w-4" />
                Upload File
              </span>
            </button>
          </div>
        </div>

        {/* Files List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-200 shadow-lg">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : files.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No files uploaded yet</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => (
                <div key={file._id} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-3">
                    <FaFile className="text-orange-500 text-xl" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{new Date(file.uploadedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(file.url, '_blank')}
                        className="text-gray-600 hover:text-orange-500 transition-colors"
                      >
                        <FaDownload />
                      </button>
                      <button
                        onClick={() => handleDeleteFile(file._id)}
                        className="text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Upload File</h2>
            <input
              type="file"
              onChange={handleFileUpload}
              className="w-full p-2 border rounded"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files; 