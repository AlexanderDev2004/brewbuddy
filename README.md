# BrewBuddy

BrewBuddy is an app for coffee beginners who are confused about which recipe to start with.
Users can discover practical brew recipes (for example V60 or Japanese iced coffee), then share
their own recipes so others can follow and try them.

## Product Goals

- Beginner-first guidance with clear, practical brewing steps.
- Recipe data must be measurable (grams, ml, seconds, temperature when relevant).
- Community recipe sharing so users can copy, follow, and learn from each other.

## Tech Stack

- Frontend: Expo + React Native + React 19 + expo-router
- Styling: NativeWind (Tailwind-style utilities)
- Backend: NestJS (TypeScript)
- Database: PostgreSQL
- Active database name: `brewbuddy`
- Package manager: npm

## Prerequisites

- Node.js 20+ (recommended)
- npm 10+ (recommended)
- PostgreSQL running locally

## Quick Start

Run all commands from repo root: `D:\Devoloper\brewbuddy`

1) Install frontend/root dependencies:

```bash
npm install
```

2) Install backend dependencies:

```bash
npm run backend:install
```

3) Create PostgreSQL database:

```sql
CREATE DATABASE brewbuddy;
```

4) Create backend env file:

Windows CMD:

```bash
copy backend\.env.example backend\.env
```

PowerShell:

```bash
Copy-Item backend/.env.example backend/.env
```

macOS/Linux:

```bash
cp backend/.env.example backend/.env
```

5) Start apps in separate terminals:

Terminal A (frontend):

```bash
npm run start
```

Terminal B (backend):

```bash
npm run backend:start
```

Backend base URL: `http://localhost:3001/api`

## Main Scripts

### Frontend (root)

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
npx tsc --noEmit
```

### Backend (from root)

```bash
npm run backend:install
npm run backend:start
npm run backend:lint
npm run backend:typecheck
npm run backend:test
```

### Backend (inside `backend/`)

```bash
npm run start:dev
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm run start:prod
```

## API Overview

Base prefix: `/api`

- `GET /api` - health check
- `GET /api/recipes` - list shared recipes
- `GET /api/recipes/:id` - get recipe detail
- `POST /api/recipes` - create recipe
- `DELETE /api/recipes/:id` - delete recipe

Example create recipe payload:

```json
{
  "title": "V60 Beginner 1 Cup",
  "brewMethod": "V60",
  "description": "Resep V60 ringan untuk pemula.",
  "coffeeGrams": 15,
  "waterMl": 240,
  "grindSize": "medium-fine",
  "brewTimeSeconds": 150,
  "steps": [
    "Bilas paper filter dengan air panas.",
    "Masukkan kopi 15g lalu ratakan.",
    "Bloom 30 detik dengan 40ml air.",
    "Tuang sisa air perlahan sampai 240ml.",
    "Selesai sekitar 2:30 menit."
  ],
  "authorName": "BrewBuddy User"
}
```

## Testing

Frontend:

- No frontend test framework is configured yet.

Backend:

```bash
npm --prefix backend run test
```

Single backend test file:

```bash
npm --prefix backend run test -- src/app.controller.spec.ts
```

Single backend test by name:

```bash
npm --prefix backend run test -- src/app.controller.spec.ts -t "should return health payload"
```

Backend e2e tests:

```bash
npm --prefix backend run test:e2e
```

## Project Structure

```text
app/                Expo routes (frontend)
components/         Shared frontend UI
hooks/              Frontend hooks
constants/          Frontend constants/theme
assets/             Static assets
backend/src/        NestJS source code
backend/test/       Backend e2e tests/config
scripts/            Utility scripts
```

## Notes

- Backend uses PostgreSQL config from `backend/.env`.
- Default DB name is `brewbuddy`.
- `DB_SYNCHRONIZE=true` is convenient for local dev; use `false` for production.
