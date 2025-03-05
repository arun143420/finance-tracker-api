import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import transactionRoutes from './routes/transactionRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import logger from './config/logger.js';
import { runSeeders } from './seeders/index.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use('/api/transactions', transactionRoutes);

// Error handling
app.use(errorHandler);

// Log application startup
let PORT = process.env.PORT || 3000;
if (!process.env.PORT) {
    logger.info(`PORT not defined in env file using default one ${PORT}`);
} else {
    PORT = process.env.PORT;
    logger.info(`Using PORT defined in env file ${PORT}`);
}

// Run seeders in development mode
logger.info('NODE_ENV:', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'dev') {
    logger.info('Running seeders in development mode');
    runSeeders().catch(error => {
        logger.error('Failed to run seeders:', error);
    });
}

app.listen(PORT, () => {
    logger.info(`App server listening on port ${PORT}!`);
});
