# Future Improvements

This document tracks planned improvements for the project. Work on these items one by one as time permits.

## State Management

### Add Zustand for UI State Management

**Status:** ✅ Completed  
**Priority:** High

Replace ad-hoc state management with Zustand for better UI state coordination.

**Tasks:**

- [x] Install zustand
- [x] Create initial store structure (Command Palette state)
- [x] Expand store to include sidebar, modals, and theme state
- [x] Migrate existing useState/useContext patterns to Zustand stores
- [x] Add persistence middleware for user preferences
- [x] Document store usage patterns

**Implementation Details:**

- Installed `zustand@5.0.11` and `immer@11.1.3`
- Created `stores/ui-store.ts` with comprehensive UI state management:
  - Command Palette: open state + history (max 10 items)
  - Feedback Modal: open, success, error states
  - Theme: preference synced with next-themes
  - Layout: sidebar open/width
- Configured middleware stack: `persist(immer(...))`
- Persistence to localStorage for user preferences (theme, layout, command history)
- Migrated `FeedbackButton.tsx` from local useState to Zustand
- Created `ThemeProvider` that syncs Zustand with next-themes
- Added comprehensive test coverage (22 tests passing)
- Created `stores/README.md` with usage documentation

**Benefits:**

- Centralized UI state management
- Better DevTools support
- Simpler state logic compared to Context API
- Less boilerplate than Redux
- User preferences persist across sessions

---

### Add TanStack Query for Server State Management

**Status:** ✅ Completed  
**Priority:** High

Implement TanStack Query (React Query) for efficient server state management.

**Tasks:**

- [x] Install @tanstack/react-query
- [x] Set up QueryClientProvider in app layout
- [x] Configure React Query DevTools
- [x] Create query hooks for Supabase data fetching
- [x] Implement mutations for data updates
- [x] Add optimistic updates for better UX
- [x] Configure caching strategies
- [x] Document query patterns and best practices

**Implementation Details:**

- Created `providers/query-provider.tsx` with QueryClient configuration
- Integrated QueryProvider in `app/layout.tsx`
- Created example hooks in `hooks/queries/`:
  - `use-posts.ts` - Full CRUD operations with optimistic updates
  - `use-auth.ts` - Authentication hooks (session, sign in/up/out)
- Configured default options: 1 minute stale time, 5 minute gc time
- Added comprehensive README with usage examples

**Benefits:**

- Automatic caching and background refetching
- Optimistic updates out of the box
- Better loading and error states
- Reduced boilerplate for data fetching
- Excellent DevTools for debugging

---

## Testing

### Replace Jest with Vitest

**Status:** ✅ Completed  
**Priority:** Medium

Migrate from Jest to Vitest for faster, more modern testing.

**Tasks:**

- [x] Install vitest and related dependencies
- [x] Update test configuration (vitest.config.ts)
- [x] Migrate Jest config to Vitest equivalents
- [x] Update test scripts in package.json
- [x] Migrate existing tests to Vitest syntax (if any breaking changes)
- [x] Configure coverage reporting
- [x] Update CI/CD pipeline if needed
- [x] Remove Jest dependencies

**Implementation Details:**

- Installed `vitest@4.0.18`, `@vitest/ui@4.0.18`, and `@vitest/coverage-v8@4.0.18`
- Created `vitest.config.ts` with jsdom environment and path aliases
- Created `vitest.setup.ts` with necessary mocks and @testing-library/jest-dom integration
- Updated all test scripts in package.json to use vitest
- All 47 tests passing across 7 test suites
- Configured v8 coverage provider with text and HTML reporters

**Benefits:**

- Native ESM support
- Faster test execution (2.08s for 47 tests)
- Better Vite integration
- Modern API similar to Jest
- Built-in TypeScript support

---

## Linting

### Replace ESLint with Oxlint

**Status:** ✅ Completed  
**Priority:** Low

Replace ESLint with Oxlint for significantly faster linting.

**Tasks:**

- [x] Install oxlint
- [x] Create oxlint configuration
- [x] Test oxlint against codebase
- [x] Evaluate compatibility with existing rules
- [x] Update lint scripts in package.json
- [x] Update pre-commit hooks
- [x] Remove ESLint dependencies
- [x] Update CI/CD pipeline
- [x] Document any rule differences or limitations

**Implementation Details:**

- Installed `oxlint@1.43.0` as a dev dependency
- Created comprehensive `.oxlintrc.json` configuration with 173 rules
- Configured plugins: react, unicorn, typescript, oxc, import, vitest, jsx-a11y, nextjs
- Updated `package.json` lint script to use oxlint with TypeScript support
- Pre-commit hooks already use `bun run lint` which now runs oxlint
- Removed all ESLint dependencies (29 packages) via clean reinstall
- Linting now completes in ~118ms (previously ~2-3s with ESLint)
- All 64 tests passing after migration

**Benefits:**

- 50-100x faster than ESLint (118ms vs 2-3s)
- Written in Rust for performance
- Compatible with most ESLint rules
- Reduced node_modules size by ~100MB
- Zero configuration conflicts

**Results:**

- ✓ Linting time reduced from 2-3s to 118ms
- ✓ All existing rules maintained via plugins
- ✓ Full TypeScript, React, Next.js support
- ✓ Accessibility (jsx-a11y) rules preserved
- ✓ No breaking changes to existing codebase

---

## Notes

- These improvements should be implemented one at a time
- Each improvement should be on its own branch
- Run full test suite after each change
- Update documentation as needed
- Consider creating ADRs (Architecture Decision Records) for major changes
