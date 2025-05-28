import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserFiles, deleteFile } from '../../store/slices/filesSlice';
import { toast } from 'react-hot-toast';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

const FileList = () => {
  const dispatch = useDispatch();
  const { files, loading, error, success } = useSelector((state) => state.files);

  useEffect(() => {
    dispatch(getUserFiles());
  }, [dispatch]);

  useEffect(() => {
    if (success?.delete) {
      toast.success('File deleted successfully!', {
        duration: 2000,
        position: 'top-center',
      });
    }
  }, [success?.delete]);

  const handleRefresh = () => {
    dispatch(getUserFiles());
  };

  const handleDelete = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      dispatch(deleteFile(fileId));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
        <button 
          onClick={handleRefresh}
          className="ml-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!files.length) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No files uploaded yet.</p>
        <Link
          to="/upload"
          className="mt-4 inline-block text-primary-600 hover:text-primary-700"
        >
          Upload your first file
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Files</h2>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                File Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Upload Date and time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Columns
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file) => (
              <tr key={file._id || file.id || Math.random().toString(36).substr(2, 9)}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {file.originalName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {file.uploadedAt ? new Date(file.uploadedAt).toLocaleString() : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {file.size ? (file.size / 1024).toFixed(2) : '0.00'} KB
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {file.columns?.length || 0} columns
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-4">
                    <Link
                      to={`/analytics/${file._id || file.id}`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      View Analysis
                    </Link>
                    <AlertDialog.Root>
                      <AlertDialog.Trigger asChild>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </AlertDialog.Trigger>
                      <AlertDialog.Portal>
                        <AlertDialog.Overlay className="fixed inset-0 bg-black/30" />
                        <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 max-w-md w-full">
                          <AlertDialog.Title className="text-lg font-semibold mb-2">
                            Delete File
                          </AlertDialog.Title>
                          <AlertDialog.Description className="text-sm text-gray-600 mb-4">
                            Are you sure you want to delete this file? This action cannot be undone.
                          </AlertDialog.Description>
                          <div className="flex justify-end space-x-2">
                            <AlertDialog.Cancel asChild>
                              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                Cancel
                              </button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                              <button
                                onClick={() => handleDelete(file._id || file.id)}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </AlertDialog.Action>
                          </div>
                        </AlertDialog.Content>
                      </AlertDialog.Portal>
                    </AlertDialog.Root>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileList; 