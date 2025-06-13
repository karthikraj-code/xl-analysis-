import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../../store/slices/filesSlice';
import { toast } from 'react-hot-toast';
import { FaFileExcel, FaCloudUploadAlt, FaArrowRight } from 'react-icons/fa';

const FileUpload = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.files);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (success?.upload) {
      toast.success('File uploaded successfully!', {
        duration: 2000,
        position: 'top-center',
      });
      setTimeout(() => {
        navigate('/files');
      }, 2000);
    }
  }, [success?.upload, navigate]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (isValidFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const isValidFile = (file) => {
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/csv'
    ];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid Excel file (.xls, .xlsx) or CSV file (.csv)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      dispatch(uploadFile(file));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Upload Excel File</h1>
          <p className="mt-2 text-gray-600">Upload your Excel or CSV file for analysis</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-blue-50 rounded-full">
                      <FaCloudUploadAlt className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept=".xls,.xlsx,.csv"
                      onChange={handleChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Choose File
                    </label>
                    <p className="text-sm text-gray-500">
                      or drag and drop your Excel file here
                    </p>
                  </div>

                  {file && (
                    <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-md">
                      <FaFileExcel className="h-5 w-5 text-emerald-500" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="mt-4 text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={!file || loading}
                  className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Upload File</span>
                      <FaArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Supported Formats</h3>
            <p className="text-sm text-gray-600">Excel (.xls, .xlsx) and CSV files</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-2">File Size</h3>
            <p className="text-sm text-gray-600">Maximum file size: 10MB</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Data Privacy</h3>
            <p className="text-sm text-gray-600">Your data is secure and private</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload; 