# AI Lingo

AI Lingo is an AI-powered language learning application built with a modern tech stack, focusing on delivering personalized lesson plans and progress tracking for users.

## Tech Stack

**Backend:**

- Fastify (Node.js)
- SQLite (Knex.js)
- JWT Authentication

**Additional Tools:**

- Joi (for validation)
- Jest (for testing)
- ESLint (for linting)

---

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js (>= 18.x)
- npm (>= 9.x)

### Steps

1. Clone the repository

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the project root and define:

   ```env
   JWT_SECRET=your_secret_key
   DATABASE_URL=sqlite://./db/ai_lingo.db
   PORT=3000
   ```

4. Run database migrations:

   ```sh
   npx knex migrate:latest
   ```

5. Seed the database (optional):
   ```sh
   npx knex seed:run
   ```

---

## Running the Application

### Backend

Start the backend server:

```sh
npm run dev
```

The server will be available at: `http://localhost:3000`

## Running Tests

To run the automated tests:

```sh
npm test
```

Tests include unit tests for controllers and integration tests using Postman.

---

## Scripts

- `npm run dev` - Start the development server.
- `npm test` - Run the test suite.
- `npm run lint` - Run ESLint to check for code quality issues.

---

## Licensing

This project is proprietary. Permission is required from the author to use, modify, or distribute the software. Unauthorized use is strictly prohibited.

For permission inquiries, contact: d(dot)pagowski(meh)gmail.com
