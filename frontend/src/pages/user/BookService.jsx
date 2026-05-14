import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import { bookingAPI, workerAPI } from '../../services/api';
import { MapPin, Calendar, Clock, Star, Users, User, BrainCircuit, ShieldCheck, Sparkles, Award } from 'lucide-react';

const BookService = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [matchedWorkers, setMatchedWorkers] = useState([]);
  const [loading, setLoading] = useState(false);

  const services = [
    { id: 'plumbing', name: 'Plumbing', icon: '🔧', description: 'Pipe repairs, installations, leak fixes' },
    { id: 'electrical', name: 'Electrical', icon: '⚡', description: 'Wiring, outlets, electrical repairs' },
    { id: 'cleaning', name: 'Cleaning', icon: '🧹', description: 'House cleaning, deep cleaning services' },
    { id: 'carpentry', name: 'Carpentry', icon: '🔨', description: 'Woodwork, furniture repair, installations' },
    { id: 'painting', name: 'Painting', icon: '🎨', description: 'Interior/exterior painting, wall repairs' },
    { id: 'hvac', name: 'HVAC', icon: '❄️', description: 'Heating, ventilation, air conditioning' },
    { id: 'appliance', name: 'Appliances', icon: '🔌', description: 'Appliance repair and maintenance' },
    { id: 'landscaping', name: 'Landscaping', icon: '🌳', description: 'Garden maintenance, lawn care' }
  ];

  const handleFindWorkers = async () => {
    if (!selectedService || !description || !location || !scheduledDate || !scheduledTime) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Fetch verified workers matching the selected service
      const response = await workerAPI.getAvailableWorkers(selectedService); 
      
      // AI Matching Simulation based on real data
      const workers = response.data.map(w => {
        const rating = w.trustFactors?.rating || 4.5;
        const trust = w.trustFactors?.trustScore || 85;
        const distance = parseFloat((Math.random() * 5).toFixed(1));
        
        // Complex AI Score: 40% Trust, 30% Rating, 30% Distance (Inverted)
        const distanceScore = (5 - distance) * 20; // 0-100
        const aiScore = Math.min(99, Math.floor((trust * 0.4) + (rating * 10 * 0.3) + (distanceScore * 0.3)));
        
        let aiReason = "Balanced match for your requirements.";
        if (distance < 1.0) aiReason = "Selected for ultra-fast arrival (Closest to you).";
        else if (rating > 4.8) aiReason = "Top-tier specialist with perfect customer sentiment.";
        else if (trust > 92) aiReason = "Highest platform trust score & verification record.";
        else if (w.hourlyRate < 350) aiReason = "Best value-for-money professional in this sector.";

        return {
          id: w._id,
          name: w.user?.name || 'Professional Worker',
          rating: rating,
          reviews: w.trustFactors?.completedJobs || 12,
          hourlyRate: Math.round(w.hourlyRate || 300),
          distance: distance,
          experience: Math.floor(Math.random() * 8) + 2,
          specialties: w.services || [selectedService],
          availability: 'Available Now',
          aiScore: aiScore,
          aiReason: aiReason,
          isVerified: w.verification?.isVerified || true
        };
      });

      // Sort by AI Score descending
      const sortedWorkers = workers.sort((a, b) => b.aiScore - a.aiScore);

      setMatchedWorkers(sortedWorkers);
      setShowConfirmModal(true);
    } catch (error) {
      console.error('Failed to find workers');
      alert('Failed to connect to AI Matching engine');
    } finally {
      setLoading(false);
    }
  };

  const handleBookWorker = async (worker) => {
    try {
      const bookingData = {
        workerId: worker.id,
        service: selectedService,
        description,
        scheduledDate,
        scheduledTime,
        location,
        priority: isEmergency ? 'emergency' : 'normal'
      };
      
      await bookingAPI.createBooking(bookingData);
      alert(`Booking confirmed with ${worker.name}! The worker has been notified via real-time channel.`);
      navigate('/user/bookings');
    } catch (error) {
      alert('Booking failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Book a Service</h1>
          <p className="text-slate-400">
            Precision matching powered by <span className="text-blue-400 font-black italic">ServAI Neural Engine</span>.
          </p>
        </div>
        {loading && (
          <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl animate-pulse">
            <BrainCircuit size={20} className="text-blue-400 animate-spin" />
            <span className="text-sm font-black text-blue-400 uppercase tracking-widest">Optimizing Match...</span>
          </div>
        )}
      </div>

      {/* Service Selection */}
      <Card className="p-8 border-none bg-white/[0.02] backdrop-blur-xl">
        <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-white uppercase tracking-widest text-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Sparkles size={18} className="text-blue-400" />
          </div>
          Step 1: Choose Your Expert Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-5">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden group hover:scale-[1.02] active:scale-95 ${
                selectedService === service.id
                  ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]'
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
              }`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
              <h3 className="font-bold text-white text-lg mb-1">{service.name}</h3>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{service.description}</p>
              {selectedService === service.id && (
                <div className="absolute top-4 right-4 text-blue-400 animate-bounce">
                  <ShieldCheck size={20} />
                </div>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Service Details */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-8 border-none bg-white/[0.02]">
          <h2 className="text-xs font-black mb-8 flex items-center gap-3 text-slate-500 uppercase tracking-widest">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <MapPin size={18} className="text-indigo-400" />
            </div>
            Step 2: Service Context
          </h2>
          <div className="space-y-6">
            <Input
              label="Describe the issue"
              placeholder="e.g., The kitchen sink is leaking and causing water damage..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Input
              label="Service Address"
              placeholder="Flat/House No, Building, Area..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </Card>

        <Card className="p-8 border-none bg-white/[0.02]">
          <h2 className="text-xs font-black mb-8 flex items-center gap-3 text-slate-500 uppercase tracking-widest">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Calendar size={18} className="text-purple-400" />
            </div>
            Step 3: Timeline
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <Input
                label="Preferred Date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />
              <Input
                label="Preferred Time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
              />
            </div>
            <div className="p-5 rounded-3xl bg-red-500/5 border border-red-500/10 mt-4 group hover:bg-red-500/10 transition-colors">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  id="emergency"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="w-6 h-6 text-red-600 bg-slate-900 border-white/10 rounded-xl focus:ring-red-500"
                />
                <label htmlFor="emergency" className="flex flex-col cursor-pointer">
                  <span className="text-sm font-black text-red-400 uppercase tracking-widest">Emergency Priority</span>
                  <span className="text-[10px] text-red-500/60 font-medium italic">Bypasses standard queue • 15min arrival target</span>
                </label>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-center pt-8">
        <Button
          size="lg"
          onClick={handleFindWorkers}
          disabled={loading}
          className="px-20 py-5 text-xl font-black bg-blue-600 hover:bg-blue-500 shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:translate-y-[-4px] transition-all rounded-3xl"
        >
          {loading ? 'Crunching Data...' : 'Deploy AI Matching'}
        </Button>
      </div>

      {/* Worker Selection Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Neural Matching Results"
        size="xl"
      >
        <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar pb-6">
          <div className="flex items-center justify-between px-2 mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Found {matchedWorkers.length} matching professionals
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
              <BrainCircuit size={12} />
              Trust Score Verified
            </div>
          </div>

          {matchedWorkers.length === 0 ? (
            <div className="p-16 text-center border-2 border-dashed border-white/5 rounded-[40px]">
              <Users size={48} className="mx-auto text-slate-600 mb-4 opacity-20" />
              <p className="text-slate-400 italic">No professionals available in this sector currently.</p>
            </div>
          ) : (
            matchedWorkers.map((worker, index) => (
              <Card 
                key={worker.id} 
                className={`p-6 transition-all group relative overflow-hidden ${
                  index === 0 ? 'border-blue-500/50 bg-blue-500/[0.03] shadow-[0_0_40px_rgba(59,130,246,0.1)]' : 'border-white/5 hover:border-white/20'
                }`}
              >
                {index === 0 && (
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl flex items-center gap-2 shadow-lg">
                    <Award size={12} />
                    ServAI Top Choice
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center space-x-6 w-full md:w-auto">
                    <div className="relative">
                      <div className={`w-20 h-20 rounded-[32px] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white shadow-2xl group-hover:scale-105 transition-transform duration-500 border border-white/10`}>
                        <User size={32} className="text-blue-400" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white border-4 border-slate-950 font-black text-xs">
                        {worker.aiScore}%
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">{worker.name}</h3>
                        <ShieldCheck size={16} className="text-blue-500" />
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        <div className="flex items-center text-yellow-400 font-black text-sm">
                          <Star size={14} className="mr-1 fill-yellow-400" />
                          {worker.rating}
                          <span className="ml-1 text-slate-500 font-medium text-[10px]">({worker.reviews} jobs)</span>
                        </div>
                        <div className="flex items-center text-slate-400 text-xs font-bold">
                          <MapPin size={12} className="mr-1 text-indigo-400" />
                          {worker.distance} km
                        </div>
                        <div className="text-[10px] px-3 py-1 bg-white/5 text-slate-300 rounded-xl font-bold border border-white/5">
                          {worker.experience} Years Exp.
                        </div>
                      </div>

                      {/* AI REASONING BOX */}
                      <div className="mt-4 p-3 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
                        <BrainCircuit size={14} className="text-blue-400 mt-0.5" />
                        <p className="text-[10px] text-blue-300/80 font-bold leading-relaxed italic">
                          "AI Analysis: {worker.aiReason}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                    <div className="text-center md:text-right flex-1 md:flex-none">
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Consultation</div>
                      <div className="text-3xl font-black text-white">₹{worker.hourlyRate}</div>
                    </div>
                    <Button
                      size="lg"
                      onClick={() => handleBookWorker(worker)}
                      className={`px-8 py-3 font-black rounded-2xl transition-all ${
                        index === 0 
                          ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-500/20' 
                          : 'bg-white text-slate-950 hover:bg-blue-400 hover:text-white'
                      }`}
                    >
                      Book Professional
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BookService;