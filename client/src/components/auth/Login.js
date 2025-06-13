import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError, forgotPassword } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaEnvelope, FaLock, FaChartLine, FaDatabase, FaChartBar } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetData, setResetData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Login successful!', {
        duration: 2000,
        position: 'top-center',
      });
      navigate('/dashboard');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'confirmPassword' || name === 'newPassword') {
      const newPassword = name === 'newPassword' ? value : resetData.newPassword;
      const confirmPassword = name === 'confirmPassword' ? value : resetData.confirmPassword;
      
      if (newPassword && confirmPassword && newPassword !== confirmPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (resetData.newPassword !== resetData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (resetData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    try {
      console.log('Attempting to reset password for:', resetData.email);
      const response = await dispatch(forgotPassword({
        email: resetData.email,
        newPassword: resetData.newPassword
      })).unwrap();
      
      console.log('Password reset response:', response);
      
      toast.success('Password has been reset successfully. Please login with your new password.', {
        duration: 5000,
        position: 'top-center',
      });
      setShowForgotPassword(false);
      setResetData({
        email: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordError('');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to reset password. Please try again.');
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image and Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 py-12 text-white">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Excel Analytics Platform</h1>
            <p className="text-lg text-blue-100">Transform your data into actionable insights with our powerful analytics tools.</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <FaChartLine className="h-6 w-6 text-blue-200" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Advanced Analytics</h3>
                <p className="text-blue-100">Powerful tools for data visualization and analysis</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <FaDatabase className="h-6 w-6 text-blue-200" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Smart Insights</h3>
                <p className="text-blue-100">AI-powered recommendations for better decision making</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <FaChartBar className="h-6 w-6 text-blue-200" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Interactive Charts</h3>
                <p className="text-blue-100">Create beautiful and interactive data visualizations</p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Analytics Dashboard" 
              className="rounded-lg shadow-2xl border border-white/20 w-full h-auto object-cover"
              style={{ maxHeight: '400px' }}
            />
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-2 text-center text-4xl font-extrabold text-gray-900 tracking-tight">
              {showForgotPassword ? 'Reset Password' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {showForgotPassword ? 'Enter your email to reset your password' : 'Sign in to your account'}
            </p>
          </div>
          
          {!showForgotPassword ? (
            <>
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    Forgot your password?
                  </button>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <FcGoogle className="h-5 w-5" />
                    <span className="ml-2">Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin('github')}
                    className="w-full inline-flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm bg-[#24292e] text-sm font-medium text-white hover:bg-[#1b1f23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <FaGithub className="h-5 w-5" />
                    <span className="ml-2">GitHub</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                    Sign up
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="reset-email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email address"
                    value={resetData.email}
                    onChange={handleResetChange}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="new-password"
                    name="newPassword"
                    type="password"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter new password"
                    value={resetData.newPassword}
                    onChange={handleResetChange}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Confirm new password"
                    value={resetData.confirmPassword}
                    onChange={handleResetChange}
                  />
                </div>
              </div>

              {passwordError && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{passwordError}</div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Back to login
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !!passwordError}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Resetting password...' : 'Reset password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login; 