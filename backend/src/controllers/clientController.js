import Client from '../models/Client.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { paginate, addSearchToFilter, buildFilter } from '../utils/helpers.js';
import { logActivity, ActivityTypes, createActivityDescription } from '../services/activityService.js';
import { createNotification, NotificationTemplates } from '../services/notificationService.js';

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
export const getClients = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = '-createdAt',
    search,
    status,
    membershipType,
    assignedTrainer,
  } = req.query;

  // Build filter
  let filter = buildFilter({ status, membershipType, assignedTrainer });

  // Add search
  if (search) {
    filter = addSearchToFilter(filter, search, ['firstName', 'lastName', 'email', 'phone']);
  }

  // Paginate
  const result = await paginate(Client, filter, {
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
    populate: { path: 'assignedTrainer', select: 'firstName lastName' },
  });

  res.status(200).json({
    success: true,
    ...result,
  });
});

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
export const getClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id)
    .populate('assignedTrainer', 'firstName lastName email phone avatar specialties')
    .populate('createdBy', 'name');

  if (!client) {
    return res.status(404).json({
      success: false,
      message: 'Client not found',
    });
  }

  res.status(200).json({
    success: true,
    data: client,
  });
});

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
export const createClient = asyncHandler(async (req, res) => {
  // Add created by
  req.body.createdBy = req.user.id;

  const client = await Client.create(req.body);

  // Log activity
  await logActivity({
    type: ActivityTypes.CLIENT_CREATED,
    description: createActivityDescription(ActivityTypes.CLIENT_CREATED, client.fullName),
    performedBy: req.user._id,
    entity: { model: 'Client', id: client._id, name: client.fullName },
  });

  // Create notification
  await createNotification({
    user: req.user._id,
    ...NotificationTemplates.newClient(client.fullName),
    reference: { model: 'Client', id: client._id },
  });

  res.status(201).json({
    success: true,
    data: client,
  });
});

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
export const updateClient = asyncHandler(async (req, res) => {
  let client = await Client.findById(req.params.id);

  if (!client) {
    return res.status(404).json({
      success: false,
      message: 'Client not found',
    });
  }

  client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Log activity
  await logActivity({
    type: ActivityTypes.CLIENT_UPDATED,
    description: createActivityDescription(ActivityTypes.CLIENT_UPDATED, client.fullName),
    performedBy: req.user._id,
    entity: { model: 'Client', id: client._id, name: client.fullName },
  });

  res.status(200).json({
    success: true,
    data: client,
  });
});

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
export const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return res.status(404).json({
      success: false,
      message: 'Client not found',
    });
  }

  const clientName = client.fullName;
  await client.deleteOne();

  // Log activity
  await logActivity({
    type: ActivityTypes.CLIENT_DELETED,
    description: createActivityDescription(ActivityTypes.CLIENT_DELETED, clientName),
    performedBy: req.user._id,
    entity: { model: 'Client', id: req.params.id, name: clientName },
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get client attendance history
// @route   GET /api/clients/:id/attendance
// @access  Private
export const getClientAttendance = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const client = await Client.findById(req.params.id).select('attendance firstName lastName');

  if (!client) {
    return res.status(404).json({
      success: false,
      message: 'Client not found',
    });
  }

  // Paginate attendance array
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const attendance = client.attendance
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(startIndex, endIndex);

  res.status(200).json({
    success: true,
    data: attendance,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: client.attendance.length,
      pages: Math.ceil(client.attendance.length / limit),
    },
  });
});

// @desc    Add client attendance
// @route   POST /api/clients/:id/attendance
// @access  Private
export const addClientAttendance = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return res.status(404).json({
      success: false,
      message: 'Client not found',
    });
  }

  client.attendance.push(req.body);
  client.lastVisit = req.body.checkIn || new Date();
  await client.save();

  res.status(201).json({
    success: true,
    data: client.attendance[client.attendance.length - 1],
  });
});

// @desc    Get client progress
// @route   GET /api/clients/:id/progress
// @access  Private
export const getClientProgress = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id).select(
    'progress firstName lastName currentWeight targetWeight'
  );

  if (!client) {
    return res.status(404).json({
      success: false,
      message: 'Client not found',
    });
  }

  // Calculate progress stats
  const progressData = client.progress.sort((a, b) => new Date(a.date) - new Date(b.date));

  let weightLoss = 0;
  let goalProgress = 0;

  if (progressData.length > 0) {
    const firstWeight = progressData[0].weight;
    const latestWeight = progressData[progressData.length - 1].weight;
    weightLoss = firstWeight - latestWeight;

    if (client.targetWeight && client.currentWeight) {
      const totalToLose = client.currentWeight - client.targetWeight;
      goalProgress = totalToLose > 0 ? (weightLoss / totalToLose) * 100 : 0;
    }
  }

  res.status(200).json({
    success: true,
    data: {
      progress: progressData,
      stats: {
        weightLoss: Math.round(weightLoss * 10) / 10,
        goalProgress: Math.round(goalProgress),
        totalEntries: progressData.length,
      },
    },
  });
});

// @desc    Add client progress entry
// @route   POST /api/clients/:id/progress
// @access  Private
export const addClientProgress = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return res.status(404).json({
      success: false,
      message: 'Client not found',
    });
  }

  client.progress.push({
    ...req.body,
    date: req.body.date || new Date(),
  });

  // Update current weight if provided
  if (req.body.weight) {
    client.currentWeight = req.body.weight;
  }

  await client.save();

  res.status(201).json({
    success: true,
    data: client.progress[client.progress.length - 1],
  });
});

// @desc    Get client payment history
// @route   GET /api/clients/:id/payments
// @access  Private
export const getClientPayments = asyncHandler(async (req, res) => {
  const Payment = (await import('../models/Payment.js')).default;
  const { page = 1, limit = 10 } = req.query;

  const client = await Client.findById(req.params.id);

  if (!client) {
    return res.status(404).json({
      success: false,
      message: 'Client not found',
    });
  }

  const result = await paginate(
    Payment,
    { client: req.params.id },
    {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: '-transactionDate',
    }
  );

  res.status(200).json({
    success: true,
    ...result,
  });
});
