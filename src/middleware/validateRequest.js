/*
 * - Validate request middleware, called in routes where we need to validate the request body
 * - Joi is used to validate the request body
 * - If validation fails, a 400 error is returned
 * - If validation passes, the next middleware is called
 */

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation Error',
        errors: error.details.map(detail => detail?.message)
      });
    }

    next();
  };
}; 