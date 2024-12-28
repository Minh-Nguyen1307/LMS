import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "course", required: true },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  reviewText: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  date: { type: Date, default: Date.now },
});

const ReviewModel = mongoose.model("review", reviewSchema);

export default ReviewModel;
