# CSIF — CheatSheet Interchange Format

CSIF is a small JSON-based format for writing software cheatsheets in a consistent,
tool-friendly way.

The goal is simple: make it easy for developers to publish cheatsheets once and then
consume them in many ways — searchable websites, printable pages, study decks, or
personal knowledge bases.

## What’s in a CSIF cheatsheet?

A CSIF file is a single JSON document with:

- top-level metadata (`title`, optional `version`, `publicationDate`, `description`)
- optional `metadata` for custom fields
- a `sections[]` array, each containing `items[]` (the individual cheats)

Files use the extension `.csif.json`.

## Schema

CSIF files validate against the canonical JSON Schema:

- `https://csif.sh/schema/v1/csif.schema.json`

In each cheatsheet, set:

```json
{
  "$schema": "https://csif.sh/schema/v1/csif.schema.json"
}
```

## Quickstart

Install dependencies:

```bash
npm install
```

Validate all cheatsheets in `cheatsheets/`:

```bash
npm run validate
```

Validate a single file:

```bash
node packages/csif-cli/src/csif.js validate cheatsheets/git/core.csif.json
```

Render a single cheatsheet to Markdown (2-column table) to stdout:

```bash
node packages/csif-cli/src/csif.js render markdown cheatsheets/git/core.csif.json
```

Render all cheatsheets into the Docusaurus docs registry:

```bash
npm run render:docs
```

## Registry

Example cheatsheets live under `cheatsheets/` and are rendered into the docs site.

- Example source file: `cheatsheets/git/core.csif.json`
- Generated docs page: `website/docs/registry/git/core.md`

## Documentation site (Docusaurus)

The docs site lives in `website/`.

```bash
cd website
npm install
npm start
```

Then open `http://localhost:3000`.

## Repository layout

- `schema/v1/csif.schema.json` — CSIF JSON Schema
- `cheatsheets/**/**/*.csif.json` — source cheatsheets (registry)
- `packages/csif-cli/` — CLI (`csif`) for validate + render
- `website/` — Docusaurus docs site
- `website/docs/registry/` — generated Markdown pages (do not hand-edit)

## Tooling

This repo currently ships a minimal Node CLI:

- Validate CSIF files using AJV
- Render CSIF to Markdown using 2-column tables (`Cheat` / `Description`)

If you want to build a renderer (PDF, flashcards, etc.), the current schema is intentionally
minimal — the `comments` field can hold any extra structure you need while the standard
stays small.

## Contributing

Contributions are welcome, especially:

- new example cheatsheets under `cheatsheets/`
- improvements to the schema that keep it simple
- renderers and tooling (validation, conversion, indexing)

Before submitting changes:

```bash
npm run validate
npm run render:docs
```

## Status

CSIF is early and evolving. The current focus is:

- a stable minimal schema
- a growing registry of example cheatsheets
- basic tooling (validate + render) to support downstream integrations
