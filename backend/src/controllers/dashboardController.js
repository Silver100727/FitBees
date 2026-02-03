import Client from '../models/Client.js';
import Trainer from '../models/Trainer.js';
import Payment from '../models/Payment.js';
import Activity from '../models/Activity.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { calculatePercentageChange } from '../utils/helpers.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Get current month stats
  const [
    totalClients,
    activeClients,
    totalTrainers,
    availableTrainers,
    lastMonthClients,
    lastMonthActiveClients,
    lastMonthTrainers,
    lastMonthAvailableTrainers,
  ] = await Promise.all([
    Client.countDocuments(),
    Client.countDocuments({ status: 'active' }),
    Trainer.countDocuments({ status: { $ne: 'terminated' } }),
    Trainer.countDocuments({ status: 'available' }),
    Client.countDocuments({ createdAt: { $lt: firstDayOfMonth } }),
    Client.countDocuments({
      status: 'active',
      createdAt: { $lt: firstDayOfMonth },
    }),
    Trainer.countDocuments({
      status: { $ne: 'terminated' },
      createdAt: { $lt: firstDayOfMonth },
    }),
    Trainer.countDocuments({
      status: 'available',
      createdAt: { $lt: firstDayOfMonth },
    }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalClients: {
        value: totalClients,
        change: calculatePercentageChange(totalClients, lastMonthClients),
      },
      activeClients: {
        value: activeClients,
        change: calculatePercentageChange(activeClients, lastMonthActiveClients),
      },
      totalTrainers: {
        value: totalTrainers,
        change: calculatePercentageChange(totalTrainers, lastMonthTrainers),
      },
      activeTrainers: {
        value: availableTrainers,
        change: calculatePercentageChange(availableTrainers, lastMonthAvailableTrainers),
      },
    },
  });
});

// @desc    Get revenue summary
// @route   GET /api/dashboard/revenue
// @access  Private
export const getRevenueSummary = asyncHandler(async (req, res) => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Get revenue stats
  const [currentMonthRevenue, lastMonthRevenue, pendingPayments, failedPayments] =
    await Promise.all([
      Payment.aggregate([
        {
          $match: {
            status: 'completed',
            transactionDate: { $gte: firstDayOfMonth },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Payment.aggregate([
        {
          $match: {
            status: 'completed',
            transactionDate: {
              $gte: firstDayOfLastMonth,
              $lt: firstDayOfMonth,
            },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Payment.aggregate([
        { $match: { status: 'pending' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Payment.countDocuments({ status: 'failed' }),
    ]);

  const currentRevenue = currentMonthRevenue[0]?.total || 0;
  const previousRevenue = lastMonthRevenue[0]?.total || 0;
  const pending = pendingPayments[0] || { total: 0, count: 0 };

  res.status(200).json({
    success: true,
    data: {
      totalRevenue: {
        value: currentRevenue,
        change: calculatePercentageChange(currentRevenue, previousRevenue),
      },
      pendingPayments: {
        value: pending.total,
        count: pending.count,
      },
      completedTransactions: await Payment.countDocuments({
        status: 'completed',
        transactionDate: { $gte: firstDayOfMonth },
      }),
      failedTransactions: failedPayments,
    },
  });
});

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private
export const getRecentActivities = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const activities = await Activity.find()
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .populate('performedBy', 'name avatar');

  res.status(200).json({
    success: true,
    data: activities,
  });
});

// @desc    Get weekly sales data for chart
// @route   GET /api/dashboard/weekly-sales
// @access  Private
export const getWeeklySales = asyncHandler(async (req, res) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const salesData = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        transactionDate: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$transactionDate' },
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Fill in missing days with zero values
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    const dayData = salesData.find((d) => d._id === dateStr);
    result.push({
      date: dateStr,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      total: dayData?.total || 0,
      count: dayData?.count || 0,
    });
  }

  res.status(200).json({
    success: true,
    data: result,
  });
});
