import express from 'express';
import { Protected } from '../middleware/auth.js';
import { getUserStats } from '../controllers/stats.controller.js';

const router = express.Router();

router.get('/me', Protected, getUserStats);


export default router;
