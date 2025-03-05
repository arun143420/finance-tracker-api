import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { ValidationError } from '../utils/errors.js';

// Common validation messages
const messages = {
  type: {
    'string.empty': 'Transaction type is required',
    'any.only': 'Transaction type must be either "income" or "expense"'
  },
  amount: {
    'number.base': 'Amount must be a number',
    'number.min': 'Amount must be greater than or equal to 0',
    'number.precision': 'Amount cannot have more than 2 decimal places'
  },
  category: {
    'string.empty': 'Category is required',
    'string.min': 'Category must be at least 2 characters long',
    'string.max': 'Category cannot exceed 50 characters'
  },
  date: {
    'date.base': 'Date must be a valid date',
    'date.format': 'Date must be in ISO format (YYYY-MM-DD)',
    'date.max': 'Date cannot be in the future'
  },
  description: {
    'string.max': 'Description cannot exceed 200 characters'
  }
};

// Transaction schema
export const transactionSchema = Joi.object({
  id: Joi.string().uuid().default(() => uuidv4()),
  type: Joi.string().valid('income', 'expense').required().messages(messages.type),
  amount: Joi.number()
    .min(0)
    .precision(2)
    .required()
    .messages(messages.amount),
  category: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .required()
    .messages(messages.category),
  date: Joi.date()
    .iso()
    .max('now')
    .messages(messages.date)
    .default(() => new Date().toISOString()),
  description: Joi.string()
    .max(200)
    .trim()
    .allow('')
    .optional()
    .messages(messages.description)
});

// Query parameters schema
export const transactionQuerySchema = Joi.object({
  type: Joi.string().valid('income', 'expense').messages(messages.type),
  from: Joi.date().iso().max('now').messages(messages.date),
  to: Joi.date().iso().min(Joi.ref('from')).max('now').messages(messages.date),
  category: Joi.string().min(2).max(50).trim().messages(messages.category)
}).with('to', 'from');

// Validation function with custom error handling
export const validateTransaction = (data) => {
  const { error, value } = transactionSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    throw new ValidationError(errorMessages.join(', '));
  }

  return value;
};

// Common transaction categories
export const TRANSACTION_CATEGORIES = {
  EXPENSE: [
    'Food',
    'Rent',
    'Utilities',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Healthcare',
    'Education',
    'Other'
  ],
  INCOME: [
    'Salary',
    'Freelance',
    'Investments',
    'Gifts',
    'Other'
  ]
};