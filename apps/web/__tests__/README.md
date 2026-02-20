# Test Suite

This directory contains comprehensive tests for the application functionality.

## Test Structure

```
__tests__/
├── utils/
│   └── test-utils.tsx         # Shared testing utilities and custom render
├── README.md                  # This file
app/__tests__/
└── layout.test.tsx            # Root layout tests
hooks/queries/__tests__/
├── use-auth.test.tsx          # Authentication hooks tests
└── use-posts.test.tsx         # Posts CRUD hooks tests
providers/__tests__/
└── query-provider.test.tsx    # QueryProvider tests
```

## Running Tests

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with UI
bun run test:ui

# Run tests with coverage
bun run test:coverage

# Run a specific test file
bun run test -- app/__tests__/layout.test.tsx
```

## Test Coverage

### Root Layout (`app/__tests__/layout.test.tsx`)

- ✅ Verifies html and body tags are present
- ✅ Tests lang attribute is set correctly
- ✅ Ensures children are rendered
- ✅ Confirms QueryProvider wrapping
- ✅ Checks DesktopNav inclusion
- ✅ Validates component hierarchy
- ✅ Tests multiple children rendering

### QueryProvider (`providers/__tests__/query-provider.test.tsx`)

- ✅ Tests children rendering
- ✅ Verifies QueryClient is provided to children
- ✅ Confirms default query options are applied
- ✅ Tests ReactQueryDevtools rendering
- ✅ Validates error handling
- ✅ Tests multiple simultaneous queries

### Authentication Hooks (`hooks/queries/__tests__/use-auth.test.tsx`)

- ✅ Query key generation (`authKeys`)
- ✅ `useSession()` - fetch and error handling
- ✅ `useUser()` - fetch and null user handling
- ✅ `useSignIn()` - success and error cases
- ✅ `useSignUp()` - success and error cases
- ✅ `useSignOut()` - success and error cases

### Posts Hooks (`hooks/queries/__tests__/use-posts.test.tsx`)

- ✅ Query key generation (`postsKeys`)
- ✅ `usePosts()` - fetch and error handling
- ✅ `usePost(id)` - single post fetch and conditional execution
- ✅ `useCreatePost()` - create with cache invalidation
- ✅ `useUpdatePost()` - update with optimistic updates
- ✅ `useDeletePost()` - delete with cache cleanup

## Testing Patterns

### Custom Render

Use the custom render from `__tests__/utils/test-utils.tsx` for components that need QueryClientProvider:

```tsx
import { render, screen } from '__tests__/utils/test-utils';

test('my component', () => {
  render(<MyComponent />);
  // assertions
});
```

### Hook Testing

Use `renderHook` from `@testing-library/react` with a custom wrapper:

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const { result } = renderHook(() => useMyHook(), {
  wrapper: createWrapper(),
});
```

### Mocking Supabase

All Supabase client methods are mocked in test files:

```tsx
vi.mock('utils/supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      // ...
    },
  },
}));
```

## Test Configuration

- **Framework**: Vitest
- **Environment**: jsdom (for DOM testing)
- **Testing Library**: @testing-library/react
- **Mock Support**: vi.fn(), vi.mock()
- **Path Aliases**: Configured in `vitest.config.ts`

## Adding New Tests

1. Create test file adjacent to the code being tested or in `__tests__/`
2. Use `.test.tsx` or `.spec.tsx` extension
3. Follow existing patterns for consistency
4. Mock external dependencies (Supabase, Next.js, etc.)
5. Test both success and error cases
6. Ensure tests are isolated and don't depend on execution order

## Current Test Statistics

- **Total Test Suites**: 4
- **Total Tests**: 36
- **Coverage**: Comprehensive coverage of new TanStack Query functionality

## Best Practices

1. **Arrange-Act-Assert**: Structure tests clearly
2. **One assertion per test**: Keep tests focused
3. **Descriptive test names**: Use "should..." format
4. **Mock external dependencies**: Isolate units under test
5. **Test edge cases**: Don't just test the happy path
6. **Clean up**: Use beforeEach/afterEach for setup/teardown
7. **Async testing**: Always use `waitFor` for async operations
