import supabase from '../config/supabase.js';
import { sendOtpEmail, sendPasswordResetEmail } from '../services/emailService.js';

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP email for login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
export async function sendOtp(req, res) {
  const { email } = req.body;
  const cleanEmail = email.trim().toLowerCase();

  try {
    // Trigger Supabase OTP email
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: { shouldCreateUser: true },
    });

    if (error) {
      console.error('[Auth] Send OTP error:', error);
      return res.status(500).json({ message: error.message });
    }

    // Also ensure the user has a role
    const adminEmail = (process.env.ADMIN_EMAIL || 'shreedhana2005@gmail.com').toLowerCase();

    res.status(200).json({ message: 'Verification code sent to your email' });
  } catch (error) {
    console.error('[Auth] sendOtp error:', error);
    res.status(500).json({ message: 'Server error sending OTP' });
  }
}

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP and authenticate
 *     tags: [Auth]
 */
export async function verifyOtp(req, res) {
  const { email, code } = req.body;
  const cleanEmail = email.trim().toLowerCase();

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: code.trim(),
      type: 'email',
    });

    if (error || !data?.session) {
      return res.status(400).json({ message: error?.message || 'Invalid or expired verification code' });
    }

    const user = data.session.user;
    const adminEmail = (process.env.ADMIN_EMAIL || 'shreedhana2005@gmail.com').toLowerCase();

    // Ensure user has a role in user_roles table
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!existingRole) {
      const role = cleanEmail === adminEmail ? 'admin' : 'customer';
      await supabase.from('user_roles').insert({ user_id: user.id, role });
    }

    res.status(200).json({
      message: 'Signed in successfully',
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: {
        id: user.id,
        email: user.email,
        role: existingRole?.role || (cleanEmail === adminEmail ? 'admin' : 'customer'),
      },
    });
  } catch (error) {
    console.error('[Auth] verifyOtp error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
}

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 */
export async function refreshAccessToken(req, res) {
  const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }

  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

    if (error || !data?.session) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    res.status(200).json({ accessToken: data.session.access_token });
  } catch (error) {
    console.error('[Auth] refresh error:', error);
    res.status(401).json({ message: 'Token refresh failed' });
  }
}

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 */
export async function getMe(req, res) {
  res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
  });
}

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [Auth]
 */
export async function forgotPassword(req, res) {
  const { email } = req.body;
  const cleanEmail = email.trim().toLowerCase();

  try {
    // Supabase built-in password reset
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${frontendUrl}/reset-password`,
    });

    // Always return 200 for security (don't leak user existence)
    res.status(200).json({ message: 'If the account exists, a reset email has been sent.' });
  } catch (error) {
    console.error('[Auth] forgotPassword error:', error);
    res.status(200).json({ message: 'If the account exists, a reset email has been sent.' });
  }
}

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Sign out user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 */
export async function logout(req, res) {
  try {
    await supabase.auth.signOut();
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Signed out successfully' });
  } catch (error) {
    res.status(200).json({ message: 'Signed out' });
  }
}
