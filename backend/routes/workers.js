import express from 'express';
import authenticate from '../middleware/auth.js';
import {
  getWorkerProfile,
  updateWorkerProfile,
  verifyWorkerProfile,
  startServiceVerification,
  completeService,
  getWorkerAssistant,
  workerUploadMiddleware,
  serviceSelfieMiddleware,
  completionUploadMiddleware
} from '../controllers/workerController.js';

const router = express.Router();

router.get('/profile', authenticate, getWorkerProfile);
router.put('/profile', authenticate, updateWorkerProfile);
router.post('/verify-profile', authenticate, workerUploadMiddleware, verifyWorkerProfile);
router.post('/start-service', authenticate, serviceSelfieMiddleware, startServiceVerification);
router.post('/complete-service', authenticate, completionUploadMiddleware, completeService);
router.get('/assistant', authenticate, getWorkerAssistant);

export default router;
