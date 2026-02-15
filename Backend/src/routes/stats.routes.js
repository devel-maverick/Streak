import express from 'express';
import { Protected } from '../middleware/auth.js';
import { triggerUserSync, getUserStats, getSubmissionActivity } from '../controllers/stats.controller.js';

const router = express.Router();

// Protected routes
router.post('/sync', Protected, triggerUserSync);
router.get('/me', Protected, getUserStats);
router.get('/submission-activity/:platform', Protected, getSubmissionActivity);

export default router;
