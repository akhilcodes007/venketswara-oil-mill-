/**
 * notFound — 404 handler. Must be registered AFTER all routes.
 * Converts unknown routes into a proper 404 error and passes it
 * to the global error handler below.
 */
export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
}

/**
 * errorHandler — Global Express error handler.
 * Must be registered last (4-argument signature required by Express).
 *
 * - Uses res.statusCode if it was already set to a non-200 value
 *   (e.g. by a controller calling res.status(400) then next(err)).
 * - Falls back to 500 for unhandled errors.
 * - Omits stack traces in production.
 */
export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  console.error(`[Error Handler] ${err.message}`);

  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}
