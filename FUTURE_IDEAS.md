# CSIF Future Ideas (Backlog)

This file is intentionally a dumping ground for ideas we may add to CSIF later.
The current goal is: **keep CSIF simple**, but capture future directions so we
can iterate without losing context.

## Decisions Made So Far

- **Name**: CheatSheet Interchange Format (**CSIF**)
- **Canonical home (assumed)**: `csif.sh`
- **Schema URL**: `https://csif.sh/schema/v1/csif.schema.json`
- **JSON Schema dialect**: Draft 2020-12
- **Document schema pointer**: CSIF documents include a `$schema` field pointing to the canonical schema URL.
- **Core structure**:
  - Top-level: `title`, optional `version`, `publicationDate`, `description`, `metadata`, `sections`
  - Section: `title`, optional `description`, `items`
  - Item: `title`, `description`, optional `comments`
- **Keep flexibility**: allow unknown fields (`additionalProperties: true`) everywhere.
- **Dates**: `publicationDate` accepts either `date` or `date-time`.
- **Registry file extension**: use `.csif.json`.
- **First renderer target**: 2-column Markdown tables (`Cheat` / `Description`).

## Postponed / Future Additions

### 1) Explicit CSIF format version

Even if the schema URL implies `v1`, we may want an explicit field such as:

- `csif: "1"`
- or `formatVersion: "1"`

Rationale: helps tools interpret documents if/when CSIF evolves beyond additive changes.

### 2) Stable identifiers

Potential additions:

- Top-level `id` (URI, slug, or any stable identifier)
- `id` for sections and items

Rationale: enables deep links, deduplication, diffing, sync, and references.

### 3) Standard extension mechanism

We currently use free-form `metadata` and `comments`, but we may later define an
extension convention such as:

- `x-...` fields (OpenAPI-style)
- `_...` fields (JSON Feed-style)

Rationale: avoids collisions and clarifies what consumers should ignore.

### 4) Item typing (keyboard shortcuts vs commands vs config)

Introduce `item.type` and a `oneOf` schema per type, e.g.:

- `shortcut`
- `command`
- `config`

Rationale: makes rendering and conversion (web/PDF/flashcards) reliable without heuristics.

### 5) Rich text conventions

Decide whether `description` fields are:

- plain text only
- or CommonMark Markdown (like OpenAPI/AsyncAPI)

Rationale: consistent rendering and security expectations.

### 6) Tags and search metadata

Possible fields:

- `tags` at sheet/section/item
- `aliases` / `keywords`

Rationale: better filtering and search UX for websites and personal databases.

### 7) Applicability / context

Cheats often depend on:

- OS (`macOS`, `Windows`, `Linux`)
- shell (`bash`, `zsh`, `powershell`, `fish`)
- environment (`docker`, `k8s`, `ci`)
- product/version ranges

Possible addition:

- `appliesTo` at item/section

### 8) Examples and outputs

For commands and configs, tools may want:

- `examples` arrays
- `output` samples
- `language` / `syntax` hints

Rationale: reliable code formatting + flashcard generation.

### 9) Safety / risk annotations

Optional structure for destructive actions, e.g.:

- `dangerLevel`
- `warnings`
- `requiresAdmin`

Rationale: enables consumers to highlight risky cheats.

### 10) Attribution and licensing

Potential additions:

- `license` (SPDX identifier)
- `authors` / `contributors`
- `sourceUrl`

Rationale: easier sharing/reuse in the community.

### 11) Localization

Potential additions:

- `language` (BCP 47 tag like `en`, `en-GB`)
- translation strategy (later)

Rationale: international/community adoption.

## Non-Goals (For Now)

- Perfectly typed/validated per-cheat structures.
- References between cheatsheets.
- Multi-file splitting/merging mechanisms.
