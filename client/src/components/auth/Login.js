import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError, forgotPassword } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaUser } from 'react-icons/fa';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {showForgotPassword ? 'Reset Password' : 'Sign in to your account'}
          </h2>
        </div>
        
        {!showForgotPassword ? (
          <>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input rounded-t-md"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="input rounded-b-md"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
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
                  className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <FcGoogle className="h-5 w-5" />
                    <FaUser className="h-4 w-4 ml-1 text-gray-500" />
                  </div>
                  <span className="ml-2">Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-[#24292e] text-sm font-medium text-white hover:bg-[#1b1f23] transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <FaGithub className="h-5 w-5" />
                    <FaUser className="h-4 w-4 ml-1 text-gray-300" />
                  </div>
                  <span className="ml-2">GitHub</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="reset-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  required
                  className="input rounded-t-md"
                  placeholder="Enter your email address"
                  value={resetData.email}
                  onChange={handleResetChange}
                />
              </div>
              <div>
                <label htmlFor="new-password" className="sr-only">
                  New Password
                </label>
                <input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  required
                  className="input"
                  placeholder="Enter new password"
                  value={resetData.newPassword}
                  onChange={handleResetChange}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  className="input rounded-b-md"
                  placeholder="Confirm new password"
                  value={resetData.confirmPassword}
                  onChange={handleResetChange}
                />
              </div>
            </div>

            {(error || passwordError) && (
              <div className="text-red-500 text-sm text-center">
                {error || passwordError}
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetData({
                    email: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  setPasswordError('');
                }}
                className="text-sm text-gray-600 hover:text-gray-500"
              >
                Back to login
              </button>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !!passwordError}
                className="btn btn-primary w-full"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login; 