import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    user_email: {
      type: String,
      required: true,
    },
    product_id: {
      type: String,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// A user can only review a product once
reviewSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
