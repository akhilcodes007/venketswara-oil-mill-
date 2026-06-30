import { z } from 'zod';

export const sendOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must be numeric'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

/**
 * validate — Express middleware factory.
 * Parses and validates req.body against the given Zod schema.
 * On success: replaces req.body with the parsed (coerced + stripped) data.
 * On failure: returns 400 with a structured errors array.
 *
 * @param {z.ZodSchema} schema - Zod schema to validate against
 */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    req.body = result.data;
    next();
  };
}
