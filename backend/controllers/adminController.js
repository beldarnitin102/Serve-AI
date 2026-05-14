import User from '../models/User.js';
import Worker from '../models/Worker.js';
import Booking from '../models/Booking.js';
import EmergencyRequest from '../models/EmergencyRequest.js';

export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin privileges required' });
    }
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllWorkers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin privileges required' });
    }
    const workers = await Worker.find().populate('user');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin privileges required' });
    }
    const bookings = await Booking.find().populate('worker user');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin privileges required' });
    }

    const totalUsers = await User.countDocuments();
    const totalWorkers = await Worker.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const completed = await Booking.countDocuments({ status: 'completed' });
    const emergency = await Booking.countDocuments({ priority: 'emergency' });
    const avgTrust = await Worker.aggregate([
      { $group: { _id: null, averageTrust: { $avg: '$trustScore' } } }
    ]);

    res.json({
      totalUsers,
      totalWorkers,
      totalBookings,
      completed,
      emergency,
      averageTrust: avgTrust[0]?.averageTrust || 0,
      fraudHeatmap: {
        zones: ['North', 'South', 'East', 'West'],
        riskLevels: [30, 45, 20, 55]
      },
      demandPrediction: {
        topCategories: ['Plumbing', 'Electrical', 'Cleaning'],
        expectedGrowth: '12%'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmergencyRequests = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin privileges required' });
    }
    const requests = await EmergencyRequest.find().populate('user assignedWorker');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin privileges required' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.role = req.body.role || user.role;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
