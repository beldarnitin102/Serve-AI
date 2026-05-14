import express from 'express';
import authenticate from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import {
  createBooking,
  getUserBookings,
  getWorkerBookings,
  getBookingById,
  updateBookingStatus,
  claimGuarantee,
  submitReview
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('user'), createBooking);
router.get('/user', authenticate, authorizeRoles('user'), getUserBookings);
router.get('/worker', authenticate, authorizeRoles('worker'), getWorkerBookings);
router.get('/:id', authenticate, getBookingById);
router.put('/:id/status', authenticate, updateBookingStatus);
router.post('/:id/claim-guarantee', authenticate, authorizeRoles('user'), claimGuarantee);
router.post('/:id/review', authenticate, authorizeRoles('user'), submitReview);

export default router;
