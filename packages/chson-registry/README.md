# @chson/registry

ChSON cheatsheet registry - source of truth for example cheatsheets.

## Structure

```
cheatsheets/
├── <product>/
│   └── <name>.chson.json
```

Each cheatsheet validates against `@chson/schema/v2`.

## Available Tasks

- `npm run validate` - Validate all cheatsheets
- `npm run render` - Render to stdout (for testing)
- `npm run render:build` - Render all to `build/registry-md/`

## Adding Cheatsheets

1. Create `cheatsheets/<product>/<name>.chson.json`
2. Include `"$schema": "https://chson.dev/schema/v2/chson.schema.json"` for IDE support
3. Run `npm run validate` to ensure it's valid
