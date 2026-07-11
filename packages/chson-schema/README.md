# @chson/schema

[![npm version](https://img.shields.io/npm/v/@chson/schema)](https://www.npmjs.com/package/@chson/schema)
[![license](https://img.shields.io/npm/l/@chson/schema)](https://github.com/carlesandres/chson/blob/main/LICENSE)

[ChSON](https://chson.dev) JSON Schema and TypeScript type definitions.

This is the **canonical source** for the ChSON format specification. It
provides the JSON Schema for validation and auto-generated TypeScript types
for type-safe consumption.

## Install

```bash
npm install @chson/schema
```

## Usage

### Validate ChSON files (Node.js)

```javascript
import schema from "@chson/schema" with { type: "json" };

// Use with any JSON Schema validator (e.g. Ajv)
import Ajv from "ajv/dist/2020.js";
const ajv = new Ajv();
const validate = ajv.compile(schema);

const isValid = validate(myCheatsheet);
```

### TypeScript types

```typescript
import type { ChsonDocument, ChsonSection, ChsonEntry } from "@chson/schema/types";

const doc: ChsonDocument = {
  title: "Git Essentials",
  publicationDate: "2026-01-16",
  description: "Essential git commands for day-to-day development.",
  sections: [
    {
      title: "Basics",
      entries: [
        { anchor: "git status", content: "Show staged, unstaged, and untracked files." }
      ]
    }
  ]
};
```

### IDE support in `.chson.json` files

Add the `$schema` field to get autocompletion and validation in VS Code and
other editors:

```json
{
  "$schema": "https://chson.dev/api/schema.json",
  "title": "My Cheatsheet",
  "publicationDate": "2026-01-01",
  "description": "A short description.",
  "sections": []
}
```

## What's Included

| Export | Path | Description |
|--------|------|-------------|
| Default | `@chson/schema` | The JSON Schema object (Draft 2020-12) |
| Types | `@chson/schema/types` | TypeScript type definitions |
| Schema file | `@chson/schema/chson.schema.json` | Direct schema file import |

## Character Limits

ChSON enforces `maxLength` constraints on text fields based on cognitive
science principles (Cowan 2001) and usage analysis:

| Field | Max Length | Rationale |
|-------|-----------|-----------|
| `title` | 80 | Fits typical editor widths |
| `description` | 150 | Brief summary |
| `entry.anchor` | 100 | Commands/shortcuts should be concise |
| `entry.content` | 150 | Focused explanations |
| `section.title` | 100 | Scannable headings |
| `anchorLabel` | 50 | Short metadata labels |
| `contentLabel` | 50 | Short metadata labels |

`entry.details` has **no limit** — it supports progressive disclosure for
extended explanations, warnings, and caveats. The field is always markdown
(GitHub-Flavored Markdown in `@chson/ui`).

### Migration: `entry.comments` (removed from documented v1)

Older drafts mentioned an entry `comments` field. It is **not** part of the
documented entry properties. Files that still include `comments` continue to
**validate** (`additionalProperties` on entries), but official renderers do
**not** display it. Move human-facing notes into `details` (or `content`).

## Related Packages

- [`@chson/cli`](https://www.npmjs.com/package/@chson/cli) — CLI for
  validating and rendering ChSON files
- [`@chson/registry`](https://www.npmjs.com/package/@chson/registry) — Curated
  collection of ChSON cheatsheets

## License

MIT
