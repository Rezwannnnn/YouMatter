import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    mood: {
      type: String,
      enum: ['very-happy', 'happy', 'neutral', 'sad', 'very-sad'],
    },
    tags: [{
      type: String,
      trim: true,
    }],
    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for efficient queries and search
journalSchema.index({ user: 1, createdAt: -1 });
journalSchema.index({ title: 'text', content: 'text' });

export default mongoose.model('Journal', journalSchema);

