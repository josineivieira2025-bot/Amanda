export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Rota nao encontrada: ${req.originalUrl}`));
}

export function errorHandler(error, req, res, next) {
  const status = error.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(status).json({
    message: error.message || 'Erro interno.',
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
  });
}
