import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin, clearError } from '../../store/slices/authSlice';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FaUserShield, FaUsers, FaFileAlt, FaBan } from 'react-icons/fa';

const AnimatedBar = ({ position, height, color, delay }) => {
  const meshRef = useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = Math.sin(time + delay) * 0.1;
    meshRef.current.rotation.z = Math.sin(time * 0.5 + delay) * 0.05;
  });
  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.5, height, 0.5]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
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
  return (
    <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 1, 1]} intensity={0.8} />
      <pointLight position={[-2, 2, 2]} intensity={0.5} />
      <group position={[0, 0, 0]}>
        {bars.map((bar, index) => (
          <AnimatedBar key={`bar-${index}`} {...bar} />
        ))}
      </group>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
    </Canvas>
  );
};

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin/dashboard');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, user, navigate, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(adminLogin(form));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Animation and Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
        <AnimatedBackground />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 py-12 text-white">
          <h1 className="text-4xl font-bold mb-6 flex items-center gap-3"><FaUserShield className="inline-block text-blue-200" /> Admin Portal</h1>
          <ul className="space-y-6 text-lg">
            <li className="flex items-center gap-3"><FaUsers className="text-blue-200" /> Manage all users</li>
            <li className="flex items-center gap-3"><FaFileAlt className="text-blue-200" /> View all uploaded files</li>
            <li className="flex items-center gap-3"><FaBan className="text-blue-200" /> Block or delete users</li>
            <li className="flex items-center gap-3"><FaUserShield className="text-blue-200" /> Secure admin access</li>
          </ul>
        </div>
      </div>
      {/* Right side - Form */}
      <div className="flex flex-col items-center justify-center min-h-screen w-full lg:w-1/2 bg-gradient-to-br from-blue-50 to-white">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Admin Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {error && <div className="text-red-500">{error}</div>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-blue-600 hover:underline">Login as User?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 