/**
 * Simple logger utility to print logs to the console with different levels
 */
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

export const logger = {
  error: (message, data = {}) => {
    console.error(`[ERROR] ${message}`);
    if (Object.keys(data).length > 0) {
      // Only include stack trace in debug mode
      if (LOG_LEVEL !== 'debug' && data.error?.stack) {
        const { stack, ...rest } = data.error;
        data.error = rest;
      }
      console.error(JSON.stringify(data, null, 2));
    }
  },
  info: (message, data = {}) => {
    console.log(`[INFO] ${message}`);
    if (Object.keys(data).length > 0) {
      console.log(JSON.stringify(data, null, 2));
    }
  },
  warn: (message, data = {}) => {
    console.warn(`[WARN] ${message}`);
    if (Object.keys(data).length > 0) {
      console.warn(JSON.stringify(data, null, 2));
    }
  },
  debug: (message, data = {}) => {
    if (LOG_LEVEL === 'debug') {
      console.log(`[DEBUG] ${message}`);
      if (Object.keys(data).length > 0) {
        // In debug mode, include stack trace if available
        if (data.error?.stack) {
          console.log('Stack Trace:');
          console.log(data.error.stack);
        }
        // Remove stack from the data object to avoid duplication
        if (data.error) {
          const { stack, ...rest } = data.error;
          data.error = rest;
        }
        console.log(JSON.stringify(data, null, 2));
      }
    }
  }
}; 