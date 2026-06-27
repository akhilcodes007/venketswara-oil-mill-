import express from "express";
import { getCart, saveCart, clearCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All cart endpoints require user authentication

router.get("/", getCart);
router.post("/", saveCart);
router.delete("/", clearCart);

export default router;
