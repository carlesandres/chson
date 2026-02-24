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

Questions:

- Should we support explicit item names in source metadata?
- Should the generator fail on collisions instead of suffixing (`-2`, `-3`)?

## 2) Bundles / packs

Current generator creates one item per file.

Questions:

- Should we generate optional pack items (example: `starter-pack`) using `registryDependencies`?
- If yes, should packs be inferred by directory, tags, or explicit config?

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

Current generator maps title/description directly and copies the file.

Questions:

- Should we surface ChSON fields (`tags`, `publicationDate`, `retrievalDirection`) into `meta`/`categories` in registry items?

## Review Triggers

Revisit this design when any of the following happen:

- First external community registry asks for naming/version guarantees.
- Need to ship private/commercial registry distribution.
- Need bundles, filtering, or generator config beyond current defaults.
