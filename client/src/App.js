import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
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
import AdminLogin from './components/auth/AdminLogin';
import AdminRegister from './components/auth/AdminRegister';
import AdminDashboard from './components/admin/AdminDashboard';
import UserFiles from './components/admin/UserFiles';
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
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // If it's a login or register page, don't add the sidebar
  if (publicPaths.includes(location.pathname)) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gray-50"
      >
        {children}
      </motion.div>
    );
  }

  // For all other pages (including landing page), add the sidebar
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center py-4 bg-white shadow-sm"
      >
        <Link 
          to="/" 
          className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-105"
        >
          EXCEL ANALYTICS PLATFORM
        </Link>
      </motion.div>
      <motion.main 
        ref={ref}
        initial={{ x: -20, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`transition-all duration-500 ease-in-out p-8 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>
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
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/user/:userId/files"
            element={
              <AdminRoute>
                <UserFiles />
              </AdminRoute>
            }
          />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/admin/login" element={isAuthenticated ? <Navigate to="/admin/dashboard" /> : <AdminLogin />} />
          <Route path="/admin/register" element={isAuthenticated ? <Navigate to="/admin/dashboard" /> : <AdminRegister />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
