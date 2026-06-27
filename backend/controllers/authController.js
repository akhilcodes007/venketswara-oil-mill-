import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { sendOtpEmail, sendPasswordResetEmail } from "../utils/emailService.js";

// Helper: Generate Access Token
function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "super_secret_access_token_key_123!", {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  });
}

// Helper: Generate Refresh Token
function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || "super_secret_refresh_token_key_456!", {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  });
}

/**
 * Sends a 6-digit OTP code to user's email.
 */
export async function sendOtp(req, res) {
  const { email } = req.body;
  const cleanEmail = email.trim().toLowerCase();

  try {
    // Generate a 6-digit random code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Expire in 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Delete existing OTP for this email
    await Otp.deleteMany({ email: cleanEmail });

    // Store new OTP
    await Otp.create({ email: cleanEmail, code: otpCode, expiresAt });

    // Send email
    const emailResult = await sendOtpEmail(cleanEmail, otpCode);

    if (!emailResult.success) {
      return res.status(500).json({ message: "Failed to send verification email. Try again later." });
    }

    res.status(200).json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error("[Auth Controller] Send OTP Error:", error);
    res.status(500).json({ message: "Server error generating verification code" });
  }
}

/**
 * Verifies OTP and registers or logs in user.
 */
export async function verifyOtp(req, res) {
  const { email, code } = req.body;
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = code.trim();

  try {
    // Find valid OTP record
    const otpRecord = await Otp.findOne({ email: cleanEmail, code: cleanCode });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    // OTP is valid. Remove it from the database.
    await Otp.deleteOne({ _id: otpRecord._id });

    // Find or create User
    let user = await User.findOne({ email: cleanEmail });
    
    if (!user) {
      // Determine role: default is customer. shreedhana2005@gmail.com becomes admin.
      const adminEmail = process.env.ADMIN_EMAIL || "shreedhana2005@gmail.com";
      const role = cleanEmail === adminEmail.toLowerCase() ? "admin" : "customer";
      
      user = await User.create({
        email: cleanEmail,
        role: role,
      });
      console.log(`[Auth Controller] Registered new user ${cleanEmail} with role: ${role}`);
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked. Contact support." });
    }

    // Issue tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Express can also place refresh tokens in HTTPOnly cookies for security
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Signed in successfully",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[Auth Controller] Verify OTP Error:", error);
    res.status(500).json({ message: "Server error during verification" });
  }
}

/**
 * Renews access token using valid refresh token.
 */
export async function refreshAccessToken(req, res) {
  const token = req.body.refreshToken || req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || "super_secret_refresh_token_key_456!");
    const user = await User.findById(decoded.id);

    if (!user || user.isBlocked) {
      return res.status(401).json({ message: "Unauthorized token renew" });
    }

    const accessToken = generateAccessToken(user._id);
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("[Auth Controller] Refresh Token Error:", error.message);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
}

/**
 * Returns current user's profile details.
 */
export async function getMe(req, res) {
  res.status(200).json({
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
  });
}

/**
 * Handles password-reset request links.
 */
export async function forgotPassword(req, res) {
  const { email } = req.body;
  const cleanEmail = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      // Return 200 for security reasons (don't leak user list)
      return res.status(200).json({ message: "If the account exists, a reset email has been sent." });
    }

    // Generate brief reset token (1 hour)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "super_secret_access_token_key_123!", {
      expiresIn: "1h",
    });

    const resetLink = `${req.protocol}://${req.get("host")}/reset-password?token=${token}`;
    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({ message: "If the account exists, a reset email has been sent." });
  } catch (error) {
    console.error("[Auth Controller] Forgot Password Error:", error);
    res.status(500).json({ message: "Server error handling password reset request" });
  }
}

/**
 * Logs out user by clearing cookies.
 */
export async function logout(req, res) {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Signed out successfully" });
}
