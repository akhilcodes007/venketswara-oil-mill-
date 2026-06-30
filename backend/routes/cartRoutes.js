import { Router } from 'express';
import { getCart, saveCart, clearCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getCart);
router.post('/sync', protect, saveCart);
router.delete('/', protect, clearCart);

export default router;
