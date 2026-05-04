import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
    rating: { type: String, required: true },
    feature: { type: String, required: true },
    comments: { type: String },
    timestamp: { type: Date, default: Date.now }
});

export const Feedback = mongoose.model('Feedback', FeedbackSchema);
