# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Note: `CLAUDE.md` is a symlink to `AGENTS.md` (intentionally kept that way).

## What Is This Repo?

CSIF (CheatSheet Interchange Format) is a JSON-based format for software cheatsheets. This repo contains:
- The JSON Schema (`schema/v1/csif.schema.json`)
- Example cheatsheets (`cheatsheets/**/*.csif.json`)
- A Node.js CLI for validation and rendering (`packages/csif-cli/`)
- A Docusaurus documentation site (`website/`)

## Commands

```bash
# Install dependencies
npm install

# Validate all cheatsheets against schema
npm run validate

# Validate a single file
node packages/csif-cli/src/csif.js validate cheatsheets/git/core.csif.json

# Render cheatsheet to stdout
node packages/csif-cli/src/csif.js render markdown cheatsheets/git/core.csif.json

# Render all cheatsheets to docs
npm run render:docs

# Docs site (in website/)
cd website && npm install
cd website && npm start       # dev server
cd website && npm run build   # production build
cd website && npm run typecheck
```

## Architecture

**Data flow**: `.csif.json` files → CLI validates against schema → CLI renders to Markdown → Docusaurus serves docs

**Key files**:
- `packages/csif-cli/src/csif.js` - Single-file CLI with validate and render commands
- `schema/v1/csif.schema.json` - JSON Schema (Draft 2020-12) defining the CSIF format
- `website/docs/registry/` - Generated Markdown (do not hand-edit; regenerate with `npm run render:docs`)

**CSIF schema structure**:
```
{
  title, version?, publicationDate, description, metadata?,
  sections: [{ title, description?, items: [{ title, description, example?, comments? }] }]
}
```

## Workflow

**Adding cheatsheets**:
1. Create `cheatsheets/<product>/<name>.csif.json`
2. Include `"$schema": "https://csif.sh/schema/v1/csif.schema.json"`
3. Run `npm run validate`
4. Run `npm run render:docs` to regenerate Markdown

**Schema changes**: Keep backwards-compatible. New versions go in `schema/v2/`, etc.

## Code Style

**JavaScript** (`packages/csif-cli/`):
- ES modules, Node 20+
- 2-space indent, double quotes
- Import order: `node:*` builtins, then third-party, then local (blank lines between groups)

**JSON** (`schema/`, `cheatsheets/`):
- 2-space indent
- Keep key order stable

**Markdown rendering**:
- Docusaurus treats `.md` as MDX
- The renderer escapes `{`, `}`, `<`, `>` to avoid MDX/JSX parsing issues
- Verify changes with `cd website && npm run build`

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on PRs and pushes to main:
1. `npm run validate` - schema validation
2. `npm run render:docs` - smoke test rendering
