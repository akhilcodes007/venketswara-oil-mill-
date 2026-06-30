import { z } from 'zod';
import { validate } from './authValidator.js';

/** Schema for a single cart item within an order */
const cartItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  size: z.string().min(1),
  price: z.number().positive(),
  qty: z.number().int().positive(),
  image: z.string().optional(),
});

/**
 * createOrderSchema — Validates the body of POST /api/orders
 * Enforces Indian mobile number format, non-empty cart, and
 * all required financial fields.
 */
export const createOrderSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email().optional(),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  items: z.array(cartItemSchema).min(1, 'Cart cannot be empty'),
  subtotal: z.number().nonnegative(),
  gst: z.number().nonnegative(),
  shipping: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
  total: z.number().positive(),
  coupon: z.string().optional().nullable(),
  payment_method: z.string().min(1, 'Payment method is required'),
});

/**
 * updateStatusSchema — Validates the body of PATCH /api/orders/:id/status
 * Only the admin can transition to these statuses.
 */
export const updateStatusSchema = z.object({
  status: z.enum([
    'confirmed',
    'packed',
    'shipped',
    'out_for_delivery',
    'delivered',
    'cancelled',
  ]),
});

export { validate };
