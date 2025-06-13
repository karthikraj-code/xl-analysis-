import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserFiles } from '../../store/slices/filesSlice';
import { 
  FileSpreadsheet, 
  BarChart3, 
  TrendingUp, 
  Zap,
  RefreshCw,
  ArrowRight
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
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mb-2">{value}</p>
          <div className={`flex items-center text-sm ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${change < 0 ? 'rotate-180' : ''}`} />
            <span>{Math.abs(change)}% from last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome to Excel Analytics</h1>
          <p className="text-gray-600 mt-1">Track your data analytics and insights in one place</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FileSpreadsheet}
            title="Total Files"
            value={files.length}
            change={10}
            color="bg-blue-500"
          />
          <StatCard
            icon={BarChart3}
            title="Analyses"
            value={files.length}
            change={15}
            color="bg-indigo-500"
          />
          <StatCard
            icon={TrendingUp}
            title="Growth"
            value="24%"
            change={8}
            color="bg-emerald-500"
          />
          <StatCard
            icon={Zap}
            title="Active Users"
            value="1.2k"
            change={12}
            color="bg-cyan-500"
          />
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button 
                onClick={() => dispatch(getUserFiles())}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
            </div>
          ) : recentFiles.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentFiles.map((file) => (
                <div key={file._id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{file.originalName}</p>
                      <p className="text-sm text-gray-500">
                        Uploaded on {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700">
                      Analyzed
                    </span>
                    <Link
                      to={`/analytics/${file._id}`}
                      className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Analysis
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No recent activity.</p>
            </div>
          )}
        </div>

        {/* Recent Charts Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Charts</h2>
          </div>
          {recentFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {recentFiles.map((file) => (
                <Link
                  key={file._id}
                  to={`/analytics/${file._id}`}
                  className="block p-4 border border-gray-100 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {file.originalName}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {file.columns?.length || 0} columns analyzed
                  </div>
                  <div className="mt-2 flex items-center text-sm text-blue-600">
                    View Charts
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No charts available yet.</p>
              <Link
                to="/upload"
                className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                Upload a file to generate charts
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 