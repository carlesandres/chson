# AGENTS.md

This file provides guidance to AI coding agents working in this repository.

Note: `CLAUDE.md` is a symlink to `AGENTS.md` (intentionally kept that way).

## What Is This Repo?

ChSON is a JSON-based format for software cheatsheets. This repo is a Turborepo monorepo containing:

- **`packages/chson-schema/`** — JSON Schema + auto-generated TypeScript types
- **`packages/chson-registry/`** — Example cheatsheets (source of truth)
- **`packages/chson-cli/`** — Node.js CLI for validation and rendering
- **`apps/web/`** — Next.js 16 website with shadcn/ui and Fumadocs

### Package Dependencies

```
@chson/schema (builds types)
  ├── @chson/cli (validates/renders)
  └── @chson/registry (validates its cheatsheets)
        └── @chson/web (displays cheatsheets)
```

## Commands

```bash
# Install dependencies
npm install

# Build all packages (schema types → cli/registry → site)
npm run build

# Validate all cheatsheets against schema
npm run validate

# Type check all packages
npm run typecheck

# Build specific package
turbo run build --filter=@chson/schema
turbo run build --filter=@chson/web

# Clean build
rm -rf .turbo build packages/chson-schema/types && npm run build
```

### Website Commands (apps/web)

```bash
cd apps/web

npm run dev           # Start dev server
npm run build         # Production build
npm run typecheck     # TypeScript check
npm run lint          # Run oxlint + stylelint
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

### TypeScript/React (apps/web)

- **Single quotes** (configured in `.prettierrc`)
- **2-space indent**
- **No semicolons** at end of statements (Prettier default with config)
- **`moduleResolution: "bundler"`** — Required for Fumadocs. Do NOT change to `"node"`
- **Path aliases**: Use `components/`, `lib/`, `hooks/` etc. (not relative `../`)

**Import order** (blank lines between groups):
```typescript
// 1. React/Next.js
import { useState } from 'react';
import Link from 'next/link';

// 2. Third-party
import { cn } from 'lib/utils';

// 3. Local components/types
import { Button } from 'components/ui/button';
import type { CheatsheetData } from '@chson/schema';
```

**Component structure**:
```typescript
'use client'; // Only if needed

import { cn } from 'lib/utils';

interface ComponentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * JSDoc description for the component.
 */
export function Component({ children, className }: ComponentProps) {
  return (
    <div className={cn('base-classes', className)}>
      {children}
    </div>
  );
}
```

### JavaScript (packages/chson-cli)

- **ES modules**, Node 20+
- **2-space indent**, **double quotes**
- Import order: `node:*` builtins → third-party → local

### JSON (packages/chson-schema, packages/chson-registry)

- **2-space indent**
- Keep key order stable

## Architecture

**Data flow**: `.chson.json` files → CLI validates against schema → CLI renders → site serves pages

### Fumadocs Layouts

- **`HomeLayout`** — For non-docs pages (home, use-cases, cheatsheets)
- **`DocsLayout`** — For documentation pages with sidebar
- **Shared config** — `lib/layout.shared.tsx` provides `baseOptions()` for both layouts
- **`RootProvider`** — Wraps app in root layout, handles theme switching

### Schema Source of Truth

- **File**: `packages/chson-schema/schema/chson.schema.json`
- **Public URL**: `https://chson.dev/api/schema.json`
- **Served by**: `apps/web/app/api/schema.json/route.ts`

## Important Constraints

### Fumadocs Requirements

1. **`moduleResolution: "bundler"`** is required. Do NOT suggest changing to `"node"`.
2. **`defaultMdxComponents`** from `fumadocs-ui/mdx` includes `Callout`, `Card`, `Cards`, `Steps`, `Tab`, `Tabs`. These do NOT need manual imports in MDX.
3. **`.source/`** directory is auto-generated at build time (gitignored).
4. Import from `@/.source/server` not `@/.source`.

### Zod Version

This project uses **Zod 4.x** (not 3.x) for Fumadocs compatibility.

### Testing

- **Vitest** with jsdom environment
- Test files: `**/*.{test,spec}.{ts,tsx}`
- Setup file: `vitest.setup.ts`
- Globals enabled (`describe`, `it`, `expect` available without imports)

## Workflow

**Adding cheatsheets**:
1. Create `packages/chson-registry/cheatsheets/<product>/<name>.chson.json`
2. Include `"$schema": "https://chson.dev/api/schema.json"`
3. Run `npm run validate`
4. Run `npm run build`

**Schema changes**: Keep backwards-compatible.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on PRs and pushes to main:
1. `npm run validate` — Schema validation
2. `npm run typecheck` — TypeScript checking (shared packages)

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

Limits based on cognitive science (working memory ~4 chunks, Cowan 2001) + 2x current max usage analysis.
