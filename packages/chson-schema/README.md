# @chson/schema

ChSON JSON Schema and auto-generated TypeScript type definitions.

## Usage

### Import Schema (JSON)

```typescript
import schemaV1 from "@chson/schema/v1" with { type: "json" };
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

- `schema/v1/chson.schema.json` - JSON Schema (Draft 2020-12)
- `types/index.d.ts` - Generated TypeScript types (auto-generated, gitignored)
- `scripts/build-types.js` - Type generation script
