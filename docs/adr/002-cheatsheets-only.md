# ADR 002: Cheatsheets Only, Draft Until Freeze

**Status:** Accepted  
**Date:** 2026-10-26  
**Supersedes:** ADR 001 sections on `documentType`, non-cheatsheet renderers, "v1 core (frozen)", and "Deferred to v2"

## Context

ChSON grew from a cheatsheet format into five document types (cheatsheet, checklist,
runbook, tldr, bookmarks). The extra types bent the shared model — bookmarks reuse
`content` as a URL — and the schema never settled. ADR 001 declared a frozen v1 core,
but that core was never tested against a varied set of real cheatsheets.

## Decision

### 1. ChSON describes cheatsheets only

Remove checklist, runbook, tldr, and bookmarks from every layer: the `documentType`
field, their `@chson/ui` renderers, hooks, and core helpers, registry examples, CLI
handling, and the website. Git history keeps them; reintroducing any type requires a
new ADR.

### 2. The format is a draft until frozen

Breaking schema changes are allowed until the freeze. Each breaking change migrates
every registry file in the same change. The website labels the format as a draft.

### 3. Freeze criterion

The format freezes when the registry holds at least 10 cheatsheets covering at least
these shapes, written with no open schema issues in Linear:

- CLI commands
- keyboard shortcuts
- language or query syntax
- configuration keys
- API reference
- glossary of terms

At least one of them must use the extension point, to prove it works.

### 4. ChSON never changes after the freeze

Once frozen, the set of valid ChSON documents and the meaning of every field never
change — not even by adding optional fields. There is no format version number.

- The prose spec may be clarified, but never in a way that changes which documents
  are valid or what they mean.
- Tooling (CLI, renderers, website) keeps evolving; it is not the format.
- New needs are met through a fixed extension point that consumers must ignore when
  they do not understand it. The extension point is decided during the draft phase.
- A successor format gets a different name and a different `$schema` URL; it never
  calls itself ChSON.

### 5. Draft and frozen schemas live at different URLs

The draft schema is served from a URL that marks it as a draft. The frozen schema is
published at a new, permanent URL on the day of the freeze, and its content never
changes. No draft-era document can claim to be frozen ChSON.

## Consequences

- `@chson/ui` shrinks to the cheatsheet renderer and its primitives.
- Registry examples `devops/release-checklist`, `git/rebase-tldr`,
  `kubernetes/pod-troubleshooting-runbook`, and `web/performance-bookmarks` are deleted,
  along with their copies in `examples/chson-shadcn-registry`.
- Schema critique is tracked as Linear issues; each settled decision gets an ADR.
- After the freeze, every mistake in the format is permanent, so the freeze criterion
  is not relaxed to ship sooner.
- The current `https://chson.dev/api/schema.json` is draft-era; choosing the draft and
  permanent URLs (and what happens to the old one) is a draft-phase decision.
