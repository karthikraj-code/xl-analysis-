import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="text-primary text-3xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-neutral-dark mb-2">{title}</h3>
    <p className="text-neutral">{description}</p>
  </div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-content mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Transform Your Excel Data into Actionable Insights
            </h1>
            <p className="text-xl text-neutral max-w-2xl mx-auto mb-8">
              Powerful analytics and visualization tools to help you make data-driven decisions with confidence.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/dashboard"
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Start Analyzing
              </Link>
              <Link
                to="/demo"
                className="bg-white hover:bg-gray-50 text-primary border-2 border-primary px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-content mx-auto">
          <h2 className="text-3xl font-bold text-center text-neutral-dark mb-12">
            Powerful Features for Data Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="📊"
              title="Advanced Analytics"
              description="Unlock powerful insights with our advanced analytics engine and customizable dashboards."
            />
            <FeatureCard
              icon="🔍"
              title="Smart Detection"
              description="Automatically detect patterns and anomalies in your data with AI-powered analysis."
            />
            <FeatureCard
              icon="📈"
              title="Real-time Updates"
              description="Stay current with real-time data updates and instant visualization changes."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 md:px-8 bg-primary text-white">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-lg">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-lg">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-dark text-white py-12 px-4 md:px-8">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">About Us</h3>
              <p className="text-gray-300">
                We're dedicated to making data analysis accessible and powerful for businesses of all sizes.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-300 hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-300 hover:text-white">Pricing</Link></li>
                <li><Link to="/docs" className="text-gray-300 hover:text-white">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
                <li><Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
                <li><Link to="/support" className="text-gray-300 hover:text-white">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} Excel Analysis. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 