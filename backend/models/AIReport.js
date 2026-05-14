import mongoose from 'mongoose';

const aiReportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['trust_score', 'performance', 'demand_prediction', 'fraud_detection', 'recommendation', 'emergency_analysis'],
    required: true
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetModel'
  },
  targetModel: {
    type: String,
    required: true,
    enum: ['User', 'Worker', 'Booking']
  },
  data: {
    score: Number,
    confidence: Number,
    factors: [{
      name: String,
      weight: Number,
      value: Number
    }],
    predictions: mongoose.Schema.Types.Mixed,
    recommendations: [String],
    alerts: [{
      level: String,
      message: String
    }]
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }
});

export default mongoose.model('AIReport', aiReportSchema);