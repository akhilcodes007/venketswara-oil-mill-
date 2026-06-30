import { z } from 'zod';
import { validate } from './authValidator.js';

/** Schema for a single product variant (size + price pair) */
const variantSchema = z.object({
  size: z.string().min(1),
  price: z.number().positive(),
});

/**
 * createProductSchema — Validates the body of POST /api/admin/products
 * The `id` field is the slug-style identifier (e.g. "cold-pressed-coconut-oil").
 */
export const createProductSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'ID must be lowercase alphanumeric with dashes'),
  name: z.string().min(2),
  tamil_name: z.string().optional(),
  category: z.enum(['oils', 'dryfruits', 'palm-products', 'honey', 'millets']),
  description: z.string().min(10),
  variants: z.array(variantSchema).min(1),
  tags: z.array(z.string()).optional().default([]),
  stock: z.number().int().nonnegative().default(0),
  enabled: z.boolean().default(true),
  rating: z.number().min(1).max(5).default(5),
});

/**
 * updateProductSchema — Validates the body of PATCH /api/admin/products/:id
 * All fields are optional (partial update).
 */
export const updateProductSchema = createProductSchema.partial();

export { validate };
