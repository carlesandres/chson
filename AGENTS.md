# AGENTS.md

This file provides guidance to AI coding agents working in this repository.

Note: `CLAUDE.md` is a symlink to `AGENTS.md` (intentionally kept that way).

## What Is This Repo?

ChSON is a JSON-based format for software cheatsheets. This repo is a Turborepo monorepo containing:

- **`packages/chson-schema/`** — JSON Schema + auto-generated TypeScript types
- **`packages/chson-registry/`** — Example cheatsheets (source of truth)
- **`packages/chson-cli/`** — Node.js CLI for validation and rendering
- **`packages/chson-ui/`** — React renderers, hooks, and headless core for ChSON
- **`docs/adr/`** — Architecture decision records (see `001-layers.md`)
- **`apps/web/`** — Next.js 16 website with shadcn/ui and Fumadocs

### Package Dependencies

```
@chson/schema (builds types)
  ├── @chson/cli (validates/renders)
  ├── @chson/ui (renders in React)
  └── @chson/registry (validates its cheatsheets)
        └── @chson/web (displays cheatsheets)
```

## Environment Requirements

- **Node.js**: `^20.19.0 || >=22.12.0` (`.nvmrc` = `20.19`)
- **npm**: pinned to `11.10.1` via `packageManager` field — corepack-enforced
- **TypeScript**: forced to `6.0.2` monorepo-wide via root `package.json` `overrides`

## Commands

```bash
# Install dependencies
npm install

# Build all packages (schema types → cli/registry/ui → site)
npm run build

# Validate all cheatsheets against schema
npm run validate

# Type check all packages
npm run typecheck

# Build specific package
turbo run build --filter=@chson/schema
turbo run build --filter=@chson/web

# Clean build (also clear ui artifacts)
rm -rf .turbo build packages/chson-schema/types packages/chson-ui/dist packages/chson-ui/types && npm run build
```

### Website Commands (apps/web)

```bash
cd apps/web

npm run dev           # Start dev server
npm run build         # Production build
npm run typecheck     # TypeScript check (uses tsconfig.typecheck.json, not tsconfig.json)
npm run lint          # Runs typecheck + oxlint --fix (NOT just linting)
npm run prettify      # Format with Prettier

# Tests
npm test              # Run all tests once
npm run test:watch    # Watch mode
npm run test:ui       # Vitest UI
npm run test:coverage # With coverage

# Run a single test file
npx vitest run lib/__tests__/cheatsheets.test.ts

# Run tests matching a pattern
npx vitest run --testNamePattern "exports correct"
```

### CLI Commands (packages/chson-cli)

```bash
# Validate a single file
node packages/chson-cli/src/chson.js validate packages/chson-registry/cheatsheets/git/core.chson.json

# Render cheatsheet to Markdown
node packages/chson-cli/src/chson.js render markdown packages/chson-registry/cheatsheets/git/core.chson.json
```

## Code Style

### TypeScript/React (apps/web, packages/chson-ui)

- **Single quotes** (configured in `apps/web/.prettierrc`)
- **2-space indent**
- **`moduleResolution: "bundler"`** — Required for Fumadocs. Do NOT change to `"node"`
- **Path aliases**: Use `components/`, `lib/`, `hooks/` etc. (not relative `../`)
- **`verbatimModuleSyntax: true`** in `@chson/ui` — must use `import type` for type-only imports

### JavaScript (packages/chson-cli)

- **ES modules**, Node 20+
- **2-space indent**, **double quotes**
- `"moduleResolution": "NodeNext"` — differs from all other packages
- Import order: `node:*` builtins → third-party → local

### JSON (packages/chson-schema, packages/chson-registry)

- **2-space indent**
- Keep key order stable

## Architecture

### Data Flow (`.chson.json` → website)

```
packages/chson-registry/cheatsheets/<product>/<name>.chson.json
  │
  │  direct fs.readFileSync at build time (NOT via index.json or CLI)
  ▼
apps/web/lib/cheatsheets.ts :: getAllCheatsheets()
  │
  │  generateStaticParams → static site generation
  ▼
apps/web/app/(home)/cheatsheets/[product]/[name]/page.tsx
  │
  │  dispatches by data.documentType
  ▼
@chson/ui renderers: Cheatsheet | Checklist | Runbook | Tldr | Bookmarks
```

`packages/chson-registry/index.json` is **not used by the website** — it is a pre-built metadata index for external consumers only.

### Fumadocs Layouts

- **`HomeLayout`** — For non-docs pages (home, use-cases, cheatsheets)
- **`DocsLayout`** — For documentation pages with sidebar
- **Shared config** — `lib/layout.shared.tsx` provides `baseOptions()` for both layouts
- **`RootProvider`** — Wraps app in root layout, handles theme switching

