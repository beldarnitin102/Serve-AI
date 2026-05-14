import EmergencyRequest from '../models/EmergencyRequest.js';
import AIReport from '../models/AIReport.js';

export const sendSOS = async (req, res) => {
  try {
    const { service, description, location, severity } = req.body;
    const emergency = await EmergencyRequest.create({
      user: req.user._id,
      service,
      description,
      location,
      severity: severity || 'critical',
      aiAnalysis: {
        riskLevel: severity === 'critical' ? 'high' : 'medium',
        estimatedResponseTime: severity === 'critical' ? 25 : 45,
        suggestedWorkers: []
      }
    });

    await AIReport.create({
      type: 'emergency_analysis',
      target: emergency._id,
      targetModel: 'Booking',
      data: {
        score: emergency.aiAnalysis.estimatedResponseTime,
        confidence: 0.9,
        recommendations: ['Assign nearest certified worker', 'Send live GPS update to the user']
      }
    });

    res.status(201).json({ success: true, emergency });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
