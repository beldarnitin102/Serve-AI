import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { MapPin, Clock, DollarSign, Star, Filter, Search } from 'lucide-react';

const AvailableJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [sortBy, setSortBy] = useState('distance');

  // Mock data - in real app, fetch from API
  const [jobs, setJobs] = useState([
    {
      id: 1,
      service: 'Plumbing',
      customer: 'John Smith',
      customerRating: 4.8,
      location: '123 Main Street, Downtown',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      distance: 2.3,
      scheduledDate: '2024-01-20',
      scheduledTime: '10:00 AM',
      amount: 150,
      description: 'Leaking kitchen faucet needs repair. Customer reports water pressure issues.',
      urgency: 'normal',
      aiMatchScore: 92,
      estimatedDuration: '1-2 hours'
    },
    {
      id: 2,
      service: 'Electrical',
      customer: 'Sarah Johnson',
      customerRating: 4.9,
      location: '456 Oak Avenue, Midtown',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      distance: 4.1,
      scheduledDate: '2024-01-20',
      scheduledTime: '2:00 PM',
      amount: 200,
      description: 'Install new outlet in living room. Customer has specific requirements for placement.',
      urgency: 'high',
      aiMatchScore: 88,
      estimatedDuration: '2-3 hours'
    },
    {
      id: 3,
      service: 'Cleaning',
      customer: 'Mike Davis',
      customerRating: 4.7,
      location: '789 Pine Road, Uptown',
      coordinates: { lat: 40.7831, lng: -73.9712 },
      distance: 6.2,
      scheduledDate: '2024-01-21',
      scheduledTime: '9:00 AM',
      amount: 120,
      description: 'Deep cleaning of 3-bedroom apartment. Focus on kitchen and bathrooms.',
      urgency: 'normal',
      aiMatchScore: 85,
      estimatedDuration: '3-4 hours'
    },
    {
      id: 4,
      service: 'Carpentry',
      customer: 'Emma Wilson',
      customerRating: 4.6,
      location: '321 Elm Street, Brooklyn',
      coordinates: { lat: 40.6782, lng: -73.9442 },
      distance: 8.5,
      scheduledDate: '2024-01-21',
      scheduledTime: '1:00 PM',
      amount: 180,
      description: 'Repair broken kitchen cabinet door. Customer has replacement parts ready.',
      urgency: 'normal',
      aiMatchScore: 78,
      estimatedDuration: '1-2 hours'
    },
    {
      id: 5,
      service: 'HVAC',
      customer: 'Robert Brown',
      customerRating: 4.5,
      location: '654 Maple Drive, Queens',
      coordinates: { lat: 40.7282, lng: -73.7949 },
      distance: 12.1,
      scheduledDate: '2024-01-22',
      scheduledTime: '11:00 AM',
      amount: 250,
      description: 'AC unit maintenance and filter replacement. Annual service appointment.',
      urgency: 'low',
      aiMatchScore: 95,
      estimatedDuration: '1-2 hours'
    }
  ]);

  const services = ['all', 'plumbing', 'electrical', 'cleaning', 'carpentry', 'hvac'];

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesService = selectedService === 'all' || job.service.toLowerCase() === selectedService;
      return matchesSearch && matchesService;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'amount':
          return b.amount - a.amount;
        case 'urgency':
          const urgencyOrder = { high: 3, normal: 2, low: 1 };
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        case 'ai_score':
          return b.aiMatchScore - a.aiMatchScore;
        default:
          return 0;
      }
    });

  const handleAcceptJob = (jobId) => {
    // In real app, call API to accept job
    alert('Job accepted successfully! Customer will be notified.');
    setJobs(jobs.filter(job => job.id !== jobId));
  };

  const handleDeclineJob = (jobId) => {
    // In real app, call API to decline job
    setJobs(jobs.filter(job => job.id !== jobId));
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'normal': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Available Jobs</h1>
        <p className="text-slate-300">
          Browse and accept jobs that match your skills and location.
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs by service, location, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {services.map(service => (
                <option key={service} value={service}>
                  {service === 'all' ? 'All Services' : service.charAt(0).toUpperCase() + service.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="distance">Sort by Distance</option>
              <option value="amount">Sort by Amount</option>
              <option value="urgency">Sort by Urgency</option>
              <option value="ai_score">Sort by AI Match</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Jobs List */}
      <div className="space-y-6">
        {filteredJobs.length === 0 ? (
          <Card className="p-12 text-center">
            <Search size={48} className="mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-slate-400">
              Try adjusting your search criteria or check back later for new opportunities.
            </p>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-semibold">{job.service}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(job.urgency)}`}>
                      {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)} Priority
                    </span>
                    <div className="flex items-center text-green-400 text-sm">
                      <span className="font-medium">AI Match: {job.aiMatchScore}%</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-slate-300">
                      <MapPin size={16} className="mr-2" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="flex items-center text-slate-300">
                      <Clock size={16} className="mr-2" />
                      <span className="text-sm">{job.scheduledDate} at {job.scheduledTime}</span>
                    </div>
                    <div className="flex items-center text-slate-300">
                      <DollarSign size={16} className="mr-2" />
                      <span className="text-sm font-medium">${job.amount} • {job.estimatedDuration}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center text-slate-400 text-sm">
                      <Star size={14} className="mr-1 text-yellow-400" />
                      Customer: {job.customerRating}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {job.distance} km away
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm mb-4">{job.description}</p>

                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => handleAcceptJob(job.id)}>
                      Accept Job
                    </Button>
                    <Button variant="secondary" onClick={() => handleDeclineJob(job.id)}>
                      Decline
                    </Button>
                    <Button variant="secondary" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Job Stats */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">Job Statistics</h3>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{filteredJobs.length}</div>
            <div className="text-slate-400 text-sm">Available Jobs</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              ${filteredJobs.reduce((sum, job) => sum + job.amount, 0)}
            </div>
            <div className="text-slate-400 text-sm">Potential Earnings</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {filteredJobs.filter(job => job.urgency === 'high').length}
            </div>
            <div className="text-slate-400 text-sm">High Priority</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {Math.round(filteredJobs.reduce((sum, job) => sum + job.aiMatchScore, 0) / filteredJobs.length) || 0}%
            </div>
            <div className="text-slate-400 text-sm">Avg AI Match</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AvailableJobs;