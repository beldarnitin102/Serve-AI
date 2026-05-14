import express from 'express';
import authenticate from '../middleware/auth.js';
import { getTrustScore, fraudDetection, demandPrediction } from '../controllers/aiController.js';

const router = express.Router();

router.get('/trust-score/:userId', authenticate, getTrustScore);
router.post('/fraud-detection', authenticate, fraudDetection);
router.get('/demand-prediction', authenticate, demandPrediction);

export default router;
