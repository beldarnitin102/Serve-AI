import Booking from '../models/Booking.js';
import Worker from '../models/Worker.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Message from '../models/Message.js';
import { analyzeCompletion } from '../services/aiService.js';
import { emitToUser } from '../socket/socket.js';

export const createBooking = async (req, res) => {
  try {
    const { workerId, service, description, scheduledDate, scheduledTime, location, priority } = req.body;

    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      worker: worker._id,
      service,
      description,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      location,
      priority: priority || 'normal',
      price: {
        base: worker.hourlyRate || 200,
        tax: Math.round((worker.hourlyRate || 200) * 0.08),
        total: Math.round((worker.hourlyRate || 200) * 1.08)
      },
      aiRecommendations: {
        estimatedTime: 45,
        riskLevel: 'low'
      }
    });

    const io = req.app.get('io');
    if (worker.user) {
      // Persist notification
      await Notification.create({
        recipient: worker.user,
        title: 'New Booking Request',
        message: `You have a new ${booking.service} request from ${req.user.name}`,
        type: 'new_booking',
        link: `/worker/jobs`
      });

      io.to(worker.user.toString()).emit('new_booking', {
        bookingId: booking._id,
        service: booking.service,
        customerName: req.user.name,
        location: booking.location,
        priority: booking.priority,
        message: 'You have a new service request!'
      });
    }

    res.status(201).json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({ path: 'worker', populate: { path: 'user', select: 'name email profileImage' } })
      .populate('user', 'name email profileImage');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkerBookings = async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id });
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }
    const bookings = await Booking.find({ worker: worker._id })
      .populate({ path: 'worker', populate: { path: 'user', select: 'name email profileImage' } })
      .populate('user', 'name email profileImage');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({ path: 'worker', populate: { path: 'user', select: 'name email profileImage' } })
      .populate('user', 'name email profileImage');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const worker = await Worker.findOne({ user: req.user._id });
    const isUserOwner = booking.user.toString() === req.user._id.toString();
    const isWorkerAssigned = worker && booking.worker.toString() === worker._id.toString();

    if (req.user.role === 'user' && !isUserOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'worker' && !isWorkerAssigned) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const io = req.app.get('io');
    const booking = await Booking.findById(req.params.id).populate('worker user');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const worker = await Worker.findOne({ user: req.user._id });
    const isUserOwner = booking.user?._id.toString() === req.user._id.toString();
    const isWorkerAssigned = worker && booking.worker?._id.toString() === worker._id.toString();

    const status = req.body.status;

    if (req.user.role === 'user' && !isUserOwner) {
      return res.status(403).json({ message: 'Access denied - Not the owner' });
    }

    if (req.user.role === 'worker' && !isWorkerAssigned) {
      return res.status(403).json({ message: 'Access denied - Not assigned to this job' });
    }

    if (req.user.role === 'worker' && !worker.verification.isVerified && false && ['accepted', 'in_progress'].includes(status)) {
      return res.status(403).json({ message: 'Complete profile verification before updating this booking' });
    }

    booking.status = status;
    if (status === 'accepted') {
      booking.acceptedAt = new Date();
      
      // AI AUTO-MESSAGE: Worker to User
      try {
        const aiText = `Hello! I have accepted your ${booking.service} request. I am starting my journey and will reach your location within 10-15 minutes. See you soon!`;
        
        await Message.create({
          booking: booking._id,
          sender: req.user._id, // The worker
          receiver: booking.user._id, // The user
          text: aiText
        });

        io?.to(booking.user._id.toString()).emit('receive_message', {
          bookingId: booking._id,
          senderId: req.user._id,
          text: aiText,
          createdAt: new Date(),
          isAI: true
        });
      } catch (err) {
        console.error('Failed to send auto-acceptance message:', err.message);
      }
    }
    if (status === 'completed') {
      booking.tracking.completedAt = new Date();
      booking.paymentStatus = 'paid';
      
      // AI Completion Audit
      const aiAudit = await analyzeCompletion({
        feedback: req.body.feedback,
        completionEvidence: req.body.completionEvidence
      });
      
      booking.aiRecommendations = {
        ...booking.aiRecommendations,
        satisfactionScore: aiAudit.qualityScore,
        fraudRisk: aiAudit.fraudRisk,
        completionReport: aiAudit.report
      };

      // Update worker trust factors
      if (worker) {
        worker.trustFactors.customerSentiment = Math.round((worker.trustFactors.customerSentiment + (aiAudit.qualityScore / 20)) / 2);
        worker.completedJobs += 1;
        await worker.save();
      }
    }
    if (status === 'in_progress' && !booking.tracking.startedAt) {
      booking.tracking.startedAt = new Date();
    }

    await booking.save();

    const payload = {
      bookingId: booking._id,
      status,
      message: `Booking status updated to ${status}`,
      aiAudit: status === 'completed' ? booking.aiRecommendations : null
    };

    if (booking.user) {
      // Save notification for user
      await Notification.create({
        recipient: booking.user._id,
        title: 'Booking Update',
        message: `Your booking for ${booking.service} is now ${status}`,
        type: 'booking_update',
        link: `/user/bookings`
      });
      io?.to(booking.user._id.toString()).emit('booking_status_changed', payload);
    }

    if (worker && worker.user) {
      // Save notification for worker
      await Notification.create({
        recipient: worker.user,
        title: 'Work Completed',
        message: `Job for ${booking.service} has been marked as ${status}`,
        type: 'booking_update',
        link: `/worker/bookings`
      });
      io?.to(req.user._id.toString()).emit('booking_status_changed', payload);
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const claimGuarantee = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('worker');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Check if user is owner
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check 24 hour window
    const completionTime = booking.tracking.completedAt;
    if (!completionTime || (Date.now() - completionTime.getTime() > 24 * 60 * 60 * 1000)) {
      return res.status(400).json({ message: 'Guarantee window (24h) has expired' });
    }

    booking.guarantee.isClaimed = true;
    booking.guarantee.claimedAt = new Date();
    booking.guarantee.reason = req.body.reason;
    booking.guarantee.status = 'pending';
    booking.paymentStatus = 'frozen';

    await booking.save();

    // Notify worker
    const worker = await Worker.findById(booking.worker._id).populate('user');
    if (worker && worker.user) {
      const notification = await Notification.create({
        recipient: worker.user._id,
        title: 'Payment Frozen: Guarantee Claimed',
        message: `A customer has claimed a guarantee for your ${booking.service} job. Payment is frozen pending review.`,
        type: 'alert',
        link: `/worker/bookings`
      });
      
      // Emit real-time notification
      emitToUser(worker.user._id.toString(), 'new_notification', {
        notification,
        bookingId: booking._id
      });
      
      // Emit booking update for real-time dashboard refresh
      emitToUser(worker.user._id.toString(), 'booking_update', {
        bookingId: booking._id,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        guarantee: booking.guarantee
      });
    }

    res.json({ message: 'Guarantee claimed. Payment has been frozen.', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const booking = await Booking.findById(req.params.id).populate('worker');
    
    if (!booking || booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed jobs' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ booking: booking._id });
    if (existingReview) return res.status(400).json({ message: 'Review already submitted' });

    const review = await Review.create({
      booking: booking._id,
      reviewer: req.user._id,
      reviewee: booking.worker._id,
      rating,
      comment
    });

    // Update worker average rating
    const worker = await Worker.findById(booking.worker._id);
    const totalReviews = worker.totalReviews + 1;
    const newRating = ((worker.rating * worker.totalReviews) + rating) / totalReviews;
    
    worker.rating = newRating;
    worker.totalReviews = totalReviews;
    await worker.save();

    res.json({ message: 'Review submitted successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
