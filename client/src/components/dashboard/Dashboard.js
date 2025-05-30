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
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FileSpreadsheet}
            title="Total Files"
            value={files.length}
            change={10}
            color="bg-gradient-to-r from-blue-600 to-blue-700"
          />
          <StatCard
            icon={BarChart3}
            title="Analyses"
            value={files.length}
            change={15}
            color="bg-gradient-to-r from-teal-600 to-teal-700"
          />
          <StatCard
            icon={TrendingUp}
            title="Growth"
            value="24%"
            change={8}
            color="bg-gradient-to-r from-emerald-600 to-emerald-700"
          />
          <StatCard
            icon={Zap}
            title="Active Users"
            value="1.2k"
            change={12}
            color="bg-gradient-to-r from-cyan-600 to-cyan-700"
          />
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            <button 
              onClick={() => dispatch(getUserFiles())}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
              <span>Refresh</span>
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
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
                    <p className="text-sm text-gray-600">
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
              <p className="text-gray-600">No recent activity.</p>
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Charts</h2>
          {recentFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentFiles.map((file) => (
                <Link
                  key={file._id}
                  to={`/analytics/${file._id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {file.originalName}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
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
              <p className="text-gray-600">No charts available yet.</p>
              <Link
                to="/upload"
                className="mt-2 inline-block text-blue-600 hover:text-blue-700"
              >
                Upload a file to generate charts
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 