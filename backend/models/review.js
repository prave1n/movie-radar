import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    rating: Number,
    reviewText: String,
    upvotes: { type: Number, default: 0},
    createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
