import express from "express";
import { getProductReviews, submitReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:productId", getProductReviews);
router.post("/", protect, submitReview);

export default router;
