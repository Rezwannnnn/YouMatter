import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['info', 'success', 'warning', 'announcement'],
            default: 'announcement',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        expiresAt: {
            type: Date,
            default: null, // null means no expiration
        },
    },
    { timestamps: true }
);

export default mongoose.model('Announcement', announcementSchema);

