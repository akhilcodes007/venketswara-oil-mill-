import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  price: { type: Number, required: true },
});

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tamilName: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["oils", "dryfruits", "palm-products", "honey", "millets"],
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    variants: [variantSchema],
    tags: [String],
    stock: {
      type: Number,
      default: 0,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
