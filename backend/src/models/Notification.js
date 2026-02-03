import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    // Recipient
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Notification Type
    type: {
      type: String,
      enum: ['client', 'trainer', 'payment', 'alert', 'system', 'reminder'],
      required: true,
    },

    // Content
    title: {
      type: String,
      required: [true, 'Please add a notification title'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    message: {
      type: String,
      required: [true, 'Please add a notification message'],
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },

    // Status
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },

    // Reference (optional - links to related entity)
    reference: {
      model: {
        type: String,
        enum: ['Client', 'Trainer', 'Payment', 'User'],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },

    // Priority
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },

    // Expiry
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

// Auto-delete expired notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Notification', notificationSchema);
