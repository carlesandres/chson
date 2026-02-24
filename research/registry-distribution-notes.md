# ChSON Registry Distribution Notes

This document tracks decisions for distributing ChSON files through shadcn registries, plus open questions to review later.

## Decisions Made

## Distribution Protocol

- Use shadcn registry JSON contracts (`registry.json`, `registry-item.json`) as the transport format.
- Keep ChSON itself unchanged; registry support is a distribution layer.

## Namespace and install target

- Default namespace: `@chson`
- Default install target base: `chson-files`
- Generated registry items install to: `~/chson-files/<product>/<name>.chson.json`

## CLI shape

- Added `chson registry init` in `@chson/cli`.
- Command generates a shadcn-compatible registry source tree:
  - `registry.json`
  - `registry/default/**` copied `.chson.json` files
- Generated item type: `registry:item`
- Generated file type: `registry:file`
- Added optional flags:
  - `--packs by-directory` to emit aggregate pack items via `registryDependencies`
  - `--fail-on-collision` to fail on slug collisions instead of auto-suffixing

## Prototype strategy

- Maintain an in-repo prototype under `examples/chson-shadcn-registry/`.
- Keep external reference prototype at:
  - `https://github.com/carlesandres/chson-files/tree/main/json-registry`

## CI strategy

- CI builds the prototype with `shadcn build` and validates generated payload presence/JSON parsing.
- Goal: catch breakage in registry generation and shadcn compatibility early.

## Open Questions

## 1) Item naming and collisions

Current behavior derives item names from relative file paths (example: `git/core.chson.json` -> `git-core`).

Current guardrail:

- `--fail-on-collision` can now enforce strict naming for CI/publisher workflows.

Questions:

- Should we support explicit item names in source metadata?
- Should strict collision mode become default in a future major version?

## 2) Bundles / packs

Current generator creates one item per file, with optional directory packs.

Current behavior:

- `--packs by-directory` emits pack items (example: `git-pack`) that depend on per-file items.

Questions:

- Should we also support explicit/custom packs (not only inferred by directory)?
- Should we support nested pack composition and top-level starter packs?

## 3) Versioning strategy

Current prototype is unversioned at the item URL level.

Questions:

- Do we support versioned endpoints (`/r/v1/{name}.json`)?
- Do we encode version in item names or rely on deployment routing?

## 4) Private registries

Current docs mention shadcn auth support but ChSON CLI does not scaffold auth config.

Questions:

- Should we add templates/examples for private registries (`headers`, env var placeholders)?

## 5) Rich metadata mapping

Current generator maps title/description and also lifts selected ChSON fields:

- `tags` -> `keywords`
- `documentType` + first path segment -> `categories`
- `publicationDate`, `retrievalDirection`, `version`, `homepage`, `documentType` -> `meta`

Questions:

- Do we want a configurable metadata mapping (field allow/deny list)?

## Review Triggers

Revisit this design when any of the following happen:

- First external community registry asks for naming/version guarantees.
- Need to ship private/commercial registry distribution.
- Need bundles, filtering, or generator config beyond current defaults.
