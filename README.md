# ChSON — Cheatsheet JSON Format

ChSON is a small JSON-based format for writing software cheatsheets in a consistent,
tool-friendly way.

The goal is simple: make it easy for developers to publish cheatsheets once and then
consume them in many ways — searchable websites, printable pages, study decks, or
personal knowledge bases.

## What’s in a ChSON cheatsheet?

A ChSON file is a single JSON document with:

- top-level metadata (`title`, optional `version`, `publicationDate`, `description`)
- optional `metadata` for custom fields
- a `sections[]` array, each containing `items[]` (the individual cheats)

Files use the extension `.chson.json`.

## Schema

ChSON files validate against the canonical JSON Schema:

- `https://chson.dev/schema/v1/chson.schema.json`

In each cheatsheet, set:

  ```json
  {
  "$schema": "https://chson.dev/schema/v1/chson.schema.json"
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
node packages/chson-cli/src/chson.js validate cheatsheets/git/core.chson.json
```

Render a single cheatsheet to Markdown (2-column table) to stdout:

```bash
node packages/chson-cli/src/chson.js render markdown cheatsheets/git/core.chson.json
```

Render all cheatsheets into a directory of Markdown pages:

```bash
npm run render:build
```

## Registry

Example cheatsheets live under `cheatsheets/` and are showcased in the Astro website.

- Example source file: `cheatsheets/git/core.chson.json`
- Website page: `apps/site/src/pages/cheatsheets/[product]/[name].astro`

Generated output:

- `build/registry-md/` (gitignored)

## Website

The website lives in `apps/site/` (Astro).

```bash
npm install
npm run dev
```

## Repository layout

- `schema/v1/chson.schema.json` — ChSON JSON Schema
- `cheatsheets/**/**/*.chson.json` — source cheatsheets (registry)
- `packages/chson-cli/` — CLI (`chson`) for validate + render
- `apps/site/` — Astro website

## Tooling

This repo currently ships a minimal Node CLI:

- Validate ChSON files using AJV
- Render ChSON to Markdown using 2-column tables (`Cheat` / `Description`)

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
npm run render:build
```

## Status

ChSON is early and evolving. The current focus is:

- a stable minimal schema
- a growing registry of example cheatsheets
- basic tooling (validate + render) to support downstream integrations
