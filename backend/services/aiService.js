// AI Worker Matching Service
export const matchWorkers = async (booking) => {
  // Mock AI matching logic - in real app, use ML models
  const { service, location, scheduledDate } = booking;

  // Calculate scores based on various factors
  const matches = await Worker.find({
    services: service,
    isOnline: true
  }).populate('user');

  const scoredMatches = matches.map(worker => {
    let score = 0;
    let factors = [];

    // Distance factor
    if (location?.coordinates && worker.currentLocation) {
      const distance = calculateDistance(
        location.coordinates,
        worker.currentLocation
      );
      if (distance <= worker.radius) {
        score += 30;
        factors.push({ name: 'distance', weight: 30, value: Math.max(0, 100 - distance * 10) });
      }
    }

    // Rating factor
    score += worker.rating * 20;
    factors.push({ name: 'rating', weight: 20, value: worker.rating * 20 });

    // Experience factor
    score += Math.min(worker.experience * 2, 20);
    factors.push({ name: 'experience', weight: 20, value: Math.min(worker.experience * 2, 20) });

    // Availability factor
    const dayOfWeek = scheduledDate.toLocaleLowerCase('en-US', { weekday: 'long' });
    if (worker.availability[dayOfWeek]) {
      score += 15;
      factors.push({ name: 'availability', weight: 15, value: 15 });
    }

    // Trust score factor
    score += worker.user?.trustScore * 0.15;
    factors.push({ name: 'trust_score', weight: 15, value: worker.user?.trustScore * 0.15 });

    return {
      worker: worker._id,
      score: Math.round(score),
      factors
    };
  });

  return scoredMatches.sort((a, b) => b.score - a.score);
};

// Trust Score Calculation
export const calculateTrustScore = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return 0;

  let score = 100;

  // Factor 1: Review history
  const reviews = await Review.find({ reviewee: userId });
  if (reviews.length > 0) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    score -= (5 - avgRating) * 10;
  }

  // Factor 2: Booking completion rate
  const totalBookings = await Booking.countDocuments({ user: userId });
  const completedBookings = await Booking.countDocuments({
    user: userId,
    status: 'completed'
  });
  const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 100;
  score -= (100 - completionRate) * 0.5;

  // Factor 3: Account age
  const accountAge = (Date.now() - user.createdAt) / (1000 * 60 * 60 * 24); // days
  score += Math.min(accountAge * 0.1, 10);

  return Math.max(0, Math.min(100, Math.round(score)));
};

// Fraud Detection
export const detectFraud = async (booking) => {
  const alerts = [];

  // Check for suspicious patterns
  const recentBookings = await Booking.find({
    user: booking.user,
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });

  if (recentBookings.length > 5) {
    alerts.push({
      level: 'medium',
      message: 'High booking frequency detected'
    });
  }

  // Check location consistency
  const userBookings = await Booking.find({ user: booking.user }).limit(10);
  const locations = userBookings.map(b => b.location?.address).filter(Boolean);
  if (locations.length > 0 && !locations.includes(booking.location?.address)) {
    alerts.push({
      level: 'low',
      message: 'Unusual booking location'
    });
  }

  return alerts;
};

// Demand Prediction
export const predictDemand = async (service, location, date) => {
  // Mock prediction logic
  const baseDemand = Math.floor(Math.random() * 100) + 50;

  // Time-based factors
  const hour = date.getHours();
  let timeMultiplier = 1;
  if (hour >= 8 && hour <= 18) timeMultiplier = 1.5; // Peak hours
  if (hour >= 17 && hour <= 20) timeMultiplier = 2; // Evening peak

  // Day-based factors
  const day = date.getDay();
  let dayMultiplier = 1;
  if (day === 0 || day === 6) dayMultiplier = 1.3; // Weekend

  const predictedDemand = Math.round(baseDemand * timeMultiplier * dayMultiplier);

  return {
    service,
    date,
    predictedDemand,
    confidence: 0.85
  };
};

// Emergency Response AI
export const analyzeEmergency = async (emergency) => {
  const analysis = {
    severity: emergency.severity,
    riskLevel: 'medium',
    estimatedResponseTime: 30,
    suggestedWorkers: []
  };

  // Adjust based on service type and description
  if (emergency.service.toLowerCase().includes('emergency')) {
    analysis.riskLevel = 'high';
    analysis.estimatedResponseTime = 15;
  }

  // Find nearby available workers
  const workers = await Worker.find({
    services: emergency.service,
    emergencyReady: true,
    isOnline: true
  }).populate('user');

  analysis.suggestedWorkers = workers.map(worker => ({
    worker: worker._id,
    eta: Math.floor(Math.random() * 20) + 5, // Mock ETA
    score: Math.floor(Math.random() * 40) + 60
  })).sort((a, b) => b.score - a.score);

  return analysis;
};

// Helper function
const calculateDistance = (coord1, coord2) => {
  // Haversine formula for distance calculation
  const R = 6371; // Earth's radius in km
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};