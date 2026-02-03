import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { logActivity, ActivityTypes, createActivityDescription } from '../services/activityService.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, location } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email, phone, location },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
export const updatePreferences = asyncHandler(async (req, res) => {
  const {
    emailNotifications,
    pushNotifications,
    orderUpdates,
    marketingEmails,
    theme,
  } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      'preferences.emailNotifications': emailNotifications,
      'preferences.pushNotifications': pushNotifications,
      'preferences.orderUpdates': orderUpdates,
      'preferences.marketingEmails': marketingEmails,
      'preferences.theme': theme,
    },
    { new: true, runValidators: true }
  );

  // Log activity
  await logActivity({
    type: ActivityTypes.SETTINGS_UPDATED,
    description: createActivityDescription(ActivityTypes.SETTINGS_UPDATED, user.name),
    performedBy: req.user._id,
    entity: { model: 'User', id: user._id, name: user.name },
  });

  res.status(200).json({
    success: true,
    data: user.preferences,
  });
});

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(currentPassword))) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
});

// @desc    Upload avatar
// @route   POST /api/users/avatar
// @access  Private
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a file',
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: `/uploads/avatars/${req.file.filename}` },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: { avatar: user.avatar },
  });
});

// @desc    Toggle 2FA
// @route   PUT /api/users/2fa
// @access  Private
export const toggle2FA = asyncHandler(async (req, res) => {
  const { enabled } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { twoFactorEnabled: enabled },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: { twoFactorEnabled: user.twoFactorEnabled },
  });
});

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort('-createdAt');

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Deactivate user (admin only)
// @route   PUT /api/users/:id/deactivate
// @access  Private/Admin
export const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  if (user._id.toString() === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot deactivate your own account',
    });
  }

  user.isActive = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User deactivated successfully',
  });
});