### Schema Source of Truth

- **File**: `packages/chson-schema/schema/chson.schema.json`
- **Public URL**: `https://chson.dev/api/schema.json`
- **Served by**: `apps/web/app/api/schema.json/route.ts`

### `@chson/schema` Dual Export

Same package resolves differently depending on context:
- `import "@chson/schema"` → raw `schema/chson.schema.json` (used by CLI, API route)
- `import type { ChSONDocument } from "@chson/schema"` → `types/index.d.ts` (generated)

### `@chson/ui` in Next.js

- `transpilePackages: ['@chson/ui']` — Next.js transpiles it from source (not pre-built for SSR)
- Webpack alias: `@chson/ui/shadcn` → workspace TypeScript source for HMR; bypasses built `dist/`
- `@chson/ui` has three export paths: `.` (full), `./core`, `./shadcn`, `./shadcn/*`
- React is a `peerDependency` (>=18), not a direct dep

## Generated Artifacts — Do NOT Edit Manually

| File | Generated by |
|---|---|
| `packages/chson-schema/types/index.d.ts` | `json-schema-to-typescript` from `schema/chson.schema.json` |
| `packages/chson-registry/index.json` | `scripts/build-index.js` (walks `cheatsheets/`) |
| `apps/web/.source/` | Fumadocs MDX at build time (gitignored) |
| `apps/web/types/supabase.ts` | `npm run gen-types` (requires Supabase CLI + linked project) |

## Important Constraints

### Fumadocs Requirements

1. **`moduleResolution: "bundler"`** is required. Do NOT suggest changing to `"node"`.
2. **`defaultMdxComponents`** from `fumadocs-ui/mdx` includes `Callout`, `Card`, `Cards`, `Steps`, `Tab`, `Tabs`. These do NOT need manual imports in MDX.
3. **`.source/`** directory is auto-generated at build time (gitignored).
4. Import from `@/.source/server` not `@/.source`.

### Two tsconfig Files in `apps/web`

- `tsconfig.json` — used by Next.js dev server and build; includes `.source/`
- `tsconfig.typecheck.json` — used by `typecheck` and `lint` scripts; excludes `.source/` and uses `.source-stub/` as a fallback so typecheck works before Fumadocs generates `.source/`

### Zod Version

This project uses **Zod 4.x** (not 3.x). Zod 4 API differs from v3 (error shapes, `.parse` format, etc.).

### Testing

- **Vitest** with jsdom environment
- Test files: `**/*.{test,spec}.{ts,tsx}`
- Setup file: `vitest.setup.ts`
- Globals enabled (`describe`, `it`, `expect` available without imports)
- **`console.error` and `console.warn` are globally silenced** in `vitest.setup.ts` — React warnings and prop errors will NOT appear in test output

### No Pre-commit Hooks

Husky is a devDep of `apps/web` but no hooks are configured. There is no automated pre-commit enforcement.

## Workflow

**Adding cheatsheets**:
1. Create `packages/chson-registry/cheatsheets/<product>/<name>.chson.json`
2. Include `"$schema": "https://chson.dev/api/schema.json"`
3. Run `npm run validate`
4. Run `npm run build`

**Schema changes**: Keep backwards-compatible.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on PRs and pushes to main — two separate jobs:

**`validate` job**:
1. `npm run validate` — validates all `.chson.json` files against schema
2. `npx turbo run typecheck --filter=@chson/schema --filter=@chson/cli` — **only these two packages** are typechecked in CI (`@chson/ui` and `@chson/web` are not)

**`registry-prototype` job**:
1. `npm install` (root)
2. `npm --prefix examples/chson-shadcn-registry install` — separate install (standalone sub-project, NOT in workspaces)
3. `npm --prefix examples/chson-shadcn-registry run registry:check`

## ChSON Schema Structure

Based on cognitive retrieval theory:
```json
{
  "title": "...",
  "version": "...",
  "description": "...",
  "retrievalDirection": "mechanism-to-meaning",
  "anchorLabel": "Command",
  "contentLabel": "Description",
  "sections": [{
    "title": "...",
    "entries": [{
      "anchor": "git status",
      "content": "Show working tree status."
    }]
  }]
}
```

**Key terminology**:
- **anchor** — What users scan for (command, shortcut, term)
- **content** — What users need once they find the anchor
- **retrievalDirection** — `"mechanism-to-meaning"` or `"intent-to-mechanism"`

**Character limits** (enforced by schema):
- `title`: 80 chars
- `description`: 150 chars
- `entry.anchor`: 100 chars
- `entry.content`: 150 chars
- `section.title`: 100 chars
- `anchorLabel`, `contentLabel`: 50 chars
- `entry.details`: **UNBOUNDED** (supports progressive disclosure)
