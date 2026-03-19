# @chson/cli

[![npm version](https://img.shields.io/npm/v/@chson/cli)](https://www.npmjs.com/package/@chson/cli)
[![license](https://img.shields.io/npm/l/@chson/cli)](https://github.com/carlesandres/chson/blob/main/LICENSE)

CLI for validating, rendering, and distributing
[ChSON](https://chson.dev) cheatsheet files.

## Install

```bash
npm install -g @chson/cli
```

Or run directly with npx:

```bash
npx @chson/cli --help
```

## Requirements

- Node.js 20+

## Commands

### `chson validate`

Validate `.chson.json` files against the ChSON schema. Accepts files or
directories (scans recursively for `*.chson.json`).

```bash
# Validate a single file
chson validate path/to/file.chson.json

# Validate all cheatsheets in a directory
chson validate cheatsheets/
```

Exits with code 1 if any file fails validation.

### `chson render markdown`

Render cheatsheets as Markdown tables. Outputs to stdout by default.

```bash
# Render to stdout
chson render markdown path/to/file.chson.json

# Render all files in a directory to an output folder
chson render markdown cheatsheets/ --out build/markdown/
```

**Options:**

| Flag | Description |
|------|-------------|
| `--out <dir>` | Write rendered Markdown files to a directory |

### `chson registry init`

Generate a [shadcn](https://ui.shadcn.com/)-compatible registry source tree
from ChSON files.

```bash
chson registry init cheatsheets/ --out registry/
```

**Options:**

| Flag | Description |
|------|-------------|
| `--out <dir>` | Output directory for the registry tree |
| `--target-base <dir>` | Base directory for component targets |
| `--namespace <name>` | Registry namespace |
| `--homepage <url>` | Homepage URL for registry metadata |
| `--packs <mode>` | Pack generation mode: `none` (default), `by-directory` |
| `--fail-on-collision` | Exit with error if slugs collide |

## Project Usage

Add to a project as a dev dependency:

```bash
npm install --save-dev @chson/cli
```

Then add scripts to `package.json`:

```json
{
  "scripts": {
    "validate": "chson validate cheatsheets/",
    "render": "chson render markdown cheatsheets/"
  }
}
```

## Related Packages

- [`@chson/schema`](https://www.npmjs.com/package/@chson/schema) — JSON Schema
  and TypeScript types
- [`@chson/registry`](https://www.npmjs.com/package/@chson/registry) — Curated
  collection of ChSON cheatsheets

## License

MIT
