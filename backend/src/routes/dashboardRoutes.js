import express from 'express';
import {
  getDashboardStats,
  getRevenueSummary,
  getRecentActivities,
  getWeeklySales,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/revenue', getRevenueSummary);
router.get('/activities', getRecentActivities);
router.get('/weekly-sales', getWeeklySales);

export default router;
