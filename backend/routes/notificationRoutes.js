import { Router } from 'express';
import { getNotifications, markAsRead, markAllRead } from '../controllers/notificationController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, adminOnly, getNotifications);
router.put('/:id/read', protect, adminOnly, markAsRead);
router.put('/read-all', protect, adminOnly, markAllRead);

export default router;
