# ADR 001: Layer Boundaries

**Status:** Accepted  
**Date:** 2026-07-06

## Context

ChSON grew into a monorepo that ships a JSON format, CLI, registry, React renderers,
and a reference website. Without explicit boundaries, scope crept across layers —
documentation drifted from the schema, renderers showed `details` inline instead of
using progressive disclosure, and `@chson/ui` accumulated a full shadcn component kit.

## Decision

Organize the project into three layers with fixed responsibilities.

### Layer 1 — Format (`@chson/schema`)

**Owns:** the ChSON document model and validation rules.

**v1 core (frozen):**

```text
Document
  title, publicationDate, description, sections[]
  optional: version, documentType, retrievalDirection,
            anchorLabel, contentLabel, formatHints, metadata, tags, …
  Section
    title, entries[]
    optional: description
  Entry
    anchor, content
    optional: details, url
```

**Principles:**

- Character limits on scannable fields; `details` is unbounded.
- `documentType` is a rendering profile, not a separate schema shape.
- `additionalProperties: true` allows experimentation; v1 standard fields stay stable.
- Custom data goes in `metadata`, not new top-level fields without an ADR.

**Deferred to v2:** stable IDs, format version field, nested sections, item typing,
document composition inside a single file, localization.

### Layer 2 — Tooling and renderers

| Package | Owns |
|---------|------|
| `@chson/cli` | Validate `.chson.json`; render cheatsheets to Markdown tables; registry scaffolding |
| `@chson/ui/core` | Headless helpers: normalization, format inference, checklist math, URL safety |
| `@chson/ui` | React renderers, primitives, hooks for ChSON consumption |
| `@chson/registry` | Example `.chson.json` files and distribution index |

**Renderer contract:**

- `details` renders behind progressive disclosure (collapsed by default).
- `url` renders as an unobtrusive external link.
- `documentType` selects the renderer; all types share the same entry shape.
- Bookmarks treat `content` as the URL and `details` as the visible description on cards.

**`@chson/ui` does not own:** site chrome, auth, routing, SEO, or a general-purpose
component library. shadcn primitives exist only as internal building blocks for
ChSON renderers (and minimal shared use by the reference app via `@chson/ui/shadcn/*`).

**CLI scope:** Markdown table output for cheatsheet-style documents only. Full
parity with React renderers is not a v1 goal.

### Layer 3 — Applications (`@chson/web`)

**Owns:** reference website, Fumadocs documentation, registry browser, app-specific
glue (localStorage scope keys, navigation, marketing pages).

**Does not own:** format semantics or reusable renderer logic — those live in Layer 2.

## Consequences

- Schema changes require ADR review if they affect v1 core fields.
- New UI features for ChSON content belong in `@chson/ui` first; the web app composes them.
- Removing unused shadcn components and duplicate app dependencies is encouraged.
- `examples/chson-shadcn-registry` should derive from `@chson/registry`, not duplicate it.

## Out of scope for v1

- Nested sections or entry groups in the schema.
- CLI renderers for checklist, runbook, bookmarks, or tldr.
- Publishing the full shadcn kit as a product surface of `@chson/ui`.