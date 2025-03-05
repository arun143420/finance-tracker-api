# Finance Tracker API

A RESTful API for managing financial transactions with filtering capabilities and in-memory SQLite database.

## Features

- CRUD operations for transactions
- Advanced filtering capabilities
- Transaction summary with totals
- Input validation using Joi
- In-memory SQLite database
- Comprehensive logging
- Error handling
- Development mode with auto-seeding

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/arun143420/finance-tracker-api
cd finance-tracker-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=4000
NODE_ENV=dev
```

## Running the Application

Development mode (with auto-seeding):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Transactions

#### Get All Transactions
```http
GET /api/transactions
```

Query Parameters:
- `type`: Filter by transaction type ('income' or 'expense')
- `from`: Filter by start date (ISO format: YYYY-MM-DD)
- `to`: Filter by end date (ISO format: YYYY-MM-DD)
- `category`: Filter by category name

Example:
```http
GET /api/transactions?type=expense&from=2024-01-01&to=2024-01-31&category=Food
```

#### Get Transaction Summary
```http
GET /api/transactions/summary
```

Query Parameters:
- `from`: Filter by start date (ISO format: YYYY-MM-DD)
- `to`: Filter by end date (ISO format: YYYY-MM-DD)

Example:
```http
GET /api/transactions/summary?from=2024-01-01&to=2024-01-31
```

Response:
```json
{
  "status": "success",
  "data": {
    "totalIncome": 6000.00,
    "totalExpense": 2100.00,
    "netBalance": 3900.00
  }
}
```

#### Get Transaction by ID
```http
GET /api/transactions/:id
```

#### Create Transaction
```http
POST /api/transactions
```

Request Body:
```json
{
  "type": "expense",
  "amount": 100.50,
  "category": "Food",
  "date": "2024-01-15",
  "description": "Grocery shopping"
}
```

#### Update Transaction
```http
PUT /api/transactions/:id
```

Request Body: Same as Create Transaction

#### Delete Transaction
```http
DELETE /api/transactions/:id
```

## Data Model

### Transaction
```typescript
{
  id: string;          // UUID
  type: 'income' | 'expense';
  amount: number;      // Non-negative
  category: string;
  date: string;        // ISO date format
  description?: string; // Optional
}
```

## Database

The application uses SQLite in-memory database with the following schema:

```sql
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
  amount REAL NOT NULL CHECK(amount >= 0),
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT
);
```

### Development Mode
In development mode (`NODE_ENV=dev`), the application automatically seeds the database with sample transactions:
- 2 income transactions (Salary, Freelance)
- 4 expense transactions (Rent, Food, Transportation, Entertainment)

## Validation

All inputs are validated using Joi schemas:

### Query Parameters
- `type`: Must be 'income' or 'expense'
- `from` and `to`: Must be valid ISO dates
- `to` must be after or equal to `from` (if both provided)
- `category`: Must be a non-empty string

### Transaction Body
- `type`: Required, must be 'income' or 'expense'
- `amount`: Required, must be non-negative
- `category`: Required, must be non-empty
- `date`: Required, must be valid ISO date
- `description`: Optional

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 400: Bad Request (Validation errors)
- 404: Not Found (Resource not found)
- 500: Internal Server Error

Error Response Format:
```json
{
  "status": "error",
  "message": "Error message",
  "errors": ["Detailed error messages"]
}
```

## Logging

The application uses Winston for logging:
- Console output with colors
- File logging for errors (`logs/error.log`)
- Combined logging (`logs/combined.log`)

## Project Structure

```
finance-tracker-api/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # Database setup
│   │   └── logger.js     # Logger configuration
│   ├── controllers/      # Route controllers
│   │   └── transactionController.js
│   ├── middleware/       # Custom middleware
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   └── validateRequest.js
│   ├── models/          # Data models and schemas
│   │   ├── transaction.js
│   │   └── querySchemas.js
│   ├── routes/          # Route definitions
│   │   └── transactionRoutes.js
│   ├── services/        # Business logic
│   │   └── transactionService.js
│   ├── seeders/         # Database seeders
│   │   ├── index.js
│   │   └── transactionSeeder.js
│   └── app.js           # Express app setup
├── logs/                # Log files
├── .env                 # Environment variables
├── .gitignore
├── package.json
└── README.md
```
