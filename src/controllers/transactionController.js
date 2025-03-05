import { transactionService } from '../services/transactionService.js';
import { transactionQuerySchema } from '../models/querySchema.js';
import { logger } from '../utils/logger.js';


/**
 * Controller for handling transaction-related operations
 */
export const transactionController = {
  /**
   * Create a new transaction
   * @param {import('express').Request} req - Express request object containing transaction data
   * @param {import('express').Response} res - Express response object
   * @returns {Promise<void>} - Sends the created transaction or error response
   */
  createTransaction: async (req, res, next) => {
    try {
      const transaction = await transactionService.createTransaction(req.body);
      logger.info('Transaction created successfully', { transaction });
      res.status(201).json({
        status: 'success',
        data: transaction
      });
    } catch (error) {
      logger.error('Failed to create transaction', { error: error });
      next(error);
    }
  },

  /**
   * Get all transactions with optional filters
   * @param {import('express').Request} req - Express request object containing query parameters
   * @param {import('express').Response} res - Express response object
   * @returns {Promise<void>} - Sends the list of transactions or error response
   */
  getAllTransactions: async (req, res, next) => {
    try {
      // Validate and transform query parameters
      const { error, value } = transactionQuerySchema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation Error',
          errors: error.details.map(detail => detail.message)
        });
      }

      // Remove null values from filters
      const filters = Object.fromEntries(
        Object.entries(value).filter(([_, v]) => v !== null)
      );

      const transactions = await transactionService.getAllTransactions(filters);
      logger.info('Retrieved all transactions', { count: transactions.length });
      res.json({
        status: 'success',
        data: transactions
      });
    } catch (error) {
      logger.error('Failed to fetch transactions', { error: error });
      next(error);
    }
  },

  /**
   * Get transaction summary (total income, expenses, and net balance)
   * @param {import('express').Request} req - Express request object containing query parameters
   * @param {import('express').Response} res - Express response object
   * @returns {Promise<void>} - Sends the transaction summary or error response
   */
  getTransactionSummary: async (req, res, next) => {
    try {
      // Validate and transform query parameters
      const { error, value } = transactionQuerySchema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation Error',
          errors: error.details.map(detail => detail.message)
        });
      }

      // Remove null values from filters
      const filters = Object.fromEntries(
        Object.entries(value).filter(([_, v]) => v !== null)
      );

      const summary = await transactionService.getTransactionSummary(filters);
      logger.info('Retrieved transaction summary', { summary });
      res.json({
        status: 'success',
        data: summary
      });
    } catch (error) {
      logger.error('Failed to fetch transaction summary', { error: error });
      next(error);
    }
  },

  /**
   * Get a single transaction by ID
   * @param {import('express').Request} req - Express request object containing transaction ID
   * @param {import('express').Response} res - Express response object
   * @returns {Promise<void>} - Sends the transaction or error response
   */
  getTransactionById: async (req, res, next) => {
    try {
      const transaction = await transactionService.getTransactionById(req.params.id);
      logger.info('Retrieved transaction by ID', { id: req.params.id, transaction });
      res.json({
        status: 'success',
        data: transaction
      });
    } catch (error) {
      logger.error('Failed to fetch transaction', { id: req.params.id, error: error });
      next(error);
    }
  },

  /**
   * Update an existing transaction
   * @param {import('express').Request} req - Express request object containing transaction ID and update data
   * @param {import('express').Response} res - Express response object
   * @returns {Promise<void>} - Sends the updated transaction or error response
   */
  updateTransaction: async (req, res, next) => {
    try {
      const transaction = await transactionService.updateTransaction(
        req.params.id,
        req.body
      );
      logger.info('Transaction updated successfully', { id: req.params.id, transaction });
      res.json({
        status: 'success',
        data: transaction
      });
    } catch (error) {
      logger.error('Failed to update transaction', { id: req.params.id, error: error });
      next(error);
    }
  },

  /**
   * Delete a transaction
   * @param {import('express').Request} req - Express request object containing transaction ID
   * @param {import('express').Response} res - Express response object
   * @returns {Promise<void>} - Sends success message or error response
   */
  deleteTransaction: async (req, res, next) => {
    try {
      const result = await transactionService.deleteTransaction(req.params.id);
      logger.info('Transaction deleted successfully', { id: req.params.id });
      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      logger.error('Failed to delete transaction', { id: req.params.id, error: error });
      next(error);
    }
  }
}; 