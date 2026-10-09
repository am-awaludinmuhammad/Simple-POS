# Backend

Backend API built with Node.js, Express 5, TypeScript, Prisma ORM, and PostgreSQL.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Validation:** Zod

## Prerequisites

Make sure the following are installed:

- Node.js (LTS)
- npm
- PostgreSQL

## Local Installation

### 1. Clone the Repository

Clone the project repository and navigate to the backend directory.

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file to create your local `.env` file.

```bash
cp .env.example .env
```

Update the values in `.env` according to your local database configuration and environment.

Do not commit your `.env` file to version control.

Replace the database credentials and secret values with your local configuration.

### 4. Set Up the Database

Make sure your PostgreSQL server is running and the configured database exists.

Apply the Prisma migrations:

```bash
npx prisma migrate deploy
```

Generate the Prisma Client if it is not generated automatically:

```bash
npx prisma generate
```

### 5. Seed Initial Data

Run the following command to seed the initial roles and users into the database.

```bash
npm run prisma:seed
```

Ensure your `.env` file is configured correctly before running the seed command.

### 6. Start the Development Server

```bash
npm run dev
```

Refer to the corresponding module routes for available endpoints.

## Development Guidelines

Before contributing or modifying the backend, read the Backend [README.md](./backend/README.md) for coding conventions and architectural guidelines, including:

- Module structure and responsibilities
- Controller and service conventions
- Request validation
- Error handling
- Prisma usage
- Response formats
