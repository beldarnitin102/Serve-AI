import express from 'express';
import { getMessages, sendMessage } from '../controllers/chatController.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

router.get('/:bookingId', authenticate, getMessages);
router.post('/', authenticate, sendMessage);

export default router;
