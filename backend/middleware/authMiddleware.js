import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

/**
 * Admin-level Supabase client (service role) used exclusively for
 * server-side JWT verification and role lookups.
 * This bypasses RLS — do NOT expose to the client.
 */
const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/**
 * protect — Verifies a Supabase Bearer token from the Authorization header.
 *
 * On success: attaches `req.user = { id, email, role }` and calls next().
 * On failure: returns 401.
 *
 * The role is fetched from the `user_roles` table (user_id → role).
 * Falls back to 'customer' if no row exists.
 */
export async function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the Supabase JWT by asking Supabase to resolve the user
    const {
      data: { user },
      error,
    } = await adminClient.auth.getUser(token);

    if (error || !user) {
      return res
        .status(401)
        .json({ message: 'Not authorized, invalid or expired token' });
    }

    // Fetch role from user_roles table; default to 'customer' if not found
    const { data: roleData } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email,
      role: roleData?.role || 'customer',
    };

    next();
  } catch (err) {
    console.error('[Auth Middleware] Error:', err.message);
    return res
      .status(401)
      .json({ message: 'Not authorized, token validation failed' });
  }
}

/**
 * adminOnly — Must be used AFTER `protect`.
 * Rejects the request with 403 if the authenticated user is not an admin.
 */
export function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: admin privileges required' });
}

/**
 * optionalAuth — Attaches user to req if a valid token is present,
 * but does NOT block the request if the token is missing or invalid.
 * Useful for public endpoints that show extra data for logged-in users.
 */
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  return protect(req, res, next);
}
