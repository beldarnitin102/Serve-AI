import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import { MapPin, Calendar, Clock, Star, Users } from 'lucide-react';

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

  // Mock AI matching - in real app, call API
  const handleFindWorkers = async () => {
    if (!selectedService || !description || !location || !scheduledDate || !scheduledTime) {
      alert('Please fill in all required fields');
      return;
    }

    // Mock matched workers
    const mockWorkers = [
      {
        id: 1,
        name: 'John Smith',
        rating: 4.8,
        reviews: 156,
        hourlyRate: 45,
        distance: 2.3,
        experience: 8,
        specialties: ['Emergency Repairs', 'Pipe Fitting'],
        availability: 'Available now',
        aiScore: 95
      },
      {
        id: 2,
        name: 'Mike Johnson',
        rating: 4.9,
        reviews: 203,
        hourlyRate: 50,
        distance: 3.1,
        experience: 12,
        specialties: ['Water Heaters', 'Drain Cleaning'],
        availability: 'Available in 30 min',
        aiScore: 92
      },
      {
        id: 3,
        name: 'Sarah Davis',
        rating: 4.7,
        reviews: 89,
        hourlyRate: 42,
        distance: 4.2,
        experience: 6,
        specialties: ['Leak Detection', 'Fixture Installation'],
        availability: 'Available today',
        aiScore: 88
      }
    ];

    setMatchedWorkers(mockWorkers);
    setShowConfirmModal(true);
  };

  const handleBookWorker = (worker) => {
    // In real app, create booking via API
    alert(`Booking confirmed with ${worker.name}!`);
    navigate('/user/bookings');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Book a Service</h1>
        <p className="text-slate-300">
          Tell us what you need and our AI will find the perfect professional for you.
        </p>
      </div>

      {/* Service Selection */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">What service do you need?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedService === service.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="text-2xl mb-2">{service.icon}</div>
              <h3 className="font-semibold mb-1">{service.name}</h3>
              <p className="text-sm text-slate-400">{service.description}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Service Details */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Service Details</h2>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Describe your problem"
              placeholder="e.g., Leaking faucet in kitchen, needs urgent repair"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <Input
              label="Location"
              placeholder="Enter your address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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

            <div className="flex items-center space-x-3 pt-8">
              <input
                type="checkbox"
                id="emergency"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="emergency" className="text-sm font-medium text-slate-300">
                This is an emergency (60-min guarantee)
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Find Workers Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleFindWorkers}
          className="px-12 py-4 text-lg"
        >
          Find Available Professionals
        </Button>
      </div>

      {/* Worker Selection Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Choose Your Professional"
        size="xl"
      >
        <div className="space-y-4">
          <p className="text-slate-300 mb-6">
            Our AI has matched you with the best available professionals based on your needs,
            location, ratings, and availability.
          </p>

          {matchedWorkers.map((worker) => (
            <Card key={worker.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                    <Users size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{worker.name}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center text-yellow-400">
                        <Star size={16} className="mr-1" />
                        <span className="text-sm font-medium">{worker.rating}</span>
                        <span className="text-slate-400 ml-1">({worker.reviews} reviews)</span>
                      </div>
                      <div className="text-slate-400 text-sm">
                        {worker.distance} km away
                      </div>
                      <div className="text-green-400 text-sm">
                        {worker.availability}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {worker.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${worker.hourlyRate}/hr</div>
                  <div className="text-sm text-slate-400 mt-1">
                    {worker.experience} years exp.
                  </div>
                  <div className="text-sm text-green-400 mt-1">
                    AI Match: {worker.aiScore}%
                  </div>
                  <Button
                    onClick={() => handleBookWorker(worker)}
                    className="mt-4"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default BookService;