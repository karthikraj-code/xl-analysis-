import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile } from '../../store/slices/filesSlice';

const FileUpload = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.files);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

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
      alert('Please upload a valid Excel file (.xls, .xlsx) or CSV file (.csv)');
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
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Upload Excel File</h2>
        
        <form onSubmit={handleSubmit}>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".xls,.xlsx,.csv"
              onChange={handleChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Choose File
            </label>
            <p className="mt-2 text-sm text-gray-500">
              or drag and drop your Excel file here
            </p>
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: {file.name}
              </p>
            )}
          </div>

          {error && (
            <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={!file || loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileUpload; 