import mongoose from 'mongoose';

const programSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'عنوان البرنامج إجباري'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['Hifz', 'Tilawa'],
      required: true,
    },
    mode: {
      type: String,
      enum: ['Solo', 'Group'],
      default: 'Solo',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    scope: {
      category: {
        type: String,
        enum: ['FullQuran', 'Custom'],
        default: 'FullQuran',
      },
      details: {
        type: String,
        default: '',
      },
    },
    tilawaConfig: {
      assignmentType: {
        type: String,
        enum: ['Manual', 'Random'],
        default: 'Random',
      },
      isFixedAssignment: {
        type: Boolean,
        default: false,
      },
      isScheduled: {
        type: Boolean,
        default: false,
      },
      scheduleDay: {
        type: String,
        default: '',
      },
    },
    progressType: {
      type: String,
      enum: ['Infinite', 'Single', 'Limited'],
      default: 'Infinite',
    },
    totalRounds: {
      type: Number,
      default: 1,
    },
    currentRoundNumber: {
      type: Number,
      default: 1,
    },
    cron: {
      type: String,
      enum: ['daily', 'weekly', '10days', 'biweekly', 'monthly'],
    },
    currentRoundStartDate: {
      type: Date,
      default: Date.now,
    },
    currentRoundEndDate: {
      type: Date,
      required: true,
    },
    hasDua: {
      type: Boolean,
      default: false,
    },
    duaAssignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Program', programSchema);