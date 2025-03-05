import express from 'express';
import { transactionController } from '../controllers/transactionController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { transactionSchema } from '../models/transaction.js';

const transactionRouter = express.Router();

transactionRouter
  .route('/')
  .get(transactionController.getAllTransactions)
  .post(validateRequest(transactionSchema), transactionController.createTransaction);

// Add summary route
transactionRouter.get('/summary', transactionController.getTransactionSummary);

transactionRouter
  .route('/:id')
  .get(transactionController.getTransactionById)
  .put(validateRequest(transactionSchema), transactionController.updateTransaction)
  .delete(transactionController.deleteTransaction);

export default transactionRouter;