import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendOTPEmail } from '../services/emailService.js';
import { logActivity, ActivityTypes, createActivityDescription } from '../services/activityService.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'staff',
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an email and password',
    });
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Your account has been deactivated. Please contact admin.',
    });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Log activity
  await logActivity({
    type: ActivityTypes.USER_LOGIN,
    description: createActivityDescription(ActivityTypes.USER_LOGIN, user.name),
    performedBy: user._id,
    entity: { model: 'User', id: user._id, name: user.name },
    ipAddress: req.ip,
  });

  sendTokenResponse(user, 200, res);
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  // Log activity
  await logActivity({
    type: ActivityTypes.USER_LOGOUT,
    description: createActivityDescription(ActivityTypes.USER_LOGOUT, req.user.name),
    performedBy: req.user._id,
    entity: { model: 'User', id: req.user._id, name: req.user.name },
    ipAddress: req.ip,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
    data: {},
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Forgot password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log('🔑 Forgot password request for:', email);

  const user = await User.findOne({ email });

  if (!user) {
    console.log('❌ User not found:', email);
    return res.status(404).json({
      success: false,
      message: 'There is no user with that email',
    });
  }

  console.log('✅ User found:', user.name);

  // Generate OTP
  const otp = user.generateOTP();
  console.log('🔐 Generated OTP:', otp);
  await user.save({ validateBeforeSave: false });
  console.log('💾 OTP saved to database');

  try {
    console.log('📧 Calling sendOTPEmail...');
    await sendOTPEmail(user.email, otp, user.name);

    console.log('✅ OTP email sent successfully!');
    res.status(200).json({
      success: true,
      message: 'OTP sent to email',
    });
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    console.error('❌ Full error:', err);
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      success: false,
      message: 'Email could not be sent',
    });
  }
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    otp,
    otpExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired OTP',
    });
  }

  res.status(200).json({
    success: true,
    message: 'OTP verified successfully',
  });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;

  const user = await User.findOne({
    email,
    otp,
    otpExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired OTP',
    });
  }

  // Set new password
  user.password = password;
  user.otp = undefined;
  user.otpExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successful',
  });
});

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = asyncHandler(async (req, res) => {
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

  sendTokenResponse(user, 200, res);
});

// Helper function to get token and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      initials: user.initials,
      preferences: user.preferences,
    },
  });
};
