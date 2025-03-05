import logger from '../config/logger.js';

export const requestLogger = (req, res, next) => {
  // Capture request start time
  const start = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });

  next();
}; 