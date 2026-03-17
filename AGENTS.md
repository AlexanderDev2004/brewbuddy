# AGENTS.md
Guidance for agentic coding assistants working in this repository.

## Product Context (Read First)
- BrewBuddy helps coffee beginners choose and follow brew recipes.
- Typical user questions: "resep V60 yang aman", "Japanese iced coffee", "rasio kopi-air", "grind size".
- Prioritize clarity over complexity: steps must be practical and beginner-friendly.
- Recipe content should include measurable values (grams, ml, seconds, temperature when relevant).
- Community value: users can share recipes and others can follow/try them.

## Project Snapshot
- Frontend: Expo + React Native + React 19
- Styling: NativeWind (Tailwind-style utilities) + `global.css`
- Backend: NestJS (TypeScript)
- Database: PostgreSQL
- Active DB name: `brewbuddy`
- Routing (frontend): `expo-router` with file-based routes in `app/`
- TypeScript: strict mode enabled in both apps
- Package manager: npm
- Frontend path alias: `@/*` points to repository root

## Repository Layout
- `app/`, `components/`, `hooks/`, `constants/`, `assets/`: Expo frontend
- `tailwind.config.js`, `global.css`, `metro.config.js`, `babel.config.js`: NativeWind/Tailwind config
- `backend/src/`: NestJS API source
- `backend/test/`: backend e2e test config/files
- `scripts/`: utility scripts for frontend template/reset

## Command Reference
Run from repo root: `D:\Devoloper\brewbuddy`

### Frontend (Expo)
```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
npx tsc --noEmit
```

### Backend (NestJS) from root
```bash
npm run backend:install
npm run backend:start
npm run backend:lint
npm run backend:typecheck
npm run backend:test
```

### Backend (direct in `backend/`)
```bash
npm run start:dev
npm run lint
npm run typecheck
npm run test
npm run test:e2e
```

## Build and Deployment Notes
- Frontend has no dedicated `build` script; web export can use:
```bash
npx expo export --platform web
```
- Backend production run command:
```bash
npm --prefix backend run build
npm --prefix backend run start:prod
```
- EAS/native production config is not set (`eas.json` absent).

## Testing Guide (Including Single Test)

### Frontend tests
- No frontend test framework is configured currently.
- No `npm test` at root.

### Backend tests
- Unit tests:
```bash
npm --prefix backend run test
```
- Single test file:
```bash
npm --prefix backend run test -- src/app.controller.spec.ts
```
- Single test by name:
```bash
npm --prefix backend run test -- src/app.controller.spec.ts -t "should return health payload"
```
- E2E tests:
```bash
npm --prefix backend run test:e2e
```

## Database Configuration
- Engine: PostgreSQL
- Default connection values in `backend/.env.example`.
- Required DB name: `brewbuddy`
- Typical local setup:
  - host: `localhost`
  - port: `5432`
  - username: `postgres`
  - password: `postgres`
  - database: `brewbuddy`
- Create DB manually if needed:
```sql
CREATE DATABASE brewbuddy;
```

## Backend API Conventions
- Base URL prefix: `/api`
- Current recipe endpoints:
  - `GET /api/recipes`
  - `GET /api/recipes/:id`
  - `POST /api/recipes`
  - `DELETE /api/recipes/:id`
- Validation is enforced globally (`ValidationPipe` with whitelist + transform).

## Code Style Guidelines
Follow local file conventions before introducing new patterns.

### Imports
- Order imports: third-party, blank line, internal imports.
- Frontend internal imports should use `@/...` alias.
- Keep imports minimal and remove unused symbols.
- Prefer inline `type` imports when matching existing style.

### Formatting
- Use 2-space indentation.
- Use semicolons and single quotes.
- Keep trailing commas where formatter/lint expects them.
- Prefer small focused components/services/modules.

### TypeScript and Types
- Keep strict typing; avoid `any`.
- Prefer explicit DTO/prop/service return types.
- Use union/enums for constrained domain values (brew method, difficulty, etc.).
- Use `PropsWithChildren` where needed in React components.

### Naming
- React components: PascalCase.
- Nest modules/services/controllers/entities: PascalCase classes, kebab-case file names.
- Hooks: camelCase with `use` prefix.
- Route files in Expo must follow `expo-router` naming (`_layout.tsx`, `(tabs)`).

### Error Handling
- Do not swallow errors silently.
- Throw framework-appropriate errors (`NotFoundException`, etc.).
- Return actionable messages for invalid recipe input.
- Keep beginner context in mind when writing error text.

### Comments and Documentation
- Keep comments concise and high signal.
- Explain non-obvious decisions (platform quirks, schema constraints).
- Avoid comment noise for obvious syntax.

## Lint and Editor Settings
- Frontend ESLint config: `eslint.config.js` (Expo flat config).
- Frontend lint ignores: `dist/*`, `backend/**`.
- Workspace `.vscode/settings.json` uses explicit save actions:
  - `source.fixAll: explicit`
  - `source.organizeImports: explicit`
  - `source.sortMembers: explicit`

## Cursor and Copilot Rules
Checked locations:
- `.cursorrules`
- `.cursor/rules/`
- `.github/copilot-instructions.md`
Current status: none of these rule files exist in this repository.

## Agent Workflow Checklist
Before editing:
- Inspect nearby files for conventions.
- Keep frontend and backend changes scoped and consistent.
- Reuse existing primitives (theme hooks, DTO patterns, modules) before adding new abstractions.

After editing frontend:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.

After editing backend:
- Run `npm --prefix backend run lint`.
- Run `npm --prefix backend run typecheck`.
- Run `npm --prefix backend run test` (or single-test target when appropriate).

## Definition of Done
- Changed code compiles/type-checks in affected app(s).
- Relevant lint/test commands pass.
- DB config remains aligned with PostgreSQL database `brewbuddy`.
- AGENTS guidance stays accurate after workflow/tooling changes.
