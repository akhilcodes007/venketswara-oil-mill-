import rateLimit from "express-rate-limit";

// Limit request rates for general API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  message: {
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for authentication routes (login, OTP generation)
export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 15, // Limit each IP to 15 login/OTP attempts per windowMs
  message: {
    message: "Too many authentication attempts, please try again after 5 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
