export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found — ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Common Mongoose error shapes get a friendlier message + 400 status.
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: Object.values(err.errors).map((e) => e.message).join(", "),
    });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({ message: `That ${field} is already in use.` });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
  }

  res.status(status).json({
    message: err.message || "Something went wrong.",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}
