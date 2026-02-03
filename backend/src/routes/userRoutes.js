import express from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import {
  getProfile,
  updateProfile,
  updatePreferences,
  changePassword,
  uploadAvatar,
  toggle2FA,
  getUsers,
  deactivateUser,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Multer configuration for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `avatar-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  },
});

// Validation rules
const profileValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
];

const passwordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];

// All routes are protected
router.use(protect);

// Profile routes
router.route('/profile')
  .get(getProfile)
  .put(profileValidation, validate, updateProfile);

// Preferences
router.put('/preferences', updatePreferences);

// Password
router.put('/password', passwordValidation, validate, changePassword);

// Avatar
router.post('/avatar', upload.single('avatar'), uploadAvatar);

// 2FA
router.put('/2fa', toggle2FA);

// Admin only routes
router.get('/', authorize('admin'), getUsers);
router.put('/:id/deactivate', authorize('admin'), deactivateUser);

export default router;
