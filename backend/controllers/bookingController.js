import Booking from '../models/Booking.js';
import Worker from '../models/Worker.js';
import User from '../models/User.js';

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

    res.status(201).json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('worker user');
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
    const bookings = await Booking.find({ worker: worker._id }).populate('worker user');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('worker user');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const status = req.body.status;
    booking.status = status;
    if (status === 'completed') {
      booking.tracking.completedAt = new Date();
      booking.paymentStatus = 'paid';
    }
    if (status === 'in_progress' && !booking.tracking.startedAt) {
      booking.tracking.startedAt = new Date();
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
