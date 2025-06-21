import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

const AdminRegister = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      const password = e.target.name === 'password' ? e.target.value : form.password;
      const confirmPassword = e.target.name === 'confirmPassword' ? e.target.value : form.confirmPassword;
      if (password && confirmPassword && password !== confirmPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      navigate('/admin/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Admin Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
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
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {passwordError && <div className="text-red-500">{passwordError}</div>}
            {error && <div className="text-red-500">{error}</div>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register as Admin'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/register" className="text-blue-600 hover:underline">Register as User?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister; 