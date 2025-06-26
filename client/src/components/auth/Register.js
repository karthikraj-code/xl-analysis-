import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaEnvelope, FaLock, FaUser, FaChartLine, FaDatabase, FaChartBar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const AnimatedBar = ({ position, height, color, delay }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = Math.sin(time + delay) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.5, height, 0.5]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
    </mesh>
  );
};

const FloatingDataPoint = ({ position, color, delay }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(time + delay) * 0.2;
    meshRef.current.rotation.x = time * 0.5;
    meshRef.current.rotation.y = time * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.2]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  );
};

const AnimatedBackground = () => {
  const bars = [
    { position: [-2, 0, 0], height: 2, color: '#4F46E5', delay: 0 },
    { position: [-1, 0, 0], height: 3, color: '#6366F1', delay: 0.5 },
    { position: [0, 0, 0], height: 1.5, color: '#818CF8', delay: 1 },
    { position: [1, 0, 0], height: 2.5, color: '#A5B4FC', delay: 1.5 },
    { position: [2, 0, 0], height: 2, color: '#C7D2FE', delay: 2 },
  ];

  const dataPoints = [
    { position: [-2, 2, 0], color: '#4F46E5', delay: 0 },
    { position: [0, 3, 0], color: '#6366F1', delay: 0.7 },
    { position: [2, 1.5, 0], color: '#818CF8', delay: 1.4 },
    { position: [-1, 2.5, 0], color: '#A5B4FC', delay: 2.1 },
    { position: [1, 2, 0], color: '#C7D2FE', delay: 2.8 },
  ];

  return (
    <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 1, 1]} intensity={0.8} />
      <pointLight position={[-2, 2, 2]} intensity={0.5} />
      
      {bars.map((bar, index) => (
        <AnimatedBar key={`bar-${index}`} {...bar} />
      ))}
      
      {dataPoints.map((point, index) => (
        <FloatingDataPoint key={`point-${index}`} {...point} />
      ))}

      <OrbitControls 
        enableZoom={false} 
        autoRotate 
        autoRotateSpeed={0.5}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Registration successful! Welcome aboard!', {
        duration: 3000,
        position: 'top-center',
      });
      navigate('/dashboard');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate password match when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
        setPasswordError('Passwords do not match');
      } else if (name === 'confirmPassword' && formData.password && value !== formData.password) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords match before submission
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    const registerData = {
      name: formData.name,
      email: formData.email,
      password: formData.password
    };
    
    dispatch(register(registerData));
  };

  const handleSocialLogin = (provider) => {
    // Implement social login logic here
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image and Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
        <AnimatedBackground />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 py-12 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-4">Join Excel Analytics Platform</h1>
            <p className="text-lg text-blue-100">Start your journey to data-driven decision making today.</p>
          </motion.div>
          
          <div className="space-y-6">
            {[
              {
                icon: <FaChartLine className="h-6 w-6 text-blue-200" />,
                title: "Data Visualization",
                description: "Create stunning visualizations from your Excel data"
              },
              {
                icon: <FaDatabase className="h-6 w-6 text-blue-200" />,
                title: "Smart Analysis",
                description: "Get AI-powered insights and recommendations"
              },
              {
                icon: <FaChartBar className="h-6 w-6 text-blue-200" />,
                title: "Interactive Reports",
                description: "Generate dynamic and interactive reports"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex items-start space-x-4"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="bg-white/10 p-3 rounded-lg"
                >
                  {feature.icon}
                </motion.div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-blue-100">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-2 text-center text-4xl font-extrabold text-gray-900 tracking-tight"
            >
              Create your account
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-2 text-center text-sm text-gray-600"
            >
              Start your journey with Excel Analytics
            </motion.p>
          </div>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 space-y-6" 
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
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
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
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
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </motion.div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            {passwordError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg"
              >
                {passwordError}
              </motion.div>
            )}

            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </motion.div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-200"
                >
                  <FcGoogle className="h-5 w-5" />
                  <span className="ml-2">Google</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-200"
                >
                  <FaGithub className="h-5 w-5" />
                  <span className="ml-2">GitHub</span>
                </motion.button>
              </div>
            </div>

            <div className="text-center">
              <motion.p 
                whileHover={{ scale: 1.05 }}
                className="text-sm text-gray-600"
              >
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Sign in
                </Link>
              </motion.p>
            </div>

            <div className="mt-4 text-center">
              <Link to="/admin/register" className="text-blue-600 hover:underline">Register as Admin?</Link>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register; 