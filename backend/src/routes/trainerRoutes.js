import express from 'express';
import { body } from 'express-validator';
import {
  getTrainers,
  getTrainerStats,
  getTrainer,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  getTrainerClients,
  getTrainerSchedule,
  addTrainerSession,
  processTrainerSalary,
  updateTrainerStatus,
} from '../controllers/trainerController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const trainerValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').optional(),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').notEmpty().withMessage('Phone number is required'),
];

const sessionValidation = [
  body('date').isISO8601().withMessage('Please provide a valid date'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('endTime').notEmpty().withMessage('End time is required'),
  body('sessionType')
    .isIn(['personal_training', 'group_class', 'assessment', 'consultation'])
    .withMessage('Invalid session type'),
];

const salaryValidation = [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('period').notEmpty().withMessage('Period is required'),
];

const statusValidation = [
  body('status')
    .isIn(['available', 'in_session', 'off_duty', 'on_leave', 'terminated'])
    .withMessage('Invalid status'),
];

// All routes are protected
router.use(protect);

// Stats route (before /:id to avoid conflict)
router.get('/stats', getTrainerStats);

// Trainer CRUD
router.route('/')
  .get(getTrainers)
  .post(authorize('admin', 'manager'), trainerValidation, validate, createTrainer);

router.route('/:id')
  .get(getTrainer)
  .put(authorize('admin', 'manager'), updateTrainer)
  .delete(authorize('admin', 'manager'), deleteTrainer);

// Trainer clients
router.get('/:id/clients', getTrainerClients);

// Trainer schedule
router.route('/:id/schedule')
  .get(getTrainerSchedule)
  .post(sessionValidation, validate, addTrainerSession);

// Trainer salary
router.post(
  '/:id/salary',
  authorize('admin', 'manager'),
  salaryValidation,
  validate,
  processTrainerSalary
);

// Trainer status
router.patch('/:id/status', statusValidation, validate, updateTrainerStatus);

export default router;
