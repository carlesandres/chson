# ChSON Roadmap

## Vision

ChSON is a small, durable JSON format for structured knowledge fragments — cheatsheets,
checklists, runbooks, and similar content — with progressive disclosure built in. The
monorepo ships the format, validation tooling, example registry, reusable renderers,
and a reference web app. The format stays minimal; everything else is a distribution
layer around it.

## Current Status

The monorepo ships a working schema, CLI, registry, `@chson/ui` renderers, and
website. **Phase 1 architecture reset is complete** for its scoped definition of done
(docs/schema alignment, layer ADR, progressive disclosure, shared checklist state,
app dep cleanup). **Deferred from Phase 1:** trimming unused shadcn components inside
`@chson/ui` ([#73](https://github.com/carlesandres/chson/issues/73) — not required to
call Phase 1 done).

## Phases

### Phase 1 — Architecture Reset (complete for scoped DoD)

Goal: establish clear layer boundaries, fix inconsistencies, and align implementation
with the cognitive model before adding features or publishing.

**Tasks:**

1. ~~**Audit and fix doc/schema inconsistencies**~~ — done (`comments` removed; docs aligned).
2. ~~**Draft layer-boundary ADR**~~ — `docs/adr/001-layers.md`.
3. ~~**Implement progressive disclosure in renderers**~~ — cheatsheet: third-column
   **More** popover (`EntryMorePopover`); checklist / tldr / runbook: inline
   `EntryDetails`; bookmarks: always-visible card `details`. `details` is always
   markdown (Streamdown / GFM in `@chson/ui`).
4. ~~**Shared checklist state + app dep cleanup**~~ — `useChecklistState` in
   `@chson/ui`; `apps/web` no longer duplicates Radix/UI deps (uses
   `@chson/ui/shadcn/*`).
5. **Follow-up (not Phase 1 blocking):** trim unused shadcn components inside
   `@chson/ui` — [#73](https://github.com/carlesandres/chson/issues/73).

**Definition of done (Phase 1):**

- [x] Schema, docs, and examples tell the same story.
- [x] An ADR defines package boundaries and what is explicitly out of scope for v1.
- [x] Renderers match the progressive-disclosure design (including bookmarks exception).
- [x] Reusable checklist persistence lives in `@chson/ui`; app glue stays in `apps/web`.
- [ ] Full shadcn surface reduced to ChSON-only needs — **deferred** ([#73](https://github.com/carlesandres/chson/issues/73)).

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

Source: issues #58, #33, #27. Includes revisiting progressive-disclosure UX on
checklist / runbook / tldr (popover vs inline).

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
