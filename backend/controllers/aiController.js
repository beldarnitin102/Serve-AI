import AIReport from '../models/AIReport.js';
import Worker from '../models/Worker.js';
import Booking from '../models/Booking.js';
import { computeWorkerTrust, detectFraud, predictDemand } from '../services/aiService.js';

export const getTrustScore = async (req, res) => {
  try {
    const userId = req.params.userId;

    const worker = await Worker.findOne({ user: userId });
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    const trustData = computeWorkerTrust(worker);
    const report = await AIReport.create({
      type: 'trust_score',
      target: worker._id,
      targetModel: 'Worker',
      data: {
        score: trustData.trustScore,
        confidence: 0.85,
        factors: [
          { name: 'verification', weight: 0.25, value: worker.verification?.trustRating || 0 },
          { name: 'ratings', weight: 0.20, value: worker.trustFactors?.ratings || 0 },
          { name: 'punctuality', weight: 0.15, value: worker.trustFactors?.punctuality || 0 },
          { name: 'complaints', weight: 0.15, value: 5 - (worker.trustFactors?.complaints || 0) },
          { name: 'customerSentiment', weight: 0.25, value: worker.trustFactors?.customerSentiment || 0 }
        ]
      }
    });

    res.json({ trustScore: trustData.trustScore, badge: trustData.badge, explanation: trustData.explanation, report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fraudDetection = async (req, res) => {
  try {
    const { booking, payment, history } = req.body;
    const analysis = await detectFraud({ booking, payment, history });
    await AIReport.create({
      type: 'fraud_detection',
      target: booking?.id || req.user._id,
      targetModel: booking?.id ? 'Booking' : 'User',
      data: analysis
    });
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const demandPrediction = async (req, res) => {
  try {
    const { service, location, date } = req.query;
    const prediction = await predictDemand({ service, location, date });
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
