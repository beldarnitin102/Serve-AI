import multer from 'multer';
import Worker from '../models/Worker.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import { analyzeWorkerVerification, analyzeLiveCheck, analyzeCompletion, buildWorkerAgent } from '../services/aiService.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';

const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

const getUploadedMedia = async (files = {}) => {
  const media = {};

  if (files.aadhaar?.[0]) {
    media.aadhaar = await uploadToCloudinary(files.aadhaar[0], 'servai/worker_docs');
  }
  if (files.pan?.[0]) {
    media.pan = await uploadToCloudinary(files.pan[0], 'servai/worker_docs');
  }
  if (files.certificates?.length) {
    media.certificates = await Promise.all(
      files.certificates.map((file) => uploadToCloudinary(file, 'servai/worker_certificates'))
    );
  }
  if (files.profileImage?.[0]) {
    media.profileImage = await uploadToCloudinary(files.profileImage[0], 'servai/worker_profiles');
  }
  if (files.introVideo?.[0]) {
    media.introVideo = await uploadToCloudinary(files.introVideo[0], 'servai/worker_intros');
  }
  if (files.demoVideo?.[0]) {
    media.demoVideo = await uploadToCloudinary(files.demoVideo[0], 'servai/worker_demos');
  }

  return media;
};

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
    const worker = await Worker.findOne({ user: req.user._id });
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }

    if (updates.services) {
      worker.services = Array.isArray(updates.services) ? updates.services : updates.services.split(',').map((item) => item.trim());
    }
    if (updates.experience !== undefined) worker.experience = Number(updates.experience);
    if (updates.hourlyRate !== undefined) worker.hourlyRate = Number(updates.hourlyRate);
    if (updates.bio) worker.bio = updates.bio;
    if (updates.currentLocation) worker.currentLocation = updates.currentLocation;
    if (updates.availability) worker.availability = updates.availability;
    if (updates.portfolio) worker.portfolio = updates.portfolio;

    await worker.save();
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableWorkerJobs = async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id });
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }

    const jobs = await Booking.find({ status: 'pending' })
      .populate('user worker')
      .sort({ scheduledDate: 1 });

    const response = jobs.map((job) => ({
      id: job._id,
      service: job.service,
      description: job.description,
      scheduledDate: job.scheduledDate,
      scheduledTime: job.scheduledTime,
      location: job.location,
      amount: job.price.total,
      distance: job.location?.distance || 0,
      customer: {
        name: job.user?.name,
        rating: job.user?.trustScore || 4,
      },
      urgency: job.priority,
      aiMatchScore: 80 + (worker.verification.isVerified ? 10 : 0),
      estimatedDuration: job.aiRecommendations?.estimatedTime || '2 hours'
    }));

    res.json({ jobs: response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableWorkers = async (req, res) => {
  try {
    const { service } = req.query;
    let query = { 'verification.isVerified': true };
    if (service) {
      query.services = { $in: [new RegExp(service, 'i')] };
    }

    let workers = await Worker.find(query).populate('user', 'name email profileImage');
    
    // DEMO FALLBACK: If no workers match the specific service, return ALL workers
    // This ensures the hackathon demo always shows at least one professional to book
    if (workers.length === 0) {
      workers = await Worker.find({}).populate('user', 'name email profileImage');
    }

    res.json(workers);
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

    const uploadedMedia = await getUploadedMedia(req.files);
    const profileMedia = {
      ...worker.profileMedia,
      ...uploadedMedia,
      certificates: [
        ...(worker.profileMedia?.certificates || []),
        ...(uploadedMedia.certificates || [])
      ]
    };

    const workerInfo = {
      experience: Number(req.body.experience) || worker.experience,
      services: req.body.services ? updatesToArray(req.body.services) : worker.services,
      hourlyRate: Number(req.body.hourlyRate) || worker.hourlyRate
    };

    const verification = await analyzeWorkerVerification({ profileMedia, workerInfo });

    // Sync profile image and trust score to User model
    const userUpdate = { trustScore: verification.trustScore };
    if (uploadedMedia.profileImage) {
      userUpdate.profileImage = uploadedMedia.profileImage;
    }
    await req.user.constructor.findByIdAndUpdate(req.user._id, userUpdate);

    worker.profileMedia = profileMedia;
    worker.verification = {
      isVerified: verification.trustScore >= 40, // More lenient for demo access
      trustRating: verification.trustScore,
      score: verification.verificationScore,
      badge: verification.badge,
      report: verification.report,
      lastVerifiedAt: new Date()
    };
    
    // Save enhanced metrics
    worker.aiScore = {
      trust: verification.trustScore,
      performance: verification.metrics.professionalism,
      reliability: verification.metrics.reliability
    };
    
    worker.trustFactors.verificationQuality = Math.round(verification.trustScore / 20);

    await worker.save();

    res.json({ success: true, worker, verification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatesToArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export const acceptWorkerJob = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const worker = await Worker.findOne({ user: req.user._id });
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }

    // STRICT VERIFICATION CHECK DISABLED FOR TESTING
    /*
    if (!worker.verification.isVerified) {
      return res.status(403).json({ 
        message: 'Action restricted: Complete AI profile verification first',
        needsVerification: true 
      });
    }
    */

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking is no longer available' });
    }

    booking.status = 'accepted';
    booking.worker = worker._id;
    booking.acceptedAt = new Date();
    await booking.save();

    const io = req.app.get('io');
    io?.to(booking.user.toString()).emit('booking_status_changed', {
      bookingId: booking._id,
      status: 'accepted',
      workerId: worker._id,
      message: 'Your service provider has accepted the job.'
    });
    io?.to(req.user._id.toString()).emit('new_booking', {
      bookingId: booking._id,
      status: 'accepted'
    });

    res.json({ success: true, booking });
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

    if (!worker.verification.isVerified) {
      return res.status(403).json({ message: 'Profile verification needed before starting work' });
    }

    const selfieUrl = req.file ? await uploadToCloudinary(req.file, 'servai/worker_live_selfies') : null;
    const location = req.body.location ? JSON.parse(req.body.location) : {};
    const serviceVerification = await analyzeLiveCheck({
      selfie: selfieUrl,
      location,
      timestamp: req.body.timestamp || new Date().toISOString()
    });

    booking.status = 'in_progress';
    booking.tracking.startedAt = new Date();
    booking.tracking.locationUpdates = booking.tracking.locationUpdates || [];
    booking.tracking.locationUpdates.push({
      lat: serviceVerification.locationVerified ? location.coordinates?.lat : 0,
      lng: serviceVerification.locationVerified ? location.coordinates?.lng : 0,
      timestamp: new Date()
    });
    booking.aiRecommendations = booking.aiRecommendations || {};
    booking.aiRecommendations.serviceVerification = serviceVerification;
    await booking.save();

    const io = req.app.get('io');
    io?.to(booking.user.toString()).emit('booking_status_changed', {
      bookingId: booking._id,
      status: 'in_progress',
      message: 'Worker has started the job and your location is being tracked.'
    });

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

    const completionUrl = req.files?.completionMedia?.[0]
      ? await uploadToCloudinary(req.files.completionMedia[0], 'servai/worker_completions')
      : null;

    const completion = await analyzeCompletion({
      feedback: req.body.feedback,
      completionEvidence: completionUrl
    });

    booking.status = 'completed';
    booking.tracking.completedAt = new Date();
    booking.aiRecommendations = booking.aiRecommendations || {};
    booking.aiRecommendations.completionAnalysis = completion;
    booking.paymentStatus = 'paid';
    booking.completionMedia = completionUrl ? [completionUrl] : booking.completionMedia || [];
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

    const io = req.app.get('io');
    io?.to(booking.user.toString()).emit('booking_status_changed', {
      bookingId: booking._id,
      status: 'completed',
      message: 'Service completed successfully. Please review your worker.'
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
