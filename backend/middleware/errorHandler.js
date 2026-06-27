/**
 * Catch-all error handling middleware.
 */
export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error(`[Error Handler] Catastrophic error caught:`, err.stack || err.message);

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
}

/**
 * 404 Route Not Found fallback middleware.
 */
export function notFound(req, res, next) {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}
