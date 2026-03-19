# @chson/registry

[![npm version](https://img.shields.io/npm/v/@chson/registry)](https://www.npmjs.com/package/@chson/registry)
[![license](https://img.shields.io/npm/l/@chson/registry)](https://github.com/carlesandres/chson/blob/main/LICENSE)

Curated collection of [ChSON](https://chson.dev) cheatsheets — structured
JSON data files for developer reference.

This is a **data package**. It contains `.chson.json` files (cheatsheets,
runbooks, checklists, TLDRs, and bookmarks), not executable code.

## Install

```bash
npm install @chson/registry
```

## Usage

### Discover available cheatsheets

The package exports an `index.json` manifest listing all available cheatsheets:

```javascript
import index from "@chson/registry" with { type: "json" };

console.log(index.count);        // 9
console.log(index.cheatsheets);  // [{ product, name, path, title, ... }, ...]
```

Each entry in `index.cheatsheets` contains:

| Field | Description |
|-------|-------------|
| `product` | Product/tool grouping (e.g. `"git"`, `"docker"`) |
| `name` | Cheatsheet name (e.g. `"core"`, `"rebase-tldr"`) |
| `path` | Relative path to the file within the package |
| `title` | Human-readable title |
| `description` | Brief summary (max 150 chars) |
| `version` | Subject matter version (e.g. `"2.x"`) or `null` |
| `publicationDate` | ISO date string |
| `documentType` | `"cheatsheet"`, `"checklist"`, `"runbook"`, `"tldr"`, `"bookmarks"`, or `null` |
| `retrievalDirection` | `"mechanism-to-meaning"` or `"intent-to-mechanism"`, or `null` |
| `tags` | Array of keyword strings |

### Load a cheatsheet

```javascript
import cheatsheet from "@chson/registry/cheatsheets/git/core.chson.json" with { type: "json" };

console.log(cheatsheet.title);    // "Git Essentials"
console.log(cheatsheet.sections); // [{ title, entries: [{ anchor, content }, ...] }, ...]
```

### Resolve a cheatsheet path from the manifest

```javascript
import { createRequire } from "node:module";
import index from "@chson/registry" with { type: "json" };

const require = createRequire(import.meta.url);
const entry = index.cheatsheets.find(c => c.product === "git" && c.name === "core");
const cheatsheet = require(`@chson/registry/${entry.path}`);
```

## Available Cheatsheets

| Product | Name | Type | Title |
|---------|------|------|-------|
| atuin | keybindings | — | Atuin Keybindings |
| devops | release-checklist | checklist | Release Checklist |
| docker | core | — | Docker Essentials |
| git | core | — | Git Essentials |
| git | rebase-tldr | tldr | Git Rebase TLDR |
| kubernetes | pod-troubleshooting-runbook | runbook | Kubernetes Pod Troubleshooting Runbook |
| npm | core | — | npm Essentials |
| vim | core | — | Vim Essentials |
| web | performance-bookmarks | bookmarks | Web Performance Bookmarks |

## Schema

All cheatsheets conform to the [ChSON schema](https://chson.dev/api/schema.json).
For TypeScript types and the JSON Schema itself, see
[`@chson/schema`](https://www.npmjs.com/package/@chson/schema).

## Contributing

See the [repository](https://github.com/carlesandres/chson) for contribution
guidelines.

## License

MIT
