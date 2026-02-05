# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Note: `CLAUDE.md` is a symlink to `AGENTS.md` (intentionally kept that way).

## What Is This Repo?

ChSON is a JSON-based format for software cheatsheets. This repo contains:
- The JSON Schema (`schema/v1/chson.schema.json`)
- Example cheatsheets (`cheatsheets/**/*.chson.json`)
- A Node.js CLI for validation and rendering (`packages/chson-cli/`)
- An Astro website (`apps/site/`)

## Commands

```bash
# Install dependencies
npm install

# Validate all cheatsheets against schema
npm run validate

# Validate a single file
node packages/chson-cli/src/chson.js validate cheatsheets/git/core.chson.json

# Render cheatsheet to stdout
node packages/chson-cli/src/chson.js render markdown cheatsheets/git/core.chson.json

# Website (Astro)
npm run dev
npm run build
npm run typecheck

# Render registry Markdown into build/ (writes files)
npm run render:build
```

## Architecture

**Data flow**: `.chson.json` files → CLI validates against schema → CLI renders (Markdown or web) → site serves pages

**Key files**:
- `packages/chson-cli/src/chson.js` - Single-file CLI with validate and render commands
- `schema/v1/chson.schema.json` - JSON Schema (Draft 2020-12) defining the ChSON format
- `apps/site/` - Astro website

**ChSON schema structure**:
```
{
  title, version?, publicationDate, description, metadata?,
  sections: [{ title, description?, items: [{ title, description, example?, comments? }] }]
}
```

## Workflow

**Adding cheatsheets**:
1. Create `cheatsheets/<product>/<name>.chson.json`
2. Include `"$schema": "https://chson.dev/schema/v1/chson.schema.json"`
3. Run `npm run validate`
4. Run `npm run render:build` to regenerate Markdown

**Schema changes**: Keep backwards-compatible. New versions go in `schema/v2/`, etc.

## Code Style

**JavaScript** (`packages/chson-cli/`):
- ES modules, Node 20+
- 2-space indent, double quotes
- Import order: `node:*` builtins, then third-party, then local (blank lines between groups)

**JSON** (`schema/`, `cheatsheets/`):
- 2-space indent
- Keep key order stable

**Markdown rendering**:
- The renderer escapes `{`, `}`, `<`, `>` to avoid MDX/JSX parsing issues in MDX-based docs sites
- Verify changes with `npm run build`

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on PRs and pushes to main:
1. `npm run validate` - schema validation
2. `npm run build` - website build
