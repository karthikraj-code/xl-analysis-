import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { loginSuccess, setUser } from '../../store/slices/authSlice';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('message');
    const userData = params.get('user');

    if (error) {
      toast.error(decodeURIComponent(error));
      navigate('/login');
      return;
    }

    if (token) {
      // Store the token
      localStorage.setItem('token', token);
      
      // Parse and store user data if available
      if (userData) {
        try {
          const user = JSON.parse(decodeURIComponent(userData));
          dispatch(setUser(user));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      
      // Dispatch login success action
      dispatch(loginSuccess({ token }));
      
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error('Authentication failed');
      navigate('/login');
    }
  }, [location, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Processing authentication...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default AuthCallback; 