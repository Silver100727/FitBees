import express from 'express';
import { body } from 'express-validator';
import {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  getClientAttendance,
  addClientAttendance,
  getClientProgress,
  addClientProgress,
  getClientPayments,
} from '../controllers/clientController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const clientValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').optional(),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('dateOfBirth').optional().isISO8601().withMessage('Please provide a valid date of birth'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  body('membershipType').optional().isIn(['basic', 'standard', 'premium']).withMessage('Invalid membership type'),
  body('membershipStartDate').optional().isISO8601().withMessage('Please provide a valid membership start date'),
  body('membershipEndDate').optional().isISO8601().withMessage('Please provide a valid membership end date'),
];

const attendanceValidation = [
  body('checkIn').isISO8601().withMessage('Please provide a valid check-in time'),
];

const progressValidation = [
  body('weight').optional().isFloat({ min: 20 }).withMessage('Weight must be at least 20 kg'),
];

// All routes are protected
router.use(protect);

// Client CRUD
router.route('/')
  .get(getClients)
  .post(clientValidation, validate, createClient);

router.route('/:id')
  .get(getClient)
  .put(updateClient)
  .delete(deleteClient);

// Client attendance
router.route('/:id/attendance')
  .get(getClientAttendance)
  .post(attendanceValidation, validate, addClientAttendance);

// Client progress
router.route('/:id/progress')
  .get(getClientProgress)
  .post(progressValidation, validate, addClientProgress);

// Client payments
router.get('/:id/payments', getClientPayments);

export default router;
