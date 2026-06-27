import express from "express";
import { createRazorpayOrder, verifyPayment, getPaymentHistory } from "../controllers/paymentController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // Payment endpoints require verification

router.post("/razorpay", createRazorpayOrder);
router.post("/verify", verifyPayment);

// Admin-only payment logs
router.get("/history", adminOnly, getPaymentHistory);

export default router;
