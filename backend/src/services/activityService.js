import Activity from '../models/Activity.js';

// Log activity
export const logActivity = async (activityData) => {
  try {
    const activity = await Activity.create(activityData);
    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - activity logging should not break the main flow
  }
};

// Activity types with descriptions
export const ActivityTypes = {
  CLIENT_CREATED: 'client_created',
  CLIENT_UPDATED: 'client_updated',
  CLIENT_DELETED: 'client_deleted',
  TRAINER_CREATED: 'trainer_created',
  TRAINER_UPDATED: 'trainer_updated',
  TRAINER_DELETED: 'trainer_deleted',
  PAYMENT_RECEIVED: 'payment_received',
  PAYMENT_REFUNDED: 'payment_refunded',
  MEMBERSHIP_EXPIRED: 'membership_expired',
  MEMBERSHIP_RENEWED: 'membership_renewed',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  SETTINGS_UPDATED: 'settings_updated',
  SALARY_PROCESSED: 'salary_processed',
};

// Helper to create activity description
export const createActivityDescription = (type, entityName, metadata = {}) => {
  const descriptions = {
    [ActivityTypes.CLIENT_CREATED]: `New client "${entityName}" was added`,
    [ActivityTypes.CLIENT_UPDATED]: `Client "${entityName}" profile was updated`,
    [ActivityTypes.CLIENT_DELETED]: `Client "${entityName}" was removed`,
    [ActivityTypes.TRAINER_CREATED]: `New trainer "${entityName}" was added`,
    [ActivityTypes.TRAINER_UPDATED]: `Trainer "${entityName}" profile was updated`,
    [ActivityTypes.TRAINER_DELETED]: `Trainer "${entityName}" was removed`,
    [ActivityTypes.PAYMENT_RECEIVED]: `Payment of $${metadata.amount || 0} received from "${entityName}"`,
    [ActivityTypes.PAYMENT_REFUNDED]: `Payment refunded to "${entityName}"`,
    [ActivityTypes.MEMBERSHIP_EXPIRED]: `Membership expired for "${entityName}"`,
    [ActivityTypes.MEMBERSHIP_RENEWED]: `Membership renewed for "${entityName}"`,
    [ActivityTypes.USER_LOGIN]: `User "${entityName}" logged in`,
    [ActivityTypes.USER_LOGOUT]: `User "${entityName}" logged out`,
    [ActivityTypes.SETTINGS_UPDATED]: `Settings updated by "${entityName}"`,
    [ActivityTypes.SALARY_PROCESSED]: `Salary processed for trainer "${entityName}"`,
  };

  return descriptions[type] || `Activity: ${type}`;
};

export default {
  logActivity,
  ActivityTypes,
  createActivityDescription,
};
