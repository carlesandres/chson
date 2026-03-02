# ChSON Schema API Endpoint

This directory contains a Next.js API route that serves the canonical ChSON JSON Schema.

## Architecture

- **Source of Truth**: `packages/chson-schema/schema/chson.schema.json`
- **Public URL**: `https://chson.dev/api/schema.json`
- **Package**: `@chson/schema`

## How It Works

1. The `@chson/schema` package exports the JSON Schema file
2. This API route imports it and serves it with caching headers
3. Turborepo ensures the schema package builds before the web app
4. Changes to the schema automatically propagate through the build system

## Making Schema Changes

To update the schema:

1. Edit `packages/chson-schema/schema/chson.schema.json`
2. Run `npm run build` from the root to regenerate TypeScript types
3. The web app will automatically serve the updated schema on next build

## IDE Support

All `.chson.json` files reference this schema via the `$schema` field:

```json
{
  "$schema": "https://chson.dev/api/schema.json",
  ...
}
```

This enables validation and autocomplete in VS Code and other IDEs.
