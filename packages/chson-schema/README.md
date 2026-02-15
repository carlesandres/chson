# @chson/schema

ChSON JSON Schema and auto-generated TypeScript type definitions.

## Usage

### Import Schema (JSON)

```typescript
import schemaV2 from "@chson/schema/v2" with { type: "json" };
```

### Import TypeScript Types

```typescript
import type { ChsonCheatsheet } from "@chson/schema/types";
```

## Development

Generate TypeScript types from schema:

```bash
npm run build
```

## Structure

- `schema/v2/chson.schema.json` - JSON Schema (Draft 2020-12) - current version
- `types/index.d.ts` - Generated TypeScript types (auto-generated, gitignored)
- `scripts/build-types.js` - Type generation script
