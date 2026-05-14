import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  service: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    start: String,
    end: String
  },
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'emergency'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['normal', 'urgent', 'emergency'],
    default: 'normal'
  },
  price: {
    base: Number,
    tax: Number,
    total: Number
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'frozen'],
    default: 'pending'
  },
  guarantee: {
    isClaimed: { type: Boolean, default: false },
    claimedAt: Date,
    reason: String,
    status: { type: String, enum: ['none', 'pending', 'resolved'], default: 'none' }
  },
  aiRecommendations: {
    suggestedWorkers: [{
      worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
      score: Number,
      reason: String
    }],
    estimatedTime: Number,
    riskLevel: String
  },
  tracking: {
    startedAt: Date,
    completedAt: Date,
    locationUpdates: [{
      lat: Number,
      lng: Number,
      timestamp: Date
    }]
  },
  emergency: {
    isEmergency: { type: Boolean, default: false },
    escalatedAt: Date,
    responseTime: Number // minutes
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Booking', bookingSchema);