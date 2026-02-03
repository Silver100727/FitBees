import Notification from '../models/Notification.js';

// Create notification
export const createNotification = async (notificationData) => {
  try {
    const notification = await Notification.create(notificationData);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    // Don't throw - notification creation should not break the main flow
  }
};

// Create notification for all users with specific role
export const createNotificationForRole = async (role, notificationData, User) => {
  try {
    const users = await User.find({ role, isActive: true }).select('_id');
    const notifications = users.map((user) => ({
      ...notificationData,
      user: user._id,
    }));
    await Notification.insertMany(notifications);
  } catch (error) {
    console.error('Error creating notifications for role:', error);
  }
};

// Notification templates
export const NotificationTemplates = {
  newClient: (clientName) => ({
    type: 'client',
    title: 'New Client Added',
    message: `${clientName} has been added as a new client.`,
    priority: 'medium',
  }),

  clientExpiring: (clientName, daysLeft) => ({
    type: 'alert',
    title: 'Membership Expiring Soon',
    message: `${clientName}'s membership will expire in ${daysLeft} days.`,
    priority: 'high',
  }),

  paymentReceived: (clientName, amount) => ({
    type: 'payment',
    title: 'Payment Received',
    message: `Payment of $${amount} received from ${clientName}.`,
    priority: 'medium',
  }),

  paymentFailed: (clientName) => ({
    type: 'payment',
    title: 'Payment Failed',
    message: `Payment failed for ${clientName}. Please follow up.`,
    priority: 'high',
  }),

  newTrainer: (trainerName) => ({
    type: 'trainer',
    title: 'New Trainer Added',
    message: `${trainerName} has joined the team as a new trainer.`,
    priority: 'medium',
  }),

  trainerOnLeave: (trainerName, startDate, endDate) => ({
    type: 'trainer',
    title: 'Trainer On Leave',
    message: `${trainerName} will be on leave from ${startDate} to ${endDate}.`,
    priority: 'medium',
  }),

  systemAlert: (message) => ({
    type: 'system',
    title: 'System Alert',
    message,
    priority: 'high',
  }),
};

export default {
  createNotification,
  createNotificationForRole,
  NotificationTemplates,
};
