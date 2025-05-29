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
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FileSpreadsheet}
            title="Total Files"
            value={files.length}
            change={10}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            icon={BarChart3}
            title="Analyses"
            value={files.length}
            change={15}
            color="bg-gradient-to-r from-teal-500 to-teal-600"
          />
          <StatCard
            icon={TrendingUp}
            title="Growth"
            value="24%"
            change={8}
            color="bg-gradient-to-r from-emerald-500 to-emerald-600"
          />
          <StatCard
            icon={Zap}
            title="Active Users"
            value="1.2k"
            change={12}
            color="bg-gradient-to-r from-cyan-500 to-cyan-600"
          />
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <button 
              onClick={() => dispatch(getUserFiles())}
              className="flex items-center space-x-2 text-gray-300 hover:text-white font-medium transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : recentFiles.length > 0 ? (
            <div className="space-y-4">
              {recentFiles.map((file) => (
                <div key={file._id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{file.originalName}</p>
                    <p className="text-sm text-gray-300">
                      Uploaded on {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400">
                    Analyzed
                  </div>
                  <Link
                    to={`/analytics/${file._id}`}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    View Analysis
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No recent activity.</p>
            </div>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h2 className="text-xl font-bold text-white mb-6">Recent Charts</h2>
          {recentFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentFiles.map((file) => (
                <Link
                  key={file._id}
                  to={`/analytics/${file._id}`}
                  className="block p-4 border border-white/10 rounded-lg hover:border-blue-500/50 transition-colors bg-white/5 hover:bg-white/10"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-sm font-medium text-white">
                      {file.originalName}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {file.columns?.length || 0} columns
                  </div>
                  <div className="mt-2 text-xs text-blue-400">
                    View Charts →
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No charts available yet.</p>
              <Link
                to="/upload"
                className="mt-2 inline-block text-blue-400 hover:text-blue-300"
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