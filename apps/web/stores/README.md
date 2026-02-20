# Zustand UI Store

This directory contains the centralized UI state management using Zustand.

## Overview

The UI store manages ephemeral UI state and user preferences using Zustand with the following middleware:

- **Immer** - For immutable state updates with mutable syntax
- **Persist** - For persisting user preferences to localStorage

## Store Structure

```typescript
type UIState = {
  commandPalette: {
    open: boolean; // Ephemeral - not persisted
    history: string[]; // Persisted - recent commands
  };
  feedbackModal: {
    open: boolean; // Ephemeral
    success: boolean; // Ephemeral
    error: boolean; // Ephemeral
  };
  theme: 'light' | 'dark' | 'system'; // Persisted
  layout: {
    sidebarOpen: boolean; // Persisted
    sidebarWidth: number; // Persisted
  };
};
```

## Usage

### Basic Usage

```tsx
import { useUIStore } from 'stores/ui-store';

function MyComponent() {
  // Select specific state (recommended for performance)
  const open = useUIStore((state) => state.commandPalette.open);
  const openPalette = useUIStore((state) => state.openCommandPalette);

  return <button onClick={openPalette}>Open Command Palette</button>;
}
```

### Command Palette

```tsx
const open = useUIStore((state) => state.commandPalette.open);
const history = useUIStore((state) => state.commandPalette.history);
const toggleCommandPalette = useUIStore((state) => state.toggleCommandPalette);
const addToCommandHistory = useUIStore((state) => state.addToCommandHistory);
```

### Feedback Modal

```tsx
const open = useUIStore((state) => state.feedbackModal.open);
const success = useUIStore((state) => state.feedbackModal.success);
const error = useUIStore((state) => state.feedbackModal.error);
const openFeedbackModal = useUIStore((state) => state.openFeedbackModal);
const resetFeedbackModal = useUIStore((state) => state.resetFeedbackModal);
```

### Theme

```tsx
const theme = useUIStore((state) => state.theme);
const setTheme = useUIStore((state) => state.setTheme);

// Usage
setTheme('dark');
setTheme('light');
setTheme('system');
```

### Layout

```tsx
const sidebarOpen = useUIStore((state) => state.layout.sidebarOpen);
const sidebarWidth = useUIStore((state) => state.layout.sidebarWidth);
const toggleSidebar = useUIStore((state) => state.toggleSidebar);
const setSidebarWidth = useUIStore((state) => state.setSidebarWidth);
```

## Persistence

The following state is persisted to localStorage under the key `ui-preferences`:

- `theme` - User's theme preference
- `layout.sidebarOpen` - Sidebar visibility
- `layout.sidebarWidth` - Sidebar width
- `commandPalette.history` - Recent command history (max 10 items)

**Not persisted** (ephemeral state):

- `commandPalette.open` - Whether command palette is open
- `feedbackModal.*` - All feedback modal state

## Best Practices

### 1. Use Selectors

Always use selectors to pick specific state. This prevents unnecessary re-renders:

```tsx
// Good - only re-renders when `open` changes
const open = useUIStore((state) => state.commandPalette.open);

// Bad - re-renders on any state change
const state = useUIStore();
```

### 2. Select Actions Separately

Actions are stable and don't cause re-renders:

```tsx
const open = useUIStore((state) => state.commandPalette.open);
const toggle = useUIStore((state) => state.toggleCommandPalette);
```

### 3. Use Outside React

Zustand stores can be accessed outside React components:

```tsx
// Get current state
const currentTheme = useUIStore.getState().theme;

// Update state
useUIStore.getState().setTheme('dark');

// Subscribe to changes
const unsubscribe = useUIStore.subscribe(
  (state) => state.theme,
  (theme) => console.log('Theme changed:', theme),
);
```

## Adding New State

To add new UI state:

1. Add the state type to the appropriate section in `UIState`
2. Add action types to the corresponding `*Actions` type
3. Add initial state to `initialState`
4. Add action implementations in the store
5. If the state should persist, add it to the `partialize` function
6. Add tests in `__tests__/ui-store.test.ts`

Example:

```typescript
// 1. Add state type
export type UIState = {
  // ...existing state
  notifications: {
    enabled: boolean;
  };
};

// 2. Add action types
export type NotificationActions = {
  setNotificationsEnabled: (enabled: boolean) => void;
};

// 3. Add initial state
const initialState: UIState = {
  // ...existing state
  notifications: {
    enabled: true,
  },
};

// 4. Add actions in store
setNotificationsEnabled: (enabled) =>
  set((state) => {
    state.notifications.enabled = enabled;
  }),

// 5. Update partialize if needed
partialize: (state) => ({
  // ...existing persisted state
  notifications: state.notifications,
}),
```

## Integration with next-themes

The store integrates with `next-themes` for theme management:

- **Zustand** stores the user's explicit preference (`'light' | 'dark' | 'system'`)
- **next-themes** handles system theme detection and CSS class switching
- The `ThemeProvider` in `providers/theme-provider.tsx` syncs between them

To change the theme programmatically:

```tsx
import { useUIStore } from 'stores/ui-store';

const setTheme = useUIStore((state) => state.setTheme);
setTheme('dark'); // This updates both Zustand and next-themes
```
