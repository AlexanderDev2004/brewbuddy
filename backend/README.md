# BrewBuddy API (NestJS)

Backend API for recipe sharing, built with NestJS + PostgreSQL.

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Copy environment template:

```bash
cp .env.example .env
# or on Windows Command Prompt:
copy .env.example .env
```

3. Create database in PostgreSQL:

```sql
CREATE DATABASE brewbuddy;
```

4. Start development server:

```bash
npm run start:dev
```

API base URL: `http://localhost:3001/api`

## Available endpoints

- `GET /api` health check
- `GET /api/recipes` list recipes
- `GET /api/recipes/:id` get recipe detail
- `POST /api/recipes` create recipe
- `DELETE /api/recipes/:id` delete recipe
