import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import {
  Zap,
  Shield,
  Clock,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Matching',
      description: 'Our advanced AI finds the perfect service provider for your needs in seconds.'
    },
    {
      icon: Shield,
      title: 'Verified Professionals',
      description: 'All workers are thoroughly vetted with trust scores and background checks.'
    },
    {
      icon: Clock,
      title: '60-Minute Guarantee',
      description: 'Emergency services arrive within 60 minutes or your service is free.'
    },
    {
      icon: Users,
      title: 'Smart Scheduling',
      description: 'AI predicts demand and optimizes scheduling for faster service.'
    }
  ];

  const services = [
    { name: 'Plumbing', icon: '🔧' },
    { name: 'Electrical', icon: '⚡' },
    { name: 'Cleaning', icon: '🧹' },
    { name: 'Carpentry', icon: '🔨' },
    { name: 'Painting', icon: '🎨' },
    { name: 'AC Repair', icon: '❄️' }
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      const dashboardRoutes = {
        user: '/user/dashboard',
        worker: '/worker/dashboard',
        admin: '/admin/dashboard'
      };
      navigate(dashboardRoutes[user?.role] || '/login');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-[#071226] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/10 blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 mb-8">
              <Sparkles size={16} className="text-blue-400 mr-2" />
              <span className="text-sm text-blue-400">AI-Powered Smart Services</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                ServAI
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Experience the future of home services with AI-powered matching,
              real-time tracking, and guaranteed 60-minute emergency response.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="px-8 py-4 text-lg"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                <ArrowRight size={20} className="ml-2" />
              </Button>
              {!isAuthenticated && (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 text-lg"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose ServAI?</h2>
            <p className="text-xl text-slate-300">
              Revolutionary features powered by cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-300">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Popular Services</h2>
            <p className="text-xl text-slate-300">
              Professional help for all your home service needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {services.map((service, index) => (
              <Card key={index} hover className="text-center p-6">
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="font-semibold">{service.name}</h3>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">50K+</div>
              <div className="text-slate-300">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">10K+</div>
              <div className="text-slate-300">Verified Workers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">99%</div>
              <div className="text-slate-300">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-400 mb-2">60min</div>
              <div className="text-slate-300">Response Guarantee</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Experience the Future?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of satisfied customers who trust ServAI for their home service needs.
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="px-8 py-4 text-lg"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Start Your Journey'}
            <ArrowRight size={20} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;