import { z } from 'zod';
import { validate } from './authValidator.js';

/**
 * submitReviewSchema — Validates the body of POST /api/reviews
 * Enforces 1–5 integer rating and caps comment length at 500 chars.
 */
export const submitReviewSchema = z.object({
  product_id: z.string().min(1, 'Product ID is required'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z
    .string()
    .max(500, 'Comment cannot exceed 500 characters')
    .optional()
    .nullable(),
});

export { validate };
