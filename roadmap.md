# ChSON Roadmap

## Vision

ChSON is a small, durable JSON format for structured knowledge fragments — cheatsheets,
checklists, runbooks, and similar content — with progressive disclosure built in. The
monorepo ships the format, validation tooling, example registry, reusable renderers,
and a reference web app. The format stays minimal; everything else is a distribution
layer around it.

## Current Status

The monorepo ships a working schema, CLI, registry, `@chson/ui` renderers, and
website. Organic growth has blurred boundaries between the format, the component
library, and the demo app. Documentation and the schema have drifted apart. The
project is pausing feature work to reset architecture before launch.

## Phases

### Phase 1 — Architecture Reset (current)

Goal: establish clear layer boundaries, fix inconsistencies, and align implementation
with the cognitive model before adding features or publishing.

**Tasks (in order):**

1. **Audit and fix doc/schema inconsistencies** — align README, docs, and schema;
   resolve doc/schema drift; standardize bookmarks conventions.
2. **Draft layer-boundary ADR** — document what belongs in the format, renderers,
   and apps; freeze the v1 core; defer nesting, IDs, and item typing to v2.
3. **Implement progressive disclosure in renderers** — `details` should collapse/expand,
   not render as always-visible secondary text.
4. **Refactor `@chson/ui`** — extract hooks (e.g. checklist persistence) into the
   package; stop scope creep from the vendored shadcn surface.

Definition of done:

- Schema, docs, and examples tell the same story.
- An ADR defines package boundaries and what is explicitly out of scope for v1.
- Renderers match the progressive-disclosure design.
- `@chson/ui` exports ChSON-specific code; app glue stays in `apps/web`.

### Phase 2 — Launch Readiness

Goal: make the project publicly usable, testable, and indexable.

- Remove temporary no-index protections before launch (issue #45).
- Test CLI and web renderer end to end (issues #54, #55).
- Make the CLI installable and publish to npm (issues #38, #39).
- Ensure the website serves the canonical schema without drift (issue #18).
- Improve npm package presentation (issue #61).
- Tighten the registry experience (issue #56).

### Phase 3 — Format Stability (v2 planning)

Goal: resolve high-impact schema questions without bloating the v1 core.

- Unique anchors, stable IDs, format version, composition (issues #49, #62, #34).
- Presentation hints and provenance fields (issues #40, #59).
- Item typing, extension conventions, localization.
  Source: `FUTURE_IDEAS.md`.

### Phase 4 — Registry Distribution

Goal: predictable, versionable registries for maintainers and consumers.

Source: `research/registry-improvements-plan.md`, `research/registry-distribution-notes.md`.

### Phase 5 — Consumption Experience

Goal: polished rendering across surfaces — mobile, a11y, search, validation UI.

Source: issues #58, #33, #27.

### Phase 6 — Documentation and Adoption

Goal: explain the cognitive model and grow the example registry.

Source: `research/cognitive-foundations.md`, issue #50.

## Product Principles

- Keep the core schema small and cognitively parseable.
- Stability before richness.
- Treat registry and website as distribution layers, not the format itself.
- Cognitive ergonomics are a product constraint, not just a research note.

## Out of Scope (v1)

- Nested sections or entry groups inside a single document.
- Document composition in the schema (use registries instead).
- Full shadcn component library as part of `@chson/ui`.
- CLI render parity with all React document-type renderers.

## Parking Lot

Ideas captured elsewhere but not scheduled: private registries, safety annotations,
prompt/model provenance, Fumadocs embedding module, advanced export formats.

## Completed Foundations

- Schema, CLI, registry, UI package, and Next.js website.
- Five document-type renderers (cheatsheet, checklist, runbook, tldr, bookmarks).
- Cognitive-science research docs and Fumadocs documentation site.
- Vercel deployment, Vitest/Oxlint tooling in `apps/web`.
- Legacy Docusaurus removal, dependency audit fixes (issues #9–#12).