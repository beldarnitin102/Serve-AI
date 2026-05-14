import mongoose from 'mongoose';

const emergencyRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'high'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'resolved', 'cancelled'],
    default: 'pending'
  },
  assignedWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker'
  },
  aiAnalysis: {
    riskLevel: String,
    estimatedResponseTime: Number,
    suggestedWorkers: [{
      worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
      eta: Number,
      score: Number
    }]
  },
  response: {
    acceptedAt: Date,
    arrivedAt: Date,
    resolvedAt: Date,
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

emergencyRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('EmergencyRequest', emergencyRequestSchema);