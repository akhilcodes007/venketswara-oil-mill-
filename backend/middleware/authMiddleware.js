import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to verify user JWT token in Request headers.
 */
export async function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      
      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret_access_token_key_123!");
      
      // Get user from DB
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: "User not found or deleted" });
      }

      if (user.isBlocked) {
        return res.status(403).json({ message: "User account has been blocked" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("[Auth Middleware] JWT Validation error:", error.message);
      return res.status(401).json({ message: "Not authorized, token invalid or expired" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
}

/**
 * Middleware to check if user has admin privileges.
 */
export function adminOnly(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Not authorized, admin privileges required" });
  }
}
