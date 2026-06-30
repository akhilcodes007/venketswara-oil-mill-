import { Router } from 'express';
import { sendOtp, verifyOtp, refreshAccessToken, getMe, forgotPassword, logout } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, sendOtpSchema, verifyOtpSchema, forgotPasswordSchema } from '../validators/authValidator.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

router.post('/send-otp', validate(sendOtpSchema), sendOtp);
router.post('/otp/send', validate(sendOtpSchema), sendOtp);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);
router.post('/otp/verify', validate(verifyOtpSchema), verifyOtp);
router.post('/refresh', refreshAccessToken);
router.get('/me', protect, getMe);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/logout', protect, logout);

export default router;
