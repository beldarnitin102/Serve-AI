import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  services: [{
    type: String,
    required: true
  }],
  experience: {
    type: Number,
    default: 0
  },
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    image: String
  }],
  availability: {
    monday: { start: String, end: String },
    tuesday: { start: String, end: String },
    wednesday: { start: String, end: String },
    thursday: { start: String, end: String },
    friday: { start: String, end: String },
    saturday: { start: String, end: String },
    sunday: { start: String, end: String }
  },
  currentLocation: {
    lat: Number,
    lng: Number
  },
  radius: {
    type: Number,
    default: 10 // km
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  completedJobs: {
    type: Number,
    default: 0
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  portfolio: [{
    title: String,
    description: String,
    images: [String],
    date: Date
  }],
  isOnline: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  aiScore: {
    trust: { type: Number, default: 0 },
    performance: { type: Number, default: 0 },
    reliability: { type: Number, default: 0 }
  },
  emergencyReady: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('Worker', workerSchema);