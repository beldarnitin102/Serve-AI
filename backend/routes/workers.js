import express from 'express';
import authenticate from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import {
  getWorkerProfile,
  updateWorkerProfile,
  verifyWorkerProfile,
  acceptWorkerJob,
  startServiceVerification,
  completeService,
  getWorkerAssistant,
  getAvailableWorkerJobs,
  getAvailableWorkers,
  workerUploadMiddleware,
  serviceSelfieMiddleware,
  completionUploadMiddleware
} from '../controllers/workerController.js';

const router = express.Router();

router.get('/profile', authenticate, authorizeRoles('worker'), getWorkerProfile);
router.put('/profile', authenticate, authorizeRoles('worker'), updateWorkerProfile);
router.get('/available-jobs', authenticate, authorizeRoles('worker'), getAvailableWorkerJobs);
router.get('/available-workers', authenticate, getAvailableWorkers); // Users and workers can see verified workers
router.post('/verify-profile', authenticate, authorizeRoles('worker'), workerUploadMiddleware, verifyWorkerProfile);
router.post('/accept/:id', authenticate, authorizeRoles('worker'), acceptWorkerJob);
router.post('/start-service', authenticate, authorizeRoles('worker'), serviceSelfieMiddleware, startServiceVerification);
router.post('/complete-service', authenticate, authorizeRoles('worker'), completionUploadMiddleware, completeService);
router.get('/assistant', authenticate, authorizeRoles('worker'), getWorkerAssistant);

export default router;
