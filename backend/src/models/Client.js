import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      required: [true, 'Please add a first name'],
      trim: true,
      maxlength: [50, 'First name cannot be more than 50 characters'],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, 'Last name cannot be more than 50 characters'],
      default: '',
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      maxlength: [20, 'Phone number cannot be longer than 20 characters'],
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other',
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'USA' },
    },
    avatar: {
      type: String,
      default: null,
    },

    // Fitness Profile
    fitnessGoal: {
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general_fitness', 'sports_training'],
      default: 'general_fitness',
    },
    currentWeight: {
      type: Number, // in kg
      min: [20, 'Weight must be at least 20 kg'],
      max: [300, 'Weight cannot exceed 300 kg'],
    },
    targetWeight: {
      type: Number,
      min: [20, 'Target weight must be at least 20 kg'],
      max: [300, 'Target weight cannot exceed 300 kg'],
    },
    height: {
      type: Number, // in cm
      min: [100, 'Height must be at least 100 cm'],
      max: [250, 'Height cannot exceed 250 cm'],
    },
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },

    // Membership Details
    membershipType: {
      type: String,
      enum: ['basic', 'standard', 'premium'],
      required: [true, 'Please select a membership type'],
    },
    membershipStartDate: {
      type: Date,
      default: Date.now,
    },
    membershipEndDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    assignedTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
      default: null,
    },

    // Status
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired', 'suspended'],
      default: 'active',
    },
    lastVisit: {
      type: Date,
      default: null,
    },

    // Emergency Contact
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },

    // Medical Information
    medicalNotes: {
      type: String,
      maxlength: [1000, 'Medical notes cannot exceed 1000 characters'],
    },
    allergies: [String],
    injuries: [String],

    // Progress Tracking
    progress: [
      {
        date: { type: Date, default: Date.now },
        weight: Number,
        bodyFat: Number,
        muscleMass: Number,
        notes: String,
      },
    ],

    // Attendance
    attendance: [
      {
        date: { type: Date, default: Date.now },
        checkIn: Date,
        checkOut: Date,
        duration: Number, // in minutes
      },
    ],

    // Notes
    notes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },

    // Created by (staff member who added the client)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for full name
clientSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for initials
clientSchema.virtual('initials').get(function () {
  return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
});

// Virtual for age
clientSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Virtual for membership status
clientSchema.virtual('membershipStatus').get(function () {
  const now = new Date();
  if (this.status === 'suspended') return 'suspended';
  if (new Date(this.membershipEndDate) < now) return 'expired';
  return this.status;
});

// Index for search
clientSchema.index({ firstName: 'text', lastName: 'text', email: 'text', phone: 'text' });

clientSchema.set('toJSON', { virtuals: true });
clientSchema.set('toObject', { virtuals: true });

export default mongoose.model('Client', clientSchema);
