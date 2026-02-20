# Copilot Instructions for ChSON

## Project Overview

ChSON is a JSON-based format for software cheatsheets. This is a Turborepo monorepo containing:

- `packages/chson-schema/` — JSON Schema + auto-generated TypeScript types
- `packages/chson-registry/` — Example cheatsheets (source of truth)
- `packages/chson-cli/` — Node.js CLI for validation and rendering
- `apps/web/` — Next.js 16 website with shadcn/ui and Fumadocs

## Tech Stack & Requirements

### TypeScript Configuration

- **`moduleResolution: "bundler"`** is required for Fumadocs compatibility. Fumadocs uses package.json `exports` fields which require bundler or node16 resolution. Do NOT suggest reverting to `"node"`.

### Fumadocs (Documentation Framework)

- **`defaultMdxComponents` from `fumadocs-ui/mdx`** includes `Callout`, `Card`, `Cards`, `Steps`, `Tab`, `Tabs`, and other components. These do NOT need to be manually imported in MDX files or added to the components object.
- The `.source/` directory is auto-generated at build time and gitignored.
- Import from `@/.source/server` not `@/.source` (no index.ts in generated folder).

### Zod Version

- This project uses **Zod 4.x** (not Zod 3.x). This is intentional to support Fumadocs' peer dependencies.

## Code Review Guidelines

### False Positives to Ignore

1. **moduleResolution changes**: The `"bundler"` setting is required, not a regression.
2. **Missing Callout/Card imports**: These are included in `defaultMdxComponents` from fumadocs-ui.
3. **Empty slug handling in `/docs/[[...slug]]/page.tsx`**: Fumadocs handles empty slugs by looking for `index.mdx`.

### Actual Issues to Flag

1. **Broken internal links**: MDX files should use route paths (e.g., `/docs/foo`) not file paths (e.g., `/docs/foo.mdx`).
2. **Links to non-existent routes**: If a link points to a route that doesn't exist in the app, flag it.
3. **Security issues**: API keys, secrets, or credentials in code.

## Build & Validation

```bash
# Install dependencies
npm install

# Build all packages (schema types → cli/registry → web)
npm run build

# Validate all cheatsheets against schema
npm run validate

# Type check
npm run typecheck
```

## Directory Structure

```
chson/
├── apps/web/                    # Next.js 16 + Fumadocs website
│   ├── app/docs/[[...slug]]/    # Dynamic MDX page route
│   ├── content/docs/            # MDX documentation files
│   └── lib/source.ts            # Fumadocs source loader
├── packages/
│   ├── chson-schema/            # JSON Schema + TypeScript types
│   ├── chson-registry/          # Cheatsheet files
│   └── chson-cli/               # CLI tool
└── research/                    # Cognitive science research (not web routes)
```
