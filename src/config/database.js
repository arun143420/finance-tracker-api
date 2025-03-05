import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a new database instance
const db = new Database(':memory:', { verbose: console.log });

// Initialize database with tables
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    amount REAL NOT NULL CHECK(amount >= 0),
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT
  )
`);

export default db; 