import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';

// ============================================================================
// State Types
// ============================================================================

export type CommandPaletteState = {
  open: boolean;
  history: string[];
};

export type FeedbackModalState = {
  open: boolean;
  success: boolean;
  error: boolean;
};

export type ThemePreference = 'light' | 'dark' | 'system';

export type LayoutState = {
  sidebarOpen: boolean;
  sidebarWidth: number;
};

export type UIState = {
  commandPalette: CommandPaletteState;
  feedbackModal: FeedbackModalState;
  theme: ThemePreference;
  layout: LayoutState;
};

// ============================================================================
// Action Types
// ============================================================================

export type CommandPaletteActions = {
  setCommandPaletteOpen: (open: boolean) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  addToCommandHistory: (command: string) => void;
  clearCommandHistory: () => void;
};

export type FeedbackModalActions = {
  setFeedbackModalOpen: (open: boolean) => void;
  openFeedbackModal: () => void;
  closeFeedbackModal: () => void;
  setFeedbackSuccess: (success: boolean) => void;
  setFeedbackError: (error: boolean) => void;
  resetFeedbackModal: () => void;
};

export type ThemeActions = {
  setTheme: (theme: ThemePreference) => void;
};

export type LayoutActions = {
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
};

export type UIActions = CommandPaletteActions &
  FeedbackModalActions &
  ThemeActions &
  LayoutActions;

export type UIStore = UIState & UIActions;

// ============================================================================
// Initial State
// ============================================================================

const initialState: UIState = {
  commandPalette: {
    open: false,
    history: [],
  },
  feedbackModal: {
    open: false,
    success: false,
    error: false,
  },
  theme: 'system',
  layout: {
    sidebarOpen: true,
    sidebarWidth: 256,
  },
};

// ============================================================================
// Store
// ============================================================================

const MAX_COMMAND_HISTORY = 10;

export const useUIStore = create<UIStore>()(
  persist(
    immer((set) => ({
      ...initialState,

      // Command Palette Actions
      setCommandPaletteOpen: (open) =>
        set((state) => {
          state.commandPalette.open = open;
        }),
      openCommandPalette: () =>
        set((state) => {
          state.commandPalette.open = true;
        }),
      closeCommandPalette: () =>
        set((state) => {
          state.commandPalette.open = false;
        }),
      toggleCommandPalette: () =>
        set((state) => {
          state.commandPalette.open = !state.commandPalette.open;
        }),
      addToCommandHistory: (command) =>
        set((state) => {
          // Remove if already exists to avoid duplicates
          const filtered = state.commandPalette.history.filter(
            (c) => c !== command,
          );
          // Add to beginning
          state.commandPalette.history = [command, ...filtered].slice(
            0,
            MAX_COMMAND_HISTORY,
          );
        }),
      clearCommandHistory: () =>
        set((state) => {
          state.commandPalette.history = [];
        }),

      // Feedback Modal Actions
      setFeedbackModalOpen: (open) =>
        set((state) => {
          state.feedbackModal.open = open;
        }),
      openFeedbackModal: () =>
        set((state) => {
          state.feedbackModal.open = true;
        }),
      closeFeedbackModal: () =>
        set((state) => {
          state.feedbackModal.open = false;
        }),
      setFeedbackSuccess: (success) =>
        set((state) => {
          state.feedbackModal.success = success;
        }),
      setFeedbackError: (error) =>
        set((state) => {
          state.feedbackModal.error = error;
        }),
      resetFeedbackModal: () =>
        set((state) => {
          state.feedbackModal.open = false;
          state.feedbackModal.success = false;
          state.feedbackModal.error = false;
        }),

      // Theme Actions
      setTheme: (theme) =>
        set((state) => {
          state.theme = theme;
        }),

      // Layout Actions
      setSidebarOpen: (open) =>
        set((state) => {
          state.layout.sidebarOpen = open;
        }),
      toggleSidebar: () =>
        set((state) => {
          state.layout.sidebarOpen = !state.layout.sidebarOpen;
        }),
      setSidebarWidth: (width) =>
        set((state) => {
          state.layout.sidebarWidth = width;
        }),
    })),
    {
      name: 'ui-preferences',
      storage: createJSONStorage(() => localStorage),
      // Only persist user preferences, not ephemeral UI state
      partialize: (state) => ({
        theme: state.theme,
        layout: state.layout,
        commandPalette: {
          history: state.commandPalette.history,
        },
      }),
    },
  ),
);
