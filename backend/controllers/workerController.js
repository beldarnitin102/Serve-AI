import multer from 'multer';
import Worker from '../models/Worker.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import { analyzeWorkerVerification, analyzeLiveCheck, analyzeCompletion, buildWorkerAgent } from '../services/aiService.js';

const upload = multer({ dest: 'uploads/' });

export const getWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id }).populate('user');
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWorkerProfile = async (req, res) => {
  try {
    const updates = req.body;
    const worker = await Worker.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id });
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }

    const profileMedia = {
      aadhaar: req.files?.aadhaar?.[0]?.path || worker.profileMedia?.aadhaar,
      pan: req.files?.pan?.[0]?.path || worker.profileMedia?.pan,
      certificates: [
        ...(worker.profileMedia?.certificates || []),
        ...(req.files?.certificates?.map((file) => file.path) || [])
      ],
      profileImage: req.files?.profileImage?.[0]?.path || worker.profileMedia?.profileImage,
      introVideo: req.files?.introVideo?.[0]?.path || worker.profileMedia?.introVideo,
      demoVideo: req.files?.demoVideo?.[0]?.path || worker.profileMedia?.demoVideo
    };

    const verification = await analyzeWorkerVerification({ profileMedia, workerInfo: req.body });

    worker.profileMedia = profileMedia;
    worker.verification = {
      isVerified: verification.trustScore >= 60,
      trustRating: verification.trustScore,
      score: verification.verificationScore,
      badge: verification.badge,
      report: verification.report,
      lastVerifiedAt: new Date()
    };

    worker.trustScore = verification.trustScore;
    worker.aiNotes = verification.report;
    worker.markModified('profileMedia');
    worker.markModified('verification');
    await worker.save();

    res.json({ success: true, worker, verification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const startServiceVerification = async (req, res) => {
  try {
    const bookingId = req.body.bookingId;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const worker = await Worker.findOne({ user: req.user._id });
    if (!worker || booking.worker.toString() !== worker._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized worker' });
    }

    const location = req.body.location ? JSON.parse(req.body.location) : {};
    const serviceVerification = await analyzeLiveCheck({
      selfie: req.file?.path,
      location,
      timestamp: req.body.timestamp
    });

    booking.status = 'in_progress';
    booking.tracking.startedAt = new Date();
    booking.tracking.locationUpdates.push({
      lat: serviceVerification.locationVerified ? location.coordinates.lat : 0,
      lng: serviceVerification.locationVerified ? location.coordinates.lng : 0,
      timestamp: new Date()
    });
    booking.aiRecommendations = booking.aiRecommendations || {};
    booking.aiRecommendations.serviceVerification = serviceVerification;
    await booking.save();

    res.json({ success: true, booking, serviceVerification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeService = async (req, res) => {
  try {
    const bookingId = req.body.bookingId;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const worker = await Worker.findOne({ user: req.user._id });
    if (!worker || booking.worker.toString() !== worker._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized worker' });
    }

    const completion = await analyzeCompletion({
      feedback: req.body.feedback,
      completionEvidence: req.files?.completionMedia?.[0]?.path
    });

    booking.status = 'completed';
    booking.tracking.completedAt = new Date();
    booking.aiRecommendations.completionAnalysis = completion;
    booking.paymentStatus = 'paid';
    await booking.save();

    await Review.create({
      booking: booking._id,
      reviewer: booking.user,
      reviewee: booking.worker,
      rating: Number(req.body.rating) || 5,
      comment: req.body.feedback,
      categories: {
        punctuality: Number(req.body.punctuality) || 4,
        quality: Number(req.body.quality) || 4,
        communication: Number(req.body.communication) || 4,
        professionalism: Number(req.body.professionalism) || 4
      },
      aiAnalysis: {
        sentiment: completion.customerSatisfaction,
        keywords: [],
        suggestions: [completion.report]
      }
    });

    res.json({ success: true, booking, completion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkerAssistant = async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id });
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }
    const assistant = buildWorkerAgent(worker);
    res.json({ assistant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const workerUploadMiddleware = upload.fields([
  { name: 'aadhaar', maxCount: 1 },
  { name: 'pan', maxCount: 1 },
  { name: 'certificates', maxCount: 5 },
  { name: 'profileImage', maxCount: 1 },
  { name: 'introVideo', maxCount: 1 },
  { name: 'demoVideo', maxCount: 1 }
]);

export const serviceSelfieMiddleware = upload.single('selfie');
export const completionUploadMiddleware = upload.fields([{ name: 'completionMedia', maxCount: 1 }]);
