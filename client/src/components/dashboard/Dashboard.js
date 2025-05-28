import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserFiles } from '../../store/slices/filesSlice';
import { 
  FileSpreadsheet, 
  BarChart3, 
  TrendingUp, 
  Zap,
  RefreshCw
} from 'lucide-react';

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

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${change < 0 ? 'rotate-180' : ''}`} />
            <span>{Math.abs(change)}% from last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FileSpreadsheet}
          title="Total Files"
          value={files.length.toString()}
          change={12}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          icon={BarChart3}
          title="Analyzed Data"
          value="1.2M"
          change={8}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatCard
          icon={Zap}
          title="Insights Generated"
          value="156"
          change={23}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <StatCard
          icon={TrendingUp}
          title="Data Accuracy"
          value="98.5%"
          change={2}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <button 
            onClick={() => dispatch(getUserFiles())}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : recentFiles.length > 0 ? (
          <div className="space-y-4">
            {recentFiles.map((file) => (
              <div key={file._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{file.originalName}</p>
                  <p className="text-sm text-gray-500">
                    Uploaded on {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Analyzed
                </div>
                <Link
                  to={`/analytics/${file._id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Analysis
                </Link>
              </div>
            ))}
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
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Charts</h2>
          <Link
            to="/analytics"
            className="text-blue-600 hover:text-blue-700 font-medium"
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
                className="block p-4 border rounded-lg hover:border-blue-200 transition-colors bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {file.originalName}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {file.columns?.length || 0} columns
                </div>
                <div className="mt-2 text-xs text-blue-600">
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