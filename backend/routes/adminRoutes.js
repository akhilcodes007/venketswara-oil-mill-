import { Router } from 'express';
import {
  getDashboardStats, getCustomers, toggleBlockCustomer,
  getDeliveryList, updateDelivery,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only management endpoints
 */

router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/customers', protect, adminOnly, getCustomers);
router.put('/customers/:id/block', protect, adminOnly, toggleBlockCustomer);
router.get('/delivery', protect, adminOnly, getDeliveryList);
router.put('/delivery/:id', protect, adminOnly, updateDelivery);

export default router;
