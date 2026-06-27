import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  size: { type: String, required: true },
});

const wishlistSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    items: [wishlistItemSchema],
  },
  { timestamps: true }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
