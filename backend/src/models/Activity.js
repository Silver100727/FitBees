import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    // Activity Type
    type: {
      type: String,
      enum: [
        'client_created',
        'client_updated',
        'client_deleted',
        'trainer_created',
        'trainer_updated',
        'trainer_deleted',
        'payment_received',
        'payment_refunded',
        'membership_expired',
        'membership_renewed',
        'user_login',
        'user_logout',
        'settings_updated',
        'salary_processed',
      ],
      required: true,
    },

    // Description
    description: {
      type: String,
      required: [true, 'Please add activity description'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    // Performed by
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Related Entity
    entity: {
      model: {
        type: String,
        enum: ['Client', 'Trainer', 'Payment', 'User'],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
      name: String, // Store name for quick reference
    },

    // Metadata (additional details)
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },

    // IP Address (for security audit)
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
activitySchema.index({ createdAt: -1 });
activitySchema.index({ type: 1, createdAt: -1 });
activitySchema.index({ performedBy: 1, createdAt: -1 });

export default mongoose.model('Activity', activitySchema);
