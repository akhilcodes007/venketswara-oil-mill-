import express from "express";
import { getWishlist, saveWishlist } from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All wishlist endpoints require authentication

router.get("/", getWishlist);
router.post("/", saveWishlist);

export default router;
