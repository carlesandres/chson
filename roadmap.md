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
call Phase 1 done). **Urgent after Phase 1 / #71:** Bookmarks card layout for GFM
`details` (nested interactives) — [#74](https://github.com/carlesandres/chson/issues/74).
**Accepted for now (longer discussion):** Streamdown as `@chson/ui` GFM renderer for
`details`; evaluate lighter alternative / mermaid cost later —
[#75](https://github.com/carlesandres/chson/issues/75) (does not block #71).
**Partial (honest):** `apps/web` dropped **direct** Radix/UI deps in favor of
`@chson/ui/shadcn/*`; `components.json` / empty `components/ui` / transitive theme
ownership still need a realignment pass —
[#77](https://github.com/carlesandres/chson/issues/77) (does not block #71).
**Deferred:** `@chson/ui` committed `dist`/`types` drift risk (CI gate or stop
committing artifacts) — [#78](https://github.com/carlesandres/chson/issues/78)
(does not block #71). **Thin tests done; fuller matrix later:**
[#79](https://github.com/carlesandres/chson/issues/79).

## Phases

### Phase 1 — Architecture Reset (complete for scoped DoD)

Goal: establish clear layer boundaries, fix inconsistencies, and align implementation
with the cognitive model before adding features or publishing.

**Tasks:**

1. ~~**Audit and fix doc/schema inconsistencies**~~ — done (`comments` removed; docs aligned).
2. ~~**Draft layer-boundary ADR**~~ — `docs/adr/001-layers.md`.
3. ~~**Implement progressive disclosure in renderers**~~ — done for Phase 1 scope:
   `details` off the primary scan path (except bookmarks). **Presentation is
   document-type-specific by design for now** (not one shared control): cheatsheet
   third-column **More** popover; checklist / tldr / runbook inline **More/Less**;
   bookmarks always-visible card `details`. Unifying or changing those patterns is
   **Phase 5**, not a Phase 1 gap. `details` is always markdown (Streamdown / GFM
   in `@chson/ui`).
4. ~~**Shared checklist state + app dep cleanup**~~ — `useChecklistState` in
   `@chson/ui`; `apps/web` no longer lists duplicate **direct** Radix/UI deps
   (consumes `@chson/ui/shadcn/*`). **Not fully done:** shadcn config path,
   empty `components/ui`, and transitive dep ownership —
   [#77](https://github.com/carlesandres/chson/issues/77).
5. **Follow-up (not Phase 1 blocking):** trim unused shadcn components inside
   `@chson/ui` — [#73](https://github.com/carlesandres/chson/issues/73).
6. **Urgent after #71:** fix Bookmarks card layout for GFM `details` (nested
   `<a>` / a11y) — [#74](https://github.com/carlesandres/chson/issues/74). Do
   **before** treating launch readiness as unblocked for bookmarks content.
7. **Accepted for now (non-blocking):** Streamdown renders GFM `details` in
   `@chson/ui`. Longer evaluation of weight / mermaid / lighter GFM stack —
   [#75](https://github.com/carlesandres/chson/issues/75) (related: [#72](https://github.com/carlesandres/chson/issues/72)).
8. ~~**Runbook `entry.url` sanitization**~~ — done (`safeExternalUrl`, same as
   cheatsheet More). Shared `ExternalRefLink` primitive later —
   [#76](https://github.com/carlesandres/chson/issues/76).
9. **Accepted partial (non-blocking):** app direct Radix/UI dep drop only;
   finish shadcn config + dep ownership with `@chson/ui` —
   [#77](https://github.com/carlesandres/chson/issues/77).
10. **Deferred (non-blocking):** prevent `@chson/ui` `dist`/`types` drift (CI
    gate or stop committing artifacts) —
    [#78](https://github.com/carlesandres/chson/issues/78).
11. ~~**Thin contract tests for #71 claims**~~ — `EntryMorePopover` unit cases +
    tldr details disclosure; fuller matrix later —
    [#79](https://github.com/carlesandres/chson/issues/79).
12. ~~**Document `entry.comments` soft removal**~~ — still validates via
    `additionalProperties`; renderers ignore; migrate to `details` (schema docs +
    `@chson/schema` README).
13. **Low polish (non-blocking):** EntryMorePopover labels (url-only More vs Link)
    — [#80](https://github.com/carlesandres/chson/issues/80).

**Definition of done (Phase 1):**

- [x] Schema, docs, and examples tell the same story.
- [x] An ADR defines package boundaries and what is explicitly out of scope for v1.
- [x] Renderers keep `details` off the primary scan path (bookmarks exception);
      type-specific disclosure UX accepted for Phase 1 (unify later in Phase 5).
- [x] Reusable checklist persistence lives in `@chson/ui`; app glue stays in `apps/web`.
- [x] Markdown renderer choice for `details` — **Streamdown accepted for #71**; revisit in [#75](https://github.com/carlesandres/chson/issues/75).
- [x] Runbook external links use `safeExternalUrl` (shared primitive deferred to [#76](https://github.com/carlesandres/chson/issues/76)).
- [x] App **direct** Radix/UI dep dedup — done for #71; full config/ownership pass in [#77](https://github.com/carlesandres/chson/issues/77).
- [x] Thin progressive-disclosure / link-safety tests for #71 claims; expand matrix in [#79](https://github.com/carlesandres/chson/issues/79).
- [x] `entry.comments` soft-compat documented (validate yes, render no; migrate to `details`).
- [ ] Full shadcn surface reduced to ChSON-only needs — **deferred** ([#73](https://github.com/carlesandres/chson/issues/73)).
- [ ] Bookmarks GFM-safe card layout — **urgent post-#71** ([#74](https://github.com/carlesandres/chson/issues/74)).
- [ ] App shadcn config + dep ownership aligned with `@chson/ui` — **follow-up** ([#77](https://github.com/carlesandres/chson/issues/77)).
- [ ] `@chson/ui` artifact drift prevention — **deferred** ([#78](https://github.com/carlesandres/chson/issues/78)).
- [ ] Full renderer contract test matrix — **follow-up** ([#79](https://github.com/carlesandres/chson/issues/79)).
- [ ] EntryMorePopover label polish — **low** ([#80](https://github.com/carlesandres/chson/issues/80)).

### Phase 2 — Launch Readiness

Goal: make the project publicly usable, testable, and indexable.

- **First:** fix Bookmarks nested interactives / GFM card layout ([#74](https://github.com/carlesandres/chson/issues/74)).
- Align `apps/web` shadcn config and dependency ownership with `@chson/ui` ([#77](https://github.com/carlesandres/chson/issues/77)); related surface trim [#73](https://github.com/carlesandres/chson/issues/73).
- Prevent `@chson/ui` `dist`/`types` drift before/with npm publish ([#78](https://github.com/carlesandres/chson/issues/78); pairs with #38, #39).
- Expand `@chson/ui` renderer contract tests beyond thin #71 coverage ([#79](https://github.com/carlesandres/chson/issues/79)).
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
- Markdown flavor / renderer strategy for `details` ([#72](https://github.com/carlesandres/chson/issues/72), [#75](https://github.com/carlesandres/chson/issues/75)) — format promise vs implementation, library weight.

### Phase 4 — Registry Distribution

Goal: predictable, versionable registries for maintainers and consumers.

Source: `research/registry-improvements-plan.md`, `research/registry-distribution-notes.md`.

### Phase 5 — Consumption Experience

Goal: polished rendering across surfaces — mobile, a11y, search, validation UI.

Source: issues #58, #33, #27.

**Owns progressive-disclosure UX revisit** (deferred from Phase 1 by design):

- Today: three intentional patterns — cheatsheet popover **More**; checklist / tldr /
  runbook inline **More/Less**; bookmarks always-visible `details`.
- Decide whether to keep multi-pattern UX or converge (e.g. popover vs inline
  everywhere), including mobile/a11y tradeoffs.
- Not a Phase 1 defect; Phase 1 only required secondary content off the primary
  scan path (except bookmarks).

Also: extract shared `ExternalRefLink` for `entry.url` across renderers
([#76](https://github.com/carlesandres/chson/issues/76)).

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
