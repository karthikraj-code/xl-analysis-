import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import FileUpload from './components/files/FileUpload';
import Files from './components/files/Files';
import Analytics from './components/analytics/Analytics';
import AdminPanel from './components/admin/AdminPanel';
import AuthCallback from './components/auth/AuthCallback';
import Profile from './components/profile/Profile';
import LandingPage from './components/LandingPage';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const publicPaths = ['/login', '/register'];
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // If it's a login or register page, don't add the sidebar
  if (publicPaths.includes(location.pathname)) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  // For all other pages (including landing page), add the sidebar
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex justify-center items-center py-4 bg-white shadow-sm">
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
          EXCEL ANALYTICS PLATFORM
        </Link>
      </div>
      <main 
        className={`transition-all duration-300 ease-in-out p-8 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {children}
      </main>
    </div>
  );
};

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Layout>
        <Toaster />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <FileUpload />
              </PrivateRoute>
            }
          />
          <Route
            path="/files"
            element={
              <PrivateRoute>
                <Files />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics/:fileId"
            element={
              <PrivateRoute>
                <Analytics />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
