import Payment from '../models/Payment.js';
import Client from '../models/Client.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { paginate, addSearchToFilter, buildFilter } from '../utils/helpers.js';
import { logActivity, ActivityTypes, createActivityDescription } from '../services/activityService.js';
import { createNotification, NotificationTemplates } from '../services/notificationService.js';
import { sendPaymentReceiptEmail } from '../services/emailService.js';

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
export const getPayments = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = '-transactionDate',
    search,
    status,
    paymentType,
    paymentMethod,
    dateFrom,
    dateTo,
  } = req.query;

  // Build filter
  let filter = buildFilter({ status, paymentType, paymentMethod });

  // Date range filter
  if (dateFrom || dateTo) {
    filter.transactionDate = {};
    if (dateFrom) filter.transactionDate.$gte = new Date(dateFrom);
    if (dateTo) filter.transactionDate.$lte = new Date(dateTo);
  }

  // Paginate
  const result = await paginate(Payment, filter, {
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
    populate: { path: 'client', select: 'firstName lastName email' },
  });

  // Add search on populated client name if needed
  if (search) {
    // For searching client name, we need to do it differently
    const clientIds = await Client.find({
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    }).select('_id');

    filter.$or = [
      { invoiceNumber: { $regex: search, $options: 'i' } },
      { client: { $in: clientIds.map((c) => c._id) } },
    ];

    const searchResult = await paginate(Payment, filter, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      populate: { path: 'client', select: 'firstName lastName email' },
    });

    return res.status(200).json({
      success: true,
      ...searchResult,
    });
  }

  res.status(200).json({
    success: true,
    ...result,
  });
});

// @desc    Get payment stats
// @route   GET /api/payments/stats
// @access  Private
export const getPaymentStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    totalRevenue,
    lastMonthRevenue,
    pendingAmount,
    completedCount,
    failedCount,
  ] = await Promise.all([
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
          transactionDate: { $gte: firstDayOfLastMonth, $lt: firstDayOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Payment.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Payment.countDocuments({
      status: 'completed',
      transactionDate: { $gte: firstDayOfMonth },
    }),
    Payment.countDocuments({
      status: 'failed',
      transactionDate: { $gte: firstDayOfMonth },
    }),
  ]);

  const currentRevenue = totalRevenue[0]?.total || 0;
  const previousRevenue = lastMonthRevenue[0]?.total || 0;
  const change = previousRevenue
    ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
    : 0;

  res.status(200).json({
    success: true,
    data: {
      totalRevenue: currentRevenue,
      revenueChange: Math.round(change * 10) / 10,
      pendingPayments: pendingAmount[0]?.total || 0,
      completedTransactions: completedCount,
      failedTransactions: failedCount,
    },
  });
});

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
export const getPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('client', 'firstName lastName email phone')
    .populate('trainer', 'firstName lastName')
    .populate('processedBy', 'name');

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found',
    });
  }

  res.status(200).json({
    success: true,
    data: payment,
  });
});

// @desc    Create new payment
// @route   POST /api/payments
// @access  Private
export const createPayment = asyncHandler(async (req, res) => {
  // Add processed by
  req.body.processedBy = req.user.id;

  // Set transaction date if not provided
  if (!req.body.transactionDate) {
    req.body.transactionDate = new Date();
  }

  const payment = await Payment.create(req.body);

  // Get client details for notification
  const client = await Client.findById(payment.client);

  // Log activity
  await logActivity({
    type: ActivityTypes.PAYMENT_RECEIVED,
    description: createActivityDescription(
      ActivityTypes.PAYMENT_RECEIVED,
      client?.fullName || 'Unknown Client',
      { amount: payment.amount }
    ),
    performedBy: req.user._id,
    entity: { model: 'Payment', id: payment._id, name: payment.invoiceNumber },
    metadata: { amount: payment.amount, type: payment.paymentType },
  });

  // Create notification
  await createNotification({
    user: req.user._id,
    ...NotificationTemplates.paymentReceived(client?.fullName || 'Client', payment.amount),
    reference: { model: 'Payment', id: payment._id },
  });

  // If membership payment, update client membership dates
  if (payment.paymentType === 'membership' && payment.planDetails) {
    await Client.findByIdAndUpdate(payment.client, {
      membershipStartDate: payment.planDetails.startDate,
      membershipEndDate: payment.planDetails.endDate,
      status: 'active',
    });
  }

  res.status(201).json({
    success: true,
    data: payment,
  });
});

// @desc    Update payment status
// @route   PATCH /api/payments/:id/status
// @access  Private
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found',
    });
  }

  res.status(200).json({
    success: true,
    data: payment,
  });
});

// @desc    Process refund
// @route   POST /api/payments/:id/refund
// @access  Private
export const processRefund = asyncHandler(async (req, res) => {
  const { reason, amount } = req.body;

  const payment = await Payment.findById(req.params.id).populate(
    'client',
    'firstName lastName'
  );

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found',
    });
  }

  if (payment.status !== 'completed') {
    return res.status(400).json({
      success: false,
      message: 'Only completed payments can be refunded',
    });
  }

  // Process refund
  payment.status = 'refunded';
  payment.refund = {
    amount: amount || payment.amount,
    reason,
    refundedAt: new Date(),
    refundedBy: req.user._id,
  };
  await payment.save();

  // Log activity
  await logActivity({
    type: ActivityTypes.PAYMENT_REFUNDED,
    description: createActivityDescription(
      ActivityTypes.PAYMENT_REFUNDED,
      payment.client?.fullName || 'Client'
    ),
    performedBy: req.user._id,
    entity: { model: 'Payment', id: payment._id, name: payment.invoiceNumber },
    metadata: { amount: payment.refund.amount, reason },
  });

  res.status(200).json({
    success: true,
    data: payment,
  });
});

// @desc    Send payment receipt
// @route   POST /api/payments/:id/receipt
// @access  Private
export const sendReceipt = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate(
    'client',
    'firstName lastName email'
  );

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found',
    });
  }

  if (!payment.client?.email) {
    return res.status(400).json({
      success: false,
      message: 'Client email not found',
    });
  }

  try {
    await sendPaymentReceiptEmail(payment.client.email, {
      clientName: `${payment.client.firstName} ${payment.client.lastName}`,
      invoiceNumber: payment.invoiceNumber,
      amount: payment.amount,
      paymentType: payment.paymentType,
      paymentMethod: payment.paymentMethod,
      date: payment.transactionDate,
    });

    payment.receiptSent = true;
    payment.receiptSentAt = new Date();
    payment.receiptEmail = payment.client.email;
    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Receipt sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send receipt',
    });
  }
});

// @desc    Export payments
// @route   GET /api/payments/export
// @access  Private
export const exportPayments = asyncHandler(async (req, res) => {
  const { format = 'json', dateFrom, dateTo, status } = req.query;

  let filter = {};
  if (status) filter.status = status;
  if (dateFrom || dateTo) {
    filter.transactionDate = {};
    if (dateFrom) filter.transactionDate.$gte = new Date(dateFrom);
    if (dateTo) filter.transactionDate.$lte = new Date(dateTo);
  }

  const payments = await Payment.find(filter)
    .populate('client', 'firstName lastName email')
    .sort('-transactionDate');

  if (format === 'csv') {
    const csv = [
      'Invoice,Client,Amount,Type,Method,Status,Date',
      ...payments.map(
        (p) =>
          `${p.invoiceNumber},${p.client?.firstName} ${p.client?.lastName},${p.amount},${p.paymentType},${p.paymentMethod},${p.status},${p.transactionDate}`
      ),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=payments.csv');
    return res.send(csv);
  }

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments,
  });
});
