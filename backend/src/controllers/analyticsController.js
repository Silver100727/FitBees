import Payment from '../models/Payment.js';
import Client from '../models/Client.js';
import Trainer from '../models/Trainer.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get weekly sales data
// @route   GET /api/analytics/sales
// @access  Private
export const getWeeklySales = asyncHandler(async (req, res) => {
  const { period = 'week' } = req.query;
  const now = new Date();
  let startDate;

  switch (period) {
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  const salesData = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        transactionDate: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: period === 'year' ? '%Y-%m' : '%Y-%m-%d',
            date: '$transactionDate',
          },
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Format for chart
  const formattedData = salesData.map((item) => ({
    date: item._id,
    sales: item.total,
    transactions: item.count,
  }));

  res.status(200).json({
    success: true,
    data: formattedData,
  });
});

// @desc    Get revenue by payment type
// @route   GET /api/analytics/revenue-by-type
// @access  Private
export const getRevenueByType = asyncHandler(async (req, res) => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const revenueByType = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        transactionDate: { $gte: firstDayOfMonth },
      },
    },
    {
      $group: {
        _id: '$paymentType',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  // Calculate total for percentages
  const totalRevenue = revenueByType.reduce((sum, item) => sum + item.total, 0);

  const formattedData = revenueByType.map((item) => ({
    type: item._id,
    amount: item.total,
    count: item.count,
    percentage: totalRevenue ? Math.round((item.total / totalRevenue) * 100) : 0,
  }));

  res.status(200).json({
    success: true,
    data: formattedData,
  });
});

// @desc    Get membership distribution
// @route   GET /api/analytics/membership-distribution
// @access  Private
export const getMembershipDistribution = asyncHandler(async (req, res) => {
  const distribution = await Client.aggregate([
    {
      $group: {
        _id: '$membershipType',
        count: { $sum: 1 },
      },
    },
  ]);

  const total = distribution.reduce((sum, item) => sum + item.count, 0);

  const formattedData = distribution.map((item) => ({
    type: item._id,
    count: item.count,
    percentage: total ? Math.round((item.count / total) * 100) : 0,
  }));

  res.status(200).json({
    success: true,
    data: formattedData,
  });
});

// @desc    Get client growth data
// @route   GET /api/analytics/client-growth
// @access  Private
export const getClientGrowth = asyncHandler(async (req, res) => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

  const growthData = await Client.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m', date: '$createdAt' },
        },
        newClients: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Calculate cumulative total
  let cumulative = await Client.countDocuments({
    createdAt: { $lt: sixMonthsAgo },
  });

  const formattedData = growthData.map((item) => {
    cumulative += item.newClients;
    return {
      month: item._id,
      newClients: item.newClients,
      totalClients: cumulative,
    };
  });

  res.status(200).json({
    success: true,
    data: formattedData,
  });
});

// @desc    Get trainer performance
// @route   GET /api/analytics/trainer-performance
// @access  Private
export const getTrainerPerformance = asyncHandler(async (req, res) => {
  const trainers = await Trainer.find({ status: { $ne: 'terminated' } })
    .select('firstName lastName rating totalClients sessionsThisWeek totalSessions')
    .sort('-rating');

  // Get client counts for each trainer
  const trainerData = await Promise.all(
    trainers.map(async (trainer) => {
      const clientCount = await Client.countDocuments({
        assignedTrainer: trainer._id,
        status: 'active',
      });

      return {
        id: trainer._id,
        name: trainer.fullName,
        rating: trainer.rating,
        clients: clientCount,
        sessionsThisWeek: trainer.sessionsThisWeek,
        totalSessions: trainer.totalSessions,
      };
    })
  );

  res.status(200).json({
    success: true,
    data: trainerData,
  });
});

// @desc    Get traffic sources (membership sources)
// @route   GET /api/analytics/traffic-sources
// @access  Private
export const getTrafficSources = asyncHandler(async (req, res) => {
  // This would typically come from tracking data
  // For now, returning payment method distribution as a proxy
  const sources = await Payment.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: '$paymentMethod',
        count: { $sum: 1 },
        amount: { $sum: '$amount' },
      },
    },
  ]);

  const total = sources.reduce((sum, item) => sum + item.count, 0);

  const formattedData = sources.map((item) => ({
    source: item._id,
    count: item.count,
    amount: item.amount,
    percentage: total ? Math.round((item.count / total) * 100) : 0,
  }));

  res.status(200).json({
    success: true,
    data: formattedData,
  });
});
