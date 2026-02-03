import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema(
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

    // Professional Information
    role: {
      type: String,
      enum: ['head_trainer', 'senior_trainer', 'trainer', 'junior_trainer', 'intern'],
      default: 'trainer',
    },
    specialties: [
      {
        type: String,
        enum: [
          'weight_training',
          'cardio',
          'yoga',
          'pilates',
          'crossfit',
          'boxing',
          'martial_arts',
          'swimming',
          'nutrition',
          'rehabilitation',
          'senior_fitness',
          'kids_fitness',
          'group_classes',
          'personal_training',
        ],
      },
    ],
    certifications: [
      {
        name: String,
        issuedBy: String,
        issuedDate: Date,
        expiryDate: Date,
      },
    ],
    yearsOfExperience: {
      type: Number,
      min: [0, 'Experience cannot be negative'],
      max: [50, 'Experience cannot exceed 50 years'],
      default: 0,
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },

    // Employment Details
    employmentType: {
      type: String,
      enum: ['full_time', 'part_time', 'contract'],
      default: 'full_time',
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    salary: {
      amount: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
      payFrequency: {
        type: String,
        enum: ['weekly', 'bi_weekly', 'monthly'],
        default: 'monthly',
      },
    },

    // Status & Availability
    status: {
      type: String,
      enum: ['available', 'in_session', 'off_duty', 'on_leave', 'terminated'],
      default: 'available',
    },
    workingHours: {
      monday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
      tuesday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
      wednesday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
      thursday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
      friday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
      saturday: { start: String, end: String, isWorking: { type: Boolean, default: false } },
      sunday: { start: String, end: String, isWorking: { type: Boolean, default: false } },
    },

    // Performance
    rating: {
      type: Number,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    totalClients: {
      type: Number,
      default: 0,
    },
    sessionsThisWeek: {
      type: Number,
      default: 0,
    },
    totalSessions: {
      type: Number,
      default: 0,
    },

    // Schedule
    schedule: [
      {
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
        date: Date,
        startTime: String,
        endTime: String,
        sessionType: {
          type: String,
          enum: ['personal_training', 'group_class', 'assessment', 'consultation'],
        },
        status: {
          type: String,
          enum: ['scheduled', 'completed', 'cancelled', 'no_show'],
          default: 'scheduled',
        },
        notes: String,
      },
    ],

    // Salary History
    salaryHistory: [
      {
        amount: Number,
        date: { type: Date, default: Date.now },
        period: String, // e.g., "January 2024"
        status: {
          type: String,
          enum: ['pending', 'paid', 'cancelled'],
          default: 'pending',
        },
        paidAt: Date,
        paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        notes: String,
      },
    ],

    // Notes
    notes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },

    // Created by
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
trainerSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for initials
trainerSchema.virtual('initials').get(function () {
  return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
});

// Index for search
trainerSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

trainerSchema.set('toJSON', { virtuals: true });
trainerSchema.set('toObject', { virtuals: true });

export default mongoose.model('Trainer', trainerSchema);
