import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mood: {
      type: String,
      enum: ['very-happy', 'happy', 'neutral', 'sad', 'very-sad'],
      required: true,
    },
    intensity: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    activities: [{
      type: String,
      trim: true,
    }],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
moodSchema.index({ user: 1, date: -1 });

export default mongoose.model('Mood', moodSchema);

