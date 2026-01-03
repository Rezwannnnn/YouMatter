import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        anonymousName: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const reactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['heart', 'support', 'hug', 'star'],
        required: true,
    },
});

const reportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reason: {
        type: String,
        required: true,
        enum: ['spam', 'harassment', 'inappropriate', 'misinformation', 'other'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        anonymousName: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        comments: [commentSchema],
        reactions: [reactionSchema],
        reports: [reportSchema],
        isModerated: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Post', postSchema);

