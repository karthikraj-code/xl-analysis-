import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';

const FeatureCard = ({ icon, title, description, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
    >
      <motion.div 
        className="text-primary text-2xl sm:text-3xl mb-4"
        animate={{ rotate: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {icon}
      </motion.div>
      <h3 className="text-lg sm:text-xl font-semibold text-neutral-dark mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-neutral">{description}</p>
    </motion.div>
  );
};

const AnimatedSphere = () => {
  return (
    <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.3 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 1, 1]} />
      <Sphere args={[1, 64, 64]} scale={2}>
        <meshStandardMaterial
          color="#4F46E5"
          wireframe
          transparent
          opacity={0.2}
        />
      </Sphere>
      <OrbitControls 
        enableZoom={false} 
        autoRotate 
        autoRotateSpeed={0.5}
        enablePan={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
};

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-8 relative overflow-hidden">
        <motion.div 
          style={{ opacity, scale }}
          className="absolute inset-0 z-0"
        >
          <AnimatedSphere />
        </motion.div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-primary mb-4 sm:mb-6">
              Transform Your Excel Data into Actionable Insights
            </h1>
            <p className="text-base sm:text-xl text-neutral max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
              Powerful analytics and visualization tools to help you make data-driven decisions with confidence.
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/dashboard"
                  className="block w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                >
                  Start Analyzing
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/demo"
                  className="block w-full sm:w-auto bg-white hover:bg-gray-50 text-primary border-2 border-primary px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                >
                  Request Demo
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 bg-white relative z-10 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-center text-neutral-dark mb-8 sm:mb-12"
          >
            Powerful Features for Data Analysis
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon="📊"
              title="Advanced Analytics"
              description="Unlock powerful insights with our advanced analytics engine and customizable dashboards."
              index={0}
            />
            <FeatureCard
              icon="🔍"
              title="Smart Detection"
              description="Automatically detect patterns and anomalies in your data with AI-powered analysis."
              index={1}
            />
            <FeatureCard
              icon="📈"
              title="Real-time Updates"
              description="Stay current with real-time data updates and instant visualization changes."
              index={2}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 bg-primary text-white relative z-10 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            {[
              { value: "98%", label: "Customer Satisfaction" },
              { value: "10K+", label: "Active Users" },
              { value: "24/7", label: "Support Available" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
                className="bg-white/10 p-4 sm:p-6 rounded-lg"
              >
                <div className="text-3xl sm:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-base sm:text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-dark text-white py-8 sm:py-12 px-4 sm:px-8 relative z-10 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                title: "About Us",
                content: (
                  <p className="text-sm sm:text-base text-gray-300">
                    We're dedicated to making data analysis accessible and powerful for businesses of all sizes.
                  </p>
                )
              },
              {
                title: "Quick Links",
                content: (
                  <ul className="space-y-2">
                    <li><Link to="/features" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-300">Features</Link></li>
                    <li><Link to="/pricing" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-300">Pricing</Link></li>
                    <li><Link to="/docs" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-300">Documentation</Link></li>
                  </ul>
                )
              },
              {
                title: "Support",
                content: (
                  <ul className="space-y-2">
                    <li><Link to="/contact" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-300">Contact Us</Link></li>
                    <li><Link to="/faq" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-300">FAQ</Link></li>
                    <li><Link to="/support" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-300">Help Center</Link></li>
                  </ul>
                )
              },
              {
                title: "Legal",
                content: (
                  <ul className="space-y-2">
                    <li><Link to="/privacy" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-300">Privacy Policy</Link></li>
                    <li><Link to="/terms" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-300">Terms of Service</Link></li>
                  </ul>
                )
              }
            ].map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 p-4 sm:p-6 rounded-lg"
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-4">{section.title}</h3>
                {section.content}
              </motion.div>
            ))}
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="border-t border-gray-700 mt-8 pt-8 text-center text-sm sm:text-base text-gray-300"
          >
            <p>&copy; {new Date().getFullYear()} Excel Analysis. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 