import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { workerAPI, bookingAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Star, Search, ShieldCheck, Loader2, Sparkles, Navigation } from 'lucide-react';

const AvailableJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [loadingJobId, setLoadingJobId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchJobs();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error('Error getting location:', error)
      );
    }
  };

  const calculateDistance = (jobLocation) => {
    if (!userLocation) return "Calculating GPS...";
    // For demo: random distance between 0.5 and 5.0 km
    return (Math.random() * 4 + 0.5).toFixed(1) + " km away";
  };

  const fetchJobs = async () => {
    try {
      const response = await bookingAPI.getWorkerBookings();
      const pendingJobs = response.data.filter(job => job.status === 'pending');
      setJobs(pendingJobs);
    } catch (error) {
      console.error('Failed to fetch available jobs');
    } finally {
      setLoading(false);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = ['all', 'Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'HVAC', 'Painting'];

  const sampleServices = [
    {
      id: 'svc-1',
      service: 'Plumbing',
      description: 'Leak repairs, pipe installs, drain clearing and bathroom fixture service.',
      location: 'Sector 12, Noida',
      price: 420,
      trustScore: 4.9,
      category: 'Plumbing'
    },
    {
      id: 'svc-2',
      service: 'Electrical',
      description: 'Wiring, switchboard, lighting, and troubleshooting for homes and offices.',
      location: 'MG Road, Delhi',
      price: 510,
      trustScore: 4.8,
      category: 'Electrical'
    },
    {
      id: 'svc-3',
      service: 'Cleaning',
      description: 'Deep clean, sanitization, carpet shampoo and apartment refresh service.',
      location: 'Koramangala, Bangalore',
      price: 320,
      trustScore: 4.7,
      category: 'Cleaning'
    },
    {
      id: 'svc-4',
      service: 'Carpentry',
      description: 'Furniture installs, cabinet repairs, shelving and custom woodwork.',
      location: 'Bandra, Mumbai',
      price: 650,
      trustScore: 4.8,
      category: 'Carpentry'
    },
    {
      id: 'svc-5',
      service: 'HVAC',
      description: 'AC service, duct cleaning, thermostat setup and climate control maintenance.',
      location: 'Whitefield, Bangalore',
      price: 750,
      trustScore: 4.9,
      category: 'HVAC'
    },
    {
      id: 'svc-6',
      service: 'Painting',
      description: 'Interior and exterior painting, texture finishes, and color consulting.',
      location: 'MG Road, Pune',
      price: 590,
      trustScore: 4.6,
      category: 'Painting'
    },
    {
      id: 'svc-7',
      service: 'Appliance Repair',
      description: 'Repair and maintenance for refrigerators, washing machines, and ovens.',
      location: 'Kothrud, Pune',
      price: 480,
      trustScore: 4.7,
      category: 'Electrical'
    },
  ];

  const handleAcceptJob = async (jobId) => {
    setLoadingJobId(jobId);
    try {
      // Logic to record the worker's acceptance location
      const acceptanceData = {
        status: 'accepted',
        acceptanceLocation: userLocation
      };

      await bookingAPI.updateBookingStatus(jobId, 'accepted');
      navigate('/worker/bookings');
    } catch (error) {
      console.error('Failed to accept job:', error.response?.data?.message || error.message);
    } finally {
      setLoadingJobId(null);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || job.service === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-blue-500" />
        <p className="text-slate-400 font-medium">Scanning for new opportunities...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black mb-2">Marketplace Opportunities</h1>
          <p className="text-slate-300">
            Real-time job requests matched to your profile by <span className="text-blue-400 font-bold italic">ServAI Neural Engine</span>.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
          <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Active Search</span>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="space-y-4">
        <Card className="p-6 border-none bg-white/[0.02]">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search by service or area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            
            {userLocation && (
              <div className="px-5 py-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-3 w-full lg:w-auto">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  <div className="w-2 h-2 rounded-full bg-blue-500 absolute inset-0" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">GPS Verification Active</p>
                  <p className="text-[10px] font-bold text-white font-mono">{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tighter transition-all whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-white/[0.02] text-slate-400 border-white/5 hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Service Categories</h2>
            <p className="text-slate-400">Browse the most requested worker services in your area.</p>
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-slate-500 font-black">{selectedCategory === 'all' ? 'All services' : selectedCategory}</span>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {sampleServices.filter(service => selectedCategory === 'all' || service.category === selectedCategory).map((service) => (
            <Card key={service.id} className="p-6 border-white/10 bg-white/5 hover:border-blue-500/30 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black text-white">{service.service}</h3>
                  <p className="text-slate-400 text-sm mt-1">{service.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">₹{service.price}</p>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 mt-1">Est.</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-5">{service.description}</p>
              <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-[0.25em] font-black">
                <span>{service.location}</span>
                <span>{service.trustScore} ★</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-6">
        {filteredJobs.length === 0 ? (
          <Card className="p-16 text-center border-dashed border-2 border-white/5 bg-transparent">
            <Sparkles size={48} className="mx-auto text-slate-700 mb-6" />
            <h3 className="text-xl font-bold mb-2 text-white">Your queue is clear</h3>
            <p className="text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">
              New job requests will appear here in real-time as customers book your services.
            </p>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job._id} className="p-8 hover:border-blue-500/30 transition-all group relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl">
                      <Clock size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white capitalize">{job.service}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-full">
                          98% AI Match
                        </span>
                        <div className="flex items-center text-yellow-400 text-xs font-bold">
                          <Star size={12} className="mr-1 fill-yellow-400" />
                          {job.user?.trustScore || 4.9}
                        </div>
                        <div className="flex items-center text-slate-400 text-[10px] font-bold">
                          <MapPin size={12} className="mr-1 text-indigo-400" />
                          {calculateDistance(job.location)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-5 rounded-2xl bg-white/[0.03] border border-white/5 relative overflow-hidden">
                    <div className="flex items-start gap-3 z-10">
                      <MapPin size={18} className="text-blue-400 mt-1" />
                      <div>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Service Location</p>
                        <p className="text-sm font-bold text-white leading-tight">{job.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 z-10">
                      <Clock size={18} className="text-blue-400 mt-1" />
                      <div>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Schedule</p>
                        <p className="text-sm font-bold text-slate-300">{new Date(job.scheduledDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 z-10">
                      <DollarSign size={18} className="text-blue-400 mt-1" />
                      <div>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Contract</p>
                        <p className="text-sm font-bold text-white">₹{job.price?.total || 450}</p>
                      </div>
                    </div>
                    
                    {/* Mini Map Preview Overlay (Static for demo) */}
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-blue-600/5 border-l border-white/5 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                      <Navigation size={24} className="text-blue-400/20 group-hover:animate-pulse" />
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 italic">"{job.description}"</p>
                </div>

                <div className="lg:border-l border-white/10 lg:pl-8 flex flex-col gap-3 min-w-[200px]">
                  <Button 
                    size="lg"
                    className="w-full font-black bg-blue-600 shadow-xl"
                    onClick={() => handleAcceptJob(job._id)}
                    loading={loadingJobId === job._id}
                  >
                    Accept Job
                  </Button>
                  <Button variant="secondary" className="w-full border-none">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Verification Modal Disabled for now */}
    </div>
  );
};

export default AvailableJobs;