import Joi from 'joi';

// Define individual field schemas with defaults
const type = Joi.string()
  .valid('income', 'expense')
  .default(null)
  .messages({
    'string.empty': 'Type cannot be empty',
    'any.only': 'Type must be either "income" or "expense"'
  });

const from = Joi.date()
  .iso()
  .default(null)
  .messages({
    'date.base': 'From date must be a valid date',
    'date.format': 'From date must be in ISO format (YYYY-MM-DD)'
  });

const to = Joi.date()
  .iso()
  .min(Joi.ref('from'))
  .default(null)
  .messages({
    'date.base': 'To date must be a valid date',
    'date.format': 'To date must be in ISO format (YYYY-MM-DD)',
    'date.min': 'To date must be after or equal to from date'
  });

const category = Joi.string()
  .trim()
  .default(null)
  .messages({
    'string.empty': 'Category cannot be empty'
  });

// Combine into a single schema
export const transactionQuerySchema = Joi.object({
  type,
  from,
  to,
  category
}).with('to', 'from'); // If 'to' is present, 'from' must also be present 