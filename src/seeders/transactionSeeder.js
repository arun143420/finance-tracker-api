import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import logger from '../config/logger.js';

const dummyTransactions = [
  {
    id: uuidv4(),
    type: 'income',
    amount: 5000,
    category: 'Salary',
    date: new Date().toISOString(),
    description: 'Monthly salary'
  },
  {
    id: uuidv4(),
    type: 'income',
    amount: 1000,
    category: 'Freelance',
    date: new Date().toISOString(),
    description: 'Freelance project payment'
  },
  {
    id: uuidv4(),
    type: 'expense',
    amount: 1500,
    category: 'Rent',
    date: new Date().toISOString(),
    description: 'Monthly rent payment'
  },
  {
    id: uuidv4(),
    type: 'expense',
    amount: 300,
    category: 'Food',
    date: new Date().toISOString(),
    description: 'Grocery shopping'
  },
  {
    id: uuidv4(),
    type: 'expense',
    amount: 100,
    category: 'Transportation',
    date: new Date().toISOString(),
    description: 'Bus tickets'
  },
  {
    id: uuidv4(),
    type: 'expense',
    amount: 200,
    category: 'Entertainment',
    date: new Date().toISOString(),
    description: 'Movie tickets and dinner'
  }
];

export const seedTransactions = async () => {
  try {
    // Prepare the insert statement
    const insertTransaction = db.prepare(`
      INSERT INTO transactions (id, type, amount, category, date, description)
      VALUES (@id, @type, @amount, @category, @date, @description)
    `);

    // Insert each transaction
    for (const transaction of dummyTransactions) {
      insertTransaction.run(transaction);
    }

    logger.info('Successfully seeded transactions');
    return true;
  } catch (error) {
    logger.error('Error seeding transactions:', error);
    throw error;
  }
}; 