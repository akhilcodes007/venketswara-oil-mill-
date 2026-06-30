import { Router } from 'express';
import { getProductReviews, submitReview, deleteReview } from '../controllers/reviewController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { submitReviewSchema } from '../validators/reviewValidator.js';

const router = Router();

router.get('/:productId', optionalAuth, getProductReviews);
router.post('/', protect, validate(submitReviewSchema), submitReview);
router.delete('/:id', protect, deleteReview);

export default router;
