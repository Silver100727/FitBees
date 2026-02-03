import Trainer from '../models/Trainer.js';
import Client from '../models/Client.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { paginate, addSearchToFilter, buildFilter } from '../utils/helpers.js';
import { logActivity, ActivityTypes, createActivityDescription } from '../services/activityService.js';
import { createNotification, NotificationTemplates } from '../services/notificationService.js';

// @desc    Get all trainers
// @route   GET /api/trainers
// @access  Private
export const getTrainers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = '-createdAt',
    search,
    status,
    specialty,
    role,
  } = req.query;

  // Build filter
  let filter = buildFilter({ status, role });

  // Handle specialty filter (array field)
  if (specialty) {
    filter.specialties = specialty;
  }

  // Exclude terminated trainers by default
  if (!status) {
    filter.status = { $ne: 'terminated' };
  }

  // Add search
  if (search) {
    filter = addSearchToFilter(filter, search, ['firstName', 'lastName', 'email']);
  }

  // Paginate
  const result = await paginate(Trainer, filter, {
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
  });

  res.status(200).json({
    success: true,
    ...result,
  });
});

// @desc    Get trainer stats summary
// @route   GET /api/trainers/stats
// @access  Private
export const getTrainerStats = asyncHandler(async (req, res) => {
  const [
    totalTrainers,
    availableTrainers,
    inSessionTrainers,
    totalClientsAssigned,
    avgRating,
  ] = await Promise.all([
    Trainer.countDocuments({ status: { $ne: 'terminated' } }),
    Trainer.countDocuments({ status: 'available' }),
    Trainer.countDocuments({ status: 'in_session' }),
    Client.countDocuments({ assignedTrainer: { $ne: null } }),
    Trainer.aggregate([
      { $match: { status: { $ne: 'terminated' }, rating: { $gt: 0 } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalTrainers,
      availableTrainers,
      inSessionTrainers,
      totalClientsAssigned,
      averageRating: avgRating[0]?.avgRating?.toFixed(1) || '0.0',
    },
  });
});

// @desc    Get single trainer
// @route   GET /api/trainers/:id
// @access  Private
export const getTrainer = asyncHandler(async (req, res) => {
  const trainer = await Trainer.findById(req.params.id).populate(
    'createdBy',
    'name'
  );

  if (!trainer) {
    return res.status(404).json({
      success: false,
      message: 'Trainer not found',
    });
  }

  // Get assigned clients count
  const assignedClients = await Client.countDocuments({
    assignedTrainer: trainer._id,
  });

  res.status(200).json({
    success: true,
    data: {
      ...trainer.toObject(),
      assignedClientsCount: assignedClients,
    },
  });
});

// @desc    Create new trainer
// @route   POST /api/trainers
// @access  Private
export const createTrainer = asyncHandler(async (req, res) => {
  // Add created by
  req.body.createdBy = req.user.id;

  const trainer = await Trainer.create(req.body);

  // Log activity
  await logActivity({
    type: ActivityTypes.TRAINER_CREATED,
    description: createActivityDescription(ActivityTypes.TRAINER_CREATED, trainer.fullName),
    performedBy: req.user._id,
    entity: { model: 'Trainer', id: trainer._id, name: trainer.fullName },
  });

  // Create notification
  await createNotification({
    user: req.user._id,
    ...NotificationTemplates.newTrainer(trainer.fullName),
    reference: { model: 'Trainer', id: trainer._id },
  });

  res.status(201).json({
    success: true,
    data: trainer,
  });
});

// @desc    Update trainer
// @route   PUT /api/trainers/:id
// @access  Private
export const updateTrainer = asyncHandler(async (req, res) => {
  let trainer = await Trainer.findById(req.params.id);

  if (!trainer) {
    return res.status(404).json({
      success: false,
      message: 'Trainer not found',
    });
  }

  trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Log activity
  await logActivity({
    type: ActivityTypes.TRAINER_UPDATED,
    description: createActivityDescription(ActivityTypes.TRAINER_UPDATED, trainer.fullName),
    performedBy: req.user._id,
    entity: { model: 'Trainer', id: trainer._id, name: trainer.fullName },
  });

  res.status(200).json({
    success: true,
    data: trainer,
  });
});

// @desc    Delete trainer
// @route   DELETE /api/trainers/:id
// @access  Private
export const deleteTrainer = asyncHandler(async (req, res) => {
  const trainer = await Trainer.findById(req.params.id);

  if (!trainer) {
    return res.status(404).json({
      success: false,
      message: 'Trainer not found',
    });
  }

  // Check if trainer has assigned clients
  const assignedClients = await Client.countDocuments({
    assignedTrainer: trainer._id,
  });

  if (assignedClients > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete trainer. ${assignedClients} clients are still assigned to this trainer.`,
    });
  }

  const trainerName = trainer.fullName;
  await trainer.deleteOne();

  // Log activity
  await logActivity({
    type: ActivityTypes.TRAINER_DELETED,
    description: createActivityDescription(ActivityTypes.TRAINER_DELETED, trainerName),
    performedBy: req.user._id,
    entity: { model: 'Trainer', id: req.params.id, name: trainerName },
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get trainer's assigned clients
// @route   GET /api/trainers/:id/clients
// @access  Private
export const getTrainerClients = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const trainer = await Trainer.findById(req.params.id);

  if (!trainer) {
    return res.status(404).json({
      success: false,
      message: 'Trainer not found',
    });
  }

  const result = await paginate(
    Client,
    { assignedTrainer: req.params.id },
    {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: '-createdAt',
    }
  );

  res.status(200).json({
    success: true,
    ...result,
  });
});

// @desc    Get trainer schedule
// @route   GET /api/trainers/:id/schedule
// @access  Private
export const getTrainerSchedule = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const trainer = await Trainer.findById(req.params.id).select('schedule firstName lastName');

  if (!trainer) {
    return res.status(404).json({
      success: false,
      message: 'Trainer not found',
    });
  }

  let schedule = trainer.schedule;

  // Filter by date range if provided
  if (startDate || endDate) {
    schedule = schedule.filter((s) => {
      const sessionDate = new Date(s.date);
      if (startDate && sessionDate < new Date(startDate)) return false;
      if (endDate && sessionDate > new Date(endDate)) return false;
      return true;
    });
  }

  // Sort by date
  schedule.sort((a, b) => new Date(a.date) - new Date(b.date));

  res.status(200).json({
    success: true,
    data: schedule,
  });
});

// @desc    Add session to trainer schedule
// @route   POST /api/trainers/:id/schedule
// @access  Private
export const addTrainerSession = asyncHandler(async (req, res) => {
  const trainer = await Trainer.findById(req.params.id);

  if (!trainer) {
    return res.status(404).json({
      success: false,
      message: 'Trainer not found',
    });
  }

  trainer.schedule.push(req.body);
  await trainer.save();

  res.status(201).json({
    success: true,
    data: trainer.schedule[trainer.schedule.length - 1],
  });
});

// @desc    Process trainer salary
// @route   POST /api/trainers/:id/salary
// @access  Private
export const processTrainerSalary = asyncHandler(async (req, res) => {
  const { amount, period, notes } = req.body;

  const trainer = await Trainer.findById(req.params.id);

  if (!trainer) {
    return res.status(404).json({
      success: false,
      message: 'Trainer not found',
    });
  }

  const salaryRecord = {
    amount,
    period,
    notes,
    status: 'paid',
    paidAt: new Date(),
    paidBy: req.user._id,
  };

  trainer.salaryHistory.push(salaryRecord);
  await trainer.save();

  // Log activity
  await logActivity({
    type: ActivityTypes.SALARY_PROCESSED,
    description: createActivityDescription(ActivityTypes.SALARY_PROCESSED, trainer.fullName),
    performedBy: req.user._id,
    entity: { model: 'Trainer', id: trainer._id, name: trainer.fullName },
    metadata: { amount, period },
  });

  res.status(201).json({
    success: true,
    data: salaryRecord,
  });
});

// @desc    Update trainer status
// @route   PATCH /api/trainers/:id/status
// @access  Private
export const updateTrainerStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const trainer = await Trainer.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!trainer) {
    return res.status(404).json({
      success: false,
      message: 'Trainer not found',
    });
  }

  res.status(200).json({
    success: true,
    data: trainer,
  });
});
