# @chson/schema

ChSON JSON Schema and TypeScript type definitions.

## Source of Truth

This package is the **canonical source** for the ChSON JSON Schema:

- **Schema file**: `schema/chson.schema.json`
- **Public URL**: `https://chson.dev/api/schema.json` (served by the web app)
- **Types**: Auto-generated TypeScript definitions in `types/`

## Usage

### In Node.js/CLI tools

```javascript
import schema from "@chson/schema" with { type: "json" };
// schema is the parsed JSON Schema object
```

### In TypeScript

```typescript
import type { ChsonDocument, ChsonSection, ChsonEntry } from "@chson/schema/types";
```

### In .chson.json files

```json
{
  "$schema": "https://chson.dev/api/schema.json",
  "title": "My Cheatsheet",
  ...
}
```

## How the Web App Serves the Schema

The web app at `apps/web` has an API route (`app/api/schema.json/route.ts`) that:

1. Imports the schema from this package: `import schema from "@chson/schema"`
2. Serves it at `https://chson.dev/api/schema.json`
3. Includes caching headers for performance

This architecture ensures there's only one schema file to maintain.

## Structure

- `schema/chson.schema.json` - JSON Schema (Draft 2020-12)
- `types/index.d.ts` - Generated TypeScript types (auto-generated, gitignored)
- `scripts/build-types.js` - Type generation script

## Character Limits

ChSON enforces `maxLength` constraints on text fields based on cognitive science principles and current usage analysis. These limits reduce cognitive load and ensure content remains scannable while allowing flexibility where needed.

| Field | Max Length | Rationale |
|-------|-----------|-----------|
| `title` | 80 | Fits typical editor widths, scannable at a glance |
| `description` | 150 | Brief summary without overwhelming working memory |
| `entry.anchor` | 100 | Commands/shortcuts should be concise |
| `entry.content` | 150 | Descriptive but focused explanations |
| `section.title` | 100 | Section headings should be scannable |
| `anchorLabel` | 50 | Short metadata labels (e.g., "Command", "Shortcut") |
| `contentLabel` | 50 | Short metadata labels (e.g., "Description", "Action") |

**Note**: `entry.details` has **NO maxLength limit** - it supports progressive disclosure for extended explanations (see `research/cognitive-foundations.md`).

These limits are based on:
- Analysis of existing cheatsheets (2x current maximum + buffer)
- Working memory research (Cowan 2001: ~4 chunks)
- Alignment with cognitive science principles documented in the research folder

## Development

Generate TypeScript types from schema:

```bash
npm run build
```

Type-check generated types:

```bash
npm run typecheck
```

The build script uses `json-schema-to-typescript` to generate type definitions.
