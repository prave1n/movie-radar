import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    rating: Number,
    reviewText: String,
    upvotes: { type: Number, default: 0},
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

reviewSchema.index({ user: 1, createdAt: -1 });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
