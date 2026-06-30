import { Router } from 'express';
import {
  createOrder, getOrders, getOrderById,
  updateOrderStatus, downloadInvoice, getOrderTracking,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { createOrderSchema, updateStatusSchema } from '../validators/orderValidator.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

router.post('/', protect, validate(createOrderSchema), createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, adminOnly, validate(updateStatusSchema), updateOrderStatus);
router.get('/:id/invoice', protect, downloadInvoice);
router.get('/:id/tracking', protect, getOrderTracking);

export default router;
