import express from 'express';
import authenticate from '../middleware/auth.js';
import {
  createBooking,
  getUserBookings,
  getWorkerBookings,
  getBookingById,
  updateBookingStatus
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', authenticate, createBooking);
router.get('/user', authenticate, getUserBookings);
router.get('/worker', authenticate, getWorkerBookings);
router.get('/:id', authenticate, getBookingById);
router.put('/:id/status', authenticate, updateBookingStatus);

export default router;
