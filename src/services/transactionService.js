import { validateTransaction } from '../models/transaction.js';
import db from '../config/database.js';
import { NotFoundError, DatabaseError } from '../utils/errors.js';

// Prepare SQL statements
const insertTransaction = db.prepare(`
  INSERT INTO transactions (id, type, amount, category, date, description)
  VALUES (@id, @type, @amount, @category, @date, @description)
`);

const getTransactionById = db.prepare('SELECT * FROM transactions WHERE id = ?');
const updateTransaction = db.prepare(`
  UPDATE transactions 
  SET type = @type, amount = @amount, category = @category, 
      date = @date, description = @description
  WHERE id = @id
`);
const deleteTransaction = db.prepare('DELETE FROM transactions WHERE id = ?');

export const transactionService = {
  // Create a new transaction
  createTransaction: async (transactionData) => {
    try {
      // Validate and transform the data
      console.log(transactionData);
      const validatedData = validateTransaction(transactionData);
      
      // Insert the validated data
      insertTransaction.run(validatedData);
      return validatedData;
    } catch (err) {
      if (err instanceof ValidationError) {
        throw err;
      }
      if (err.code === 'SQLITE_CONSTRAINT') {
        throw new DatabaseError('Transaction with this ID already exists');
      }
      throw new DatabaseError('Failed to create transaction');
    }
  },

  // Get all transactions with filters
  getAllTransactions: async (filters = {}) => {
    try {
      let query = 'SELECT * FROM transactions';
      const conditions = [];
      const params = [];

      // Add type filter
      if (filters.type) {
        conditions.push('type = ?');
        params.push(filters.type);
      }

      // Add date range filter
      if (filters.from) {
        conditions.push('date >= ?');
        params.push(filters.from);
      }
      if (filters.to) {
        conditions.push('date <= ?');
        params.push(filters.to);
      }

      // Add category filter
      if (filters.category) {
        conditions.push('category = ?');
        params.push(filters.category);
      }

      // Build the query
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      // Add sorting
      query += ' ORDER BY date DESC';

      // Prepare and execute the query
      const stmt = db.prepare(query);
      return stmt.all(...params);
    } catch (err) {
      throw new DatabaseError('Failed to fetch transactions');
    }
  },

  // Get transaction summary
  getTransactionSummary: async (filters = {}) => {
    try {
      let query = `
        SELECT 
          COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as totalIncome,
          COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as totalExpense
        FROM transactions
      `;

      const conditions = [];
      const params = [];

      // Add date range filter
      if (filters.from) {
        conditions.push('date >= ?');
        params.push(filters.from);
      }
      if (filters.to) {
        conditions.push('date <= ?');
        params.push(filters.to);
      }

      // Build the query
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      // Execute the query
      const stmt = db.prepare(query);
      const result = stmt.get(...params);

      // Calculate net balance
      const netBalance = result.totalIncome - result.totalExpense;

      return {
        totalIncome: result.totalIncome,
        totalExpense: result.totalExpense,
        netBalance
      };
    } catch (err) {
      throw new DatabaseError('Failed to calculate transaction summary');
    }
  },

  // Get transaction by ID
  getTransactionById: async (id) => {
    try {
      const transaction = getTransactionById.get(id);
      if (!transaction) throw new NotFoundError('Transaction not found');
      return transaction;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Failed to fetch transaction');
    }
  },

  // Update transaction
  updateTransaction: async (id, updateData) => {
    try {
      const validatedData = validateTransaction({
        ...updateData,
        id // Preserve the original ID
      });

      const result = updateTransaction.run(validatedData);
      if (result.changes === 0) throw new NotFoundError('Transaction not found');
      
      return validatedData;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      if (err instanceof ValidationError) throw err;
      throw new DatabaseError('Failed to update transaction');
    }
  },

  // Delete transaction
  deleteTransaction: async (id) => {
    try {
      const result = deleteTransaction.run(id);
      if (result.changes === 0) throw new NotFoundError('Transaction not found');
      
      return { message: 'Transaction deleted successfully' };
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Failed to delete transaction');
    }
  }
}; 