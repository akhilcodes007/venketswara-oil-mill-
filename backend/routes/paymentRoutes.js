import { Router } from 'express';
import { createRazorpayOrder, verifyPayment, getPaymentHistory } from '../controllers/paymentController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Razorpay payment integration
 */

router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);
router.get('/', protect, adminOnly, getPaymentHistory);

export default router;
