<!--
Short, actionable guidance for AI coding agents working on the PMFront repository.
Keep this file concise (~20-50 lines) and focused on discoverable patterns, build flows,
and files that an agent will need to edit or inspect.
-->

# Copilot instructions for PMFront

- Project: PMFront — React + TypeScript + Vite single-page application.
- Primary source: `src/` (entry: `src/Main.tsx`, router: `src/App.tsx`, views under `src/views/`).

- Quick commands (Windows PowerShell):
  - Install deps: `npm install`
  - Start dev server (HMR): `npm run dev` (Vite, defined in `package.json`).
  - Build: `npm run build` (runs `tsc -b && vite build`).
  - Preview build: `npm run preview`.

- Architecture & conventions (what to look for):
  - Routing is handled with `react-router-dom`. App routes are in `src/App.tsx` and wrapped in `BrowserRouter` in `src/Main.tsx`.
  - Views live in `src/views/<Name>/` with a `.tsx` and a `.css` file pair (example: `src/views/Dashboard/Dashboard.tsx`).
  - Components appear under `src/components/` and are organized by kind (e.g. `buttons`, `inputs`). Prefer adding paired CSS files next to components.
  - Global Vite settings and dev-server host/port are in `vite.config.ts` (server: host `0.0.0.0`, port `5151`). Respect the port when editing Docker / dev compose files.

- TypeScript and linting:
  - TypeScript project references are in `tsconfig.json` -> `tsconfig.app.json` and `tsconfig.node.json`.
  - Lint with `npm run lint` (ESLint config is at project root: `eslint.config.js`).

- Editing patterns and examples:
  - When adding a route, update `src/App.tsx` and create the view under `src/views/<Name>/` with a matching CSS file.
  - Small components should be colocated: e.g. `src/components/buttons/Button.css` pairs with a `Button.tsx` in the same folder.
  - Network calls use `axios` (look for uses under `src/functions/` or new services placed under `src/services/`).

- Integration points and external expectations:
  - The app expects to run on port 5151 in development (see `vite.config.ts`) — Dockerfiles reference this port.
  - React Router version is configured for the v6+ API (Router usage: `<Routes><Route .../></Routes>`).

- What NOT to change without confirmation:
  - The Vite server host/port unless you also update Docker compose and Dockerfiles.
  - Top-level `tsconfig` references — add new tsconfigs only when needed and follow existing reference patterns.

- Examples to reference in edits:
  - Entry point: `src/Main.tsx`
  - Router: `src/App.tsx`
  - Example view (incomplete stub): `src/views/Dashboard/Dashboard.tsx` — implement following existing view pattern (export default functional component + paired CSS file).

If anything above is unclear or you need runtime/test commands not present here, ask for permission to run the project's dev server or to inspect additional files (Dockerfiles, docker-compose) to derive environment-specific commands.
