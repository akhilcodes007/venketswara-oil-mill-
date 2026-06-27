import Review from "../models/Review.js";
import Product from "../models/Product.js";

/**
 * Gets reviews for a specific product.
 */
export async function getProductReviews(req, res) {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ product_id: productId })
      .sort({ createdAt: -1 })
      .limit(20);
      
    res.status(200).json(reviews);
  } catch (error) {
    console.error("[Review Controller] Get Product Reviews Error:", error);
    res.status(500).json({ message: "Server error retrieving reviews" });
  }
}

/**
 * Upserts a customer review.
 */
export async function submitReview(req, res) {
  const { product_id, rating, comment } = req.body;
  const userId = req.user._id.toString();
  const email = req.user.email;

  try {
    if (!product_id || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Product ID and a valid rating (1-5) are required" });
    }

    // Find and update or create a new review (upsert)
    const review = await Review.findOneAndUpdate(
      { user_id: userId, product_id },
      {
        $set: {
          user_email: email,
          rating: parseInt(rating),
          comment: comment ? comment.trim() : null,
        },
      },
      { new: true, upsert: true }
    );

    // Dynamic Recalculation: Update Product average rating
    const reviews = await Review.find({ product_id });
    if (reviews.length > 0) {
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await Product.findOneAndUpdate(
        { id: product_id },
        { $set: { rating: parseFloat(avg.toFixed(1)) } }
      );
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("[Review Controller] Submit Review Error:", error);
    res.status(500).json({ message: "Server error saving review" });
  }
}
