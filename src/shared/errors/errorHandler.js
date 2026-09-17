function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : "Erro interno do servidor";

  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
