function notFound(req, res) {
  res.status(404).json({ message: "Route not found" });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error("ERROR:", err);

  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Server error",
    details: err.details || undefined
  });
}

module.exports = { notFound, errorHandler };
