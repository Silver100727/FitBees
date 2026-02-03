import express from 'express';
import {
  getWeeklySales,
  getRevenueByType,
  getMembershipDistribution,
  getClientGrowth,
  getTrainerPerformance,
  getTrafficSources,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/sales', getWeeklySales);
router.get('/revenue-by-type', getRevenueByType);
router.get('/membership-distribution', getMembershipDistribution);
router.get('/client-growth', getClientGrowth);
router.get('/trainer-performance', getTrainerPerformance);
router.get('/traffic-sources', getTrafficSources);

export default router;
