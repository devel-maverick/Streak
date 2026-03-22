import express from 'express';
import { Protected } from '../middleware/auth.js';
import { triggerUserSync, getUserStats } from '../controllers/stats.controller.js';

const router = express.Router();

// Protected routes
router.post('/sync', Protected, triggerUserSync);
router.get('/me', Protected, getUserStats);


export default router;
