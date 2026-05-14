import express from 'express';
import authenticate from '../middleware/auth.js';
import { sendSOS } from '../controllers/emergencyController.js';

const router = express.Router();

router.post('/sos', authenticate, sendSOS);

export default router;
