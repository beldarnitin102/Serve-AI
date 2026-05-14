import express from 'express';
import authenticate from '../middleware/auth.js';
import {
  getAllUsers,
  getAllWorkers,
  getAllBookings,
  getAnalytics,
  getEmergencyRequests,
  updateUserStatus
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/users', authenticate, getAllUsers);
router.get('/workers', authenticate, getAllWorkers);
router.get('/bookings', authenticate, getAllBookings);
router.get('/analytics', authenticate, getAnalytics);
router.get('/emergency', authenticate, getEmergencyRequests);
router.put('/users/:id/status', authenticate, updateUserStatus);

export default router;
