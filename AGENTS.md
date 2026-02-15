# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Note: `CLAUDE.md` is a symlink to `AGENTS.md` (intentionally kept that way).

## What Is This Repo?

ChSON is a JSON-based format for software cheatsheets. This repo is a Turborepo monorepo containing:

- **`packages/chson-schema/`** — JSON Schema + auto-generated TypeScript types
- **`packages/chson-registry/`** — Example cheatsheets (source of truth)
- **`packages/chson-cli/`** — Node.js CLI for validation and rendering
- **`apps/site/`** — Astro website

### Package Dependencies

```
@chson/schema (builds types)
  ├── @chson/cli (validates/renders)
  └── @chson/registry (validates its cheatsheets)
        └── @chson/site (displays cheatsheets)
```

Turborepo automatically builds packages in the correct order based on workspace dependencies.

## Commands

```bash
# Install dependencies
npm install

# Build all packages (schema types → cli/registry → site)
npm run build

# Validate all cheatsheets against schema
npm run validate

# Validate a single file
node packages/chson-cli/src/chson.js validate packages/chson-registry/cheatsheets/git/core.chson.json

# Render cheatsheet to stdout
node packages/chson-cli/src/chson.js render markdown packages/chson-registry/cheatsheets/git/core.chson.json

# Website (Astro)
npm run dev
npm run build
npm run typecheck

# Render registry Markdown into build/ (writes files)
npm run render:build

# Build specific package
turbo run build --filter=@chson/schema
turbo run build --filter=@chson/site

# Clean build
rm -rf .turbo build packages/chson-schema/types && npm run build
```

## Architecture

**Data flow**: `.chson.json` files → CLI validates against schema → CLI renders (Markdown or web) → site serves pages

**Key files**:
- `packages/chson-cli/src/chson.js` - Single-file CLI with validate and render commands
- `packages/chson-schema/schema/v2/chson.schema.json` - JSON Schema (Draft 2020-12) defining the ChSON v2 format
- `packages/chson-schema/schema/v1/chson.schema.json` - Legacy v1 schema (still supported)
- `packages/chson-schema/types/` - Auto-generated TypeScript types (gitignored)
- `packages/chson-registry/cheatsheets/` - Source cheatsheets
- `apps/site/` - Astro website
- `research/` - Cognitive science research supporting ChSON design

**ChSON v2 schema structure** (based on cognitive retrieval theory):
```
{
  title, version?, publicationDate, description, retrievalDirection?, metadata?,
  anchorLabel?, contentLabel?,
  sections: [{ title, description?, entries: [{ anchor, content, label?, comments? }] }]
}
```

Key terminology (see `research/cognitive-foundations.md`):
- **anchor**: The retrieval anchor — what users scan for (command, shortcut, term)
- **content**: The associated content — what users need once they find the anchor
- **label**: Optional human-readable label when the anchor is cryptic (e.g., `gg` → "Go to start")
- **retrievalDirection**: `"mechanism-to-meaning"` (scan by command) or `"intent-to-mechanism"` (scan by action)
- **anchorLabel**: Custom display name for anchor column (e.g., "Example", "Shortcut")
- **contentLabel**: Custom display name for content column (e.g., "Description", "Action")

## Workflow

**Adding cheatsheets**:
1. Create `packages/chson-registry/cheatsheets/<product>/<name>.chson.json`
2. Include `"$schema": "https://chson.dev/schema/v2/chson.schema.json"`
3. Run `npm run validate`
4. Run `npm run build` to rebuild the site

**Schema changes**: Keep backwards-compatible. New versions go in `schema/v2/`, etc.

## Code Style

**JavaScript** (`packages/chson-cli/`):
- ES modules, Node 20+
- 2-space indent, double quotes
- Import order: `node:*` builtins, then third-party, then local (blank lines between groups)

**JSON** (`packages/chson-schema/`, `packages/chson-registry/`):
- 2-space indent
- Keep key order stable

**Markdown rendering**:
- The renderer escapes `{`, `}`, `<`, `>` to avoid MDX/JSX parsing issues in MDX-based docs sites
- Verify changes with `npm run build`

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on PRs and pushes to main:
1. `npm run validate` - schema validation (via Turborepo)
2. `npm run build` - all packages build (via Turborepo)
3. `npm run typecheck` - TypeScript checking
