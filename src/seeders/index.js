import { seedTransactions } from './transactionSeeder.js';
import logger from '../config/logger.js';

export const runSeeders = async () => {
  try {
    logger.info('Starting database seeding...');
    
    // Run transaction seeder
    await seedTransactions();
    
    logger.info('Database seeding completed successfully');
  } catch (error) {
    logger.error('Database seeding failed:', error);
    throw error;
  }
}; 