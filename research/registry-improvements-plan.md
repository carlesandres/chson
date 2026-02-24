# Registry Improvements Plan

This plan captures the next improvements for ChSON registry distribution after adding `--packs by-directory`, collision controls, and metadata mapping.

## Goals

- Keep registry publishing simple for maintainers.
- Make installed item names predictable and stable.
- Support higher-level bundles without breaking single-file installs.
- Add explicit versioning guidance for long-term compatibility.

## Phase 1: Explicit Naming and Pack Config

### 1.1 Explicit item naming

- Add optional config file support for item name overrides.
- Validate uniqueness before generation.
- Keep path-derived names as fallback.

Deliverables:

- CLI flag to load config (for example `--config registry.config.json`).
- Config schema docs and examples.
- Error messages listing conflicting names and source files.

### 1.2 Custom packs

- Support user-defined pack items in config (not only directory-inferred packs).
- Allow packs to reference explicit items by name.
- Keep inferred packs available with `--packs by-directory`.

Deliverables:

- Config-driven `registryDependencies` generation.
- Validation to ensure pack dependencies exist.
- Docs for authoring starter packs.

## Phase 2: Versioned Registry Output

### 2.1 Versioned routing mode

- Add CLI option to emit versioned paths (for example `/r/v1/{name}.json`).
- Keep unversioned output as default for backwards compatibility.

Deliverables:

- Generation mode for versioned output.
- Docs on migration and deprecation policy.
- CI check to validate both unversioned and versioned payloads.

### 2.2 Compatibility policy

- Define when item names can change and how to preserve aliases.
- Document breaking vs non-breaking changes.

Deliverables:

- Registry versioning guidelines in docs.
- Internal decision record for release policy.

## Phase 3: Metadata Mapping Controls

### 3.1 Configurable mapping

- Allow include/exclude lists for mapped fields (`keywords`, `categories`, `meta`).
- Keep sensible defaults that work without config.

Deliverables:

- Mapping config options and validation.
- Public docs with examples for strict/minimal metadata output.

### 3.2 Quality checks

- Extend checks to verify mapped metadata shape.
- Ensure dependencies and metadata stay consistent after regeneration.

Deliverables:

- Stronger `registry:check` assertions.
- CI coverage for representative sample items.

## Suggested Order

1. Explicit naming + custom packs
2. Versioned registry output
3. Metadata mapping controls

## Verification Checklist

- Run `npm run validate` from repo root.
- Run `npm --prefix examples/chson-shadcn-registry run registry:check`.
- Validate consumer install flow with one single item and one pack item.
- Confirm docs match final CLI flags and defaults.
