# AGENTS.md — CSIF repo guidance

This repository hosts the **CheatSheet Interchange Format (CSIF)** JSON Schema,
example/registry cheatsheets (`.csif.json`), a small Node.js CLI, and a Docusaurus
documentation site.

There are **no Cursor rules** (`.cursor/rules/`, `.cursorrules`) and **no Copilot
instructions** (`.github/copilot-instructions.md`) in this repo.

## Repository Layout

- `schema/v1/csif.schema.json` — CSIF JSON Schema (Draft 2020-12)
- `cheatsheets/**/**/*.csif.json` — cheatsheet registry (source data)
- `packages/csif-cli/` — `csif` CLI (validate + render)
- `website/` — Docusaurus documentation site
- `website/docs/registry/` — generated Markdown pages from `cheatsheets/`
- `build/` — generated artifacts (gitignored)

## Build / Lint / Test

This repo currently has **no unit tests** and **no linter/formatter config**.
Validation is done by schema validation and basic “smoke runs”.

### Root (schema + registry + CLI)

Install deps:
- `npm install`

Run the equivalent of “tests” (CI does this):
- `npm run validate` (validate all registry files)
- `npm run render:docs` (render registry Markdown into Docusaurus docs)

Run a “single test” (validate one cheatsheet file):
- `node packages/csif-cli/src/csif.js validate cheatsheets/git/core.csif.json`

Render a “single test” (render one cheatsheet to stdout):
- `node packages/csif-cli/src/csif.js render markdown cheatsheets/git/core.csif.json`

Render all registry docs (writes files):
- `npm run render:docs`

### Docs site (Docusaurus)

Install docs deps:
- `cd website && npm install`

Run dev server:
- `cd website && npm start`

Build site:
- `cd website && npm run build`

Typecheck (useful “single test” analogue for the website):
- `cd website && npm run typecheck`

## CI

GitHub Actions workflow:
- `.github/workflows/ci.yml`

Current CI steps:
- install deps
- validate `.csif.json` files against schema
- render Markdown docs as a smoke test

## Workflow Conventions

### Registry workflow

- Add new cheatsheets under `cheatsheets/<product>/<name>.csif.json`.
- Always validate after changes: `npm run validate`.
- Do not hand-edit generated docs in `website/docs/registry/`.
  - Regenerate instead: `npm run render:docs`.

### Schema workflow

- `schema/v1/csif.schema.json` is the source of truth for validation.
- Keep schema changes **backwards-compatible** unless intentionally bumping to a
  new version directory (`schema/v2/`, etc.).

## Code Style Guidelines

### General

- Keep changes minimal and scoped to CSIF schema/tooling/docs.
- Avoid adding new build systems unless necessary.
- Prefer deterministic outputs (stable ordering, stable filenames).

### JavaScript / Node (CLI)

Applies primarily to: `packages/csif-cli/src/csif.js`.

- Use **ES modules** (`"type": "module"` is set).
- Node version: target **Node 20+** (matches `website/package.json` engines).
- Imports:
  - Node built-ins first (`node:*`), then third-party, then local imports.
  - Keep import groups separated by a blank line.
- Formatting:
  - 2-space indentation.
  - Use double quotes for strings (match current code).
- Error handling:
  - Prefer user-friendly error messages (include the file path).
  - Use non-zero exit codes for failures.
  - Avoid noisy stack traces unless debugging.
- IO:
  - Read files as UTF-8.
  - When writing generated content, ensure destination directories exist.

### JSON

Applies to: `schema/**`, `cheatsheets/**`, `package.json` files.

- Use 2-space indentation.
- Keep keys stable (avoid unrelated reordering).
- Cheatsheets must include `$schema`: `https://csif.sh/schema/v1/csif.schema.json`.
- Cheatsheet filenames must end in `.csif.json`.

### Markdown / Docs

- Docusaurus docs live in `website/docs/`.
- Registry pages are generated into `website/docs/registry/`.
  - Prefer changes in the source `.csif.json` + renderer, not manual edits.
  - **MDX safety**: Docusaurus treats `*.md` as MDX, so generated content must not include unescaped JSX-like tokens.
    - Escape `{` and `}` to avoid MDX expressions.
    - Escape `<` and `>` to avoid placeholders like `<sha>` being parsed as JSX.
    - When changing the renderer, verify with `cd website && npm run build`.
- Use short, descriptive headings; avoid overly long pages.
- Use fenced code blocks for commands (` ```bash `).

### TypeScript / React (Docusaurus site)

- Run `cd website && npm run typecheck` after touching `.ts`/`.tsx`.
- Follow existing Docusaurus scaffold patterns; avoid heavy refactors.

## Naming Conventions

- Files/dirs: prefer `kebab-case`.
- Cheatsheets: `cheatsheets/<product>/<name>.csif.json`.
- Schema versions: `schema/vN/`.

## Suggested Next Enhancements (Optional)

- Add a proper renderer pipeline to generate `website/docs/registry/` during the
  docs build.
- Add prettier/markdownlint once the project stabilizes.
- Add more sample cheatsheets and a registry index page.
