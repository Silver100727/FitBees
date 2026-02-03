import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    // Invoice Number (auto-generated)
    invoiceNumber: {
      type: String,
      unique: true,
    },

    // Client Information
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Please specify the client'],
    },

    // Payment Details
    amount: {
      type: Number,
      required: [true, 'Please add payment amount'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentType: {
      type: String,
      enum: ['membership', 'personal_training', 'day_pass', 'merchandise', 'other'],
      required: [true, 'Please specify payment type'],
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'bank_transfer', 'cash', 'upi', 'other'],
      required: [true, 'Please specify payment method'],
    },

    // Plan Details (for membership payments)
    planDetails: {
      planName: String,
      duration: Number, // in months
      startDate: Date,
      endDate: Date,
    },

    // Status
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
      default: 'pending',
    },

    // Transaction Information
    transactionId: {
      type: String,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },

    // Refund Information
    refund: {
      amount: Number,
      reason: String,
      refundedAt: Date,
      refundedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },

    // Additional Information
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },

    // Receipt
    receiptSent: {
      type: Boolean,
      default: false,
    },
    receiptSentAt: Date,
    receiptEmail: String,

    // Trainer (for personal training payments)
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
    },

    // Processed by
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Generate invoice number before saving
paymentSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await mongoose.model('Payment').countDocuments();
    this.invoiceNumber = `INV-${year}${month}-${(count + 1).toString().padStart(5, '0')}`;
  }
  next();
});

// Index for search and filtering (invoiceNumber already indexed via unique: true)
paymentSchema.index({ client: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentType: 1 });
paymentSchema.index({ transactionDate: -1 });

export default mongoose.model('Payment', paymentSchema);
