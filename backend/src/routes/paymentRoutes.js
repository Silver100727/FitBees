import express from 'express';
import { body } from 'express-validator';
import {
  getPayments,
  getPaymentStats,
  getPayment,
  createPayment,
  updatePaymentStatus,
  processRefund,
  sendReceipt,
  exportPayments,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const paymentValidation = [
  body('client').isMongoId().withMessage('Please provide a valid client ID'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('paymentType')
    .isIn(['membership', 'personal_training', 'day_pass', 'merchandise', 'other'])
    .withMessage('Invalid payment type'),
  body('paymentMethod')
    .isIn(['credit_card', 'debit_card', 'bank_transfer', 'cash', 'upi', 'other'])
    .withMessage('Invalid payment method'),
];

const statusValidation = [
  body('status')
    .isIn(['pending', 'completed', 'failed', 'refunded', 'cancelled'])
    .withMessage('Invalid status'),
];

const refundValidation = [
  body('reason').notEmpty().withMessage('Refund reason is required'),
];

// All routes are protected
router.use(protect);

// Stats and export routes
router.get('/stats', getPaymentStats);
router.get('/export', exportPayments);

// Payment CRUD
router.route('/')
  .get(getPayments)
  .post(paymentValidation, validate, createPayment);

router.route('/:id')
  .get(getPayment);

// Payment status
router.patch('/:id/status', statusValidation, validate, updatePaymentStatus);

// Refund
router.post(
  '/:id/refund',
  authorize('admin', 'manager'),
  refundValidation,
  validate,
  processRefund
);

// Send receipt
router.post('/:id/receipt', sendReceipt);

export default router;
