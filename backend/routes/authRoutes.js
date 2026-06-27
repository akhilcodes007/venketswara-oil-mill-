import express from "express";
import { sendOtp, verifyOtp, refreshAccessToken, getMe, forgotPassword, logout } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateOtpSend } from "../middleware/validators.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/otp/send", authLimiter, validateOtpSend, sendOtp);
router.post("/otp/verify", authLimiter, verifyOtp);
router.post("/refresh-token", refreshAccessToken);
router.post("/forgot-password", forgotPassword);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
