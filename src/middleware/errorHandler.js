import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

/**
 * Global error handling middleware
 * @param {Error} err - The error object that was thrown or passed to next(err)
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function (not used in error handlers)
 */
export const errorHandler = (err, req, res, next) => {
  // Log error details
  logger.error('Error occurred:', {
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name
    },
    request: {
      method: req.method,
      url: req.url,
      query: JSON.stringify(req.query, null, 2),
      params: JSON.stringify(req.params, null, 2),
      body: JSON.stringify(req.body, null, 2)
    }
  });

  // Handle Joi validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: err.details.map(detail => detail.message)
    });
  }

  // Handle custom AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Handle SQLite errors
  if (err.code && err.code.startsWith('SQLITE_')) {
    return res.status(500).json({
      status: 'error',
      message: 'Database error occurred'
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
}; 