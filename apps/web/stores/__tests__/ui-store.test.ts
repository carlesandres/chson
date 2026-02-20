import { useUIStore } from 'stores/ui-store';

// Reset store to initial state before each test
const resetStore = () => {
  useUIStore.setState({
    commandPalette: { open: false, history: [] },
    feedbackModal: { open: false, success: false, error: false },
    theme: 'system',
    layout: { sidebarOpen: true, sidebarWidth: 256 },
  });
};

describe('useUIStore', () => {
  beforeEach(() => {
    resetStore();
  });

  // ===========================================================================
  // Command Palette Tests
  // ===========================================================================
  describe('Command Palette', () => {
    it('defaults to command palette closed', () => {
      expect(useUIStore.getState().commandPalette.open).toBe(false);
    });

    it('setCommandPaletteOpen updates open state', () => {
      useUIStore.getState().setCommandPaletteOpen(true);
      expect(useUIStore.getState().commandPalette.open).toBe(true);

      useUIStore.getState().setCommandPaletteOpen(false);
      expect(useUIStore.getState().commandPalette.open).toBe(false);
    });

    it('openCommandPalette opens palette', () => {
      useUIStore.getState().openCommandPalette();
      expect(useUIStore.getState().commandPalette.open).toBe(true);
    });

    it('closeCommandPalette closes palette', () => {
      useUIStore.getState().openCommandPalette();
      useUIStore.getState().closeCommandPalette();
      expect(useUIStore.getState().commandPalette.open).toBe(false);
    });

    it('toggleCommandPalette toggles open state', () => {
      expect(useUIStore.getState().commandPalette.open).toBe(false);

      useUIStore.getState().toggleCommandPalette();
      expect(useUIStore.getState().commandPalette.open).toBe(true);

      useUIStore.getState().toggleCommandPalette();
      expect(useUIStore.getState().commandPalette.open).toBe(false);
    });

    it('addToCommandHistory adds command to history', () => {
      useUIStore.getState().addToCommandHistory('search');
      expect(useUIStore.getState().commandPalette.history).toEqual(['search']);

      useUIStore.getState().addToCommandHistory('settings');
      expect(useUIStore.getState().commandPalette.history).toEqual([
        'settings',
        'search',
      ]);
    });

    it('addToCommandHistory moves existing command to top', () => {
      useUIStore.getState().addToCommandHistory('search');
      useUIStore.getState().addToCommandHistory('settings');
      useUIStore.getState().addToCommandHistory('search');
      expect(useUIStore.getState().commandPalette.history).toEqual([
        'search',
        'settings',
      ]);
    });

    it('addToCommandHistory limits history to 10 items', () => {
      for (let i = 0; i < 15; i++) {
        useUIStore.getState().addToCommandHistory(`command-${i}`);
      }
      expect(useUIStore.getState().commandPalette.history).toHaveLength(10);
      expect(useUIStore.getState().commandPalette.history[0]).toBe(
        'command-14',
      );
    });

    it('clearCommandHistory clears all history', () => {
      useUIStore.getState().addToCommandHistory('search');
      useUIStore.getState().addToCommandHistory('settings');
      useUIStore.getState().clearCommandHistory();
      expect(useUIStore.getState().commandPalette.history).toEqual([]);
    });
  });

  // ===========================================================================
  // Feedback Modal Tests
  // ===========================================================================
  describe('Feedback Modal', () => {
    it('defaults to feedback modal closed', () => {
      expect(useUIStore.getState().feedbackModal.open).toBe(false);
      expect(useUIStore.getState().feedbackModal.success).toBe(false);
      expect(useUIStore.getState().feedbackModal.error).toBe(false);
    });

    it('setFeedbackModalOpen updates open state', () => {
      useUIStore.getState().setFeedbackModalOpen(true);
      expect(useUIStore.getState().feedbackModal.open).toBe(true);
    });

    it('openFeedbackModal opens modal', () => {
      useUIStore.getState().openFeedbackModal();
      expect(useUIStore.getState().feedbackModal.open).toBe(true);
    });

    it('closeFeedbackModal closes modal', () => {
      useUIStore.getState().openFeedbackModal();
      useUIStore.getState().closeFeedbackModal();
      expect(useUIStore.getState().feedbackModal.open).toBe(false);
    });

    it('setFeedbackSuccess updates success state', () => {
      useUIStore.getState().setFeedbackSuccess(true);
      expect(useUIStore.getState().feedbackModal.success).toBe(true);
    });

    it('setFeedbackError updates error state', () => {
      useUIStore.getState().setFeedbackError(true);
      expect(useUIStore.getState().feedbackModal.error).toBe(true);
    });

    it('resetFeedbackModal resets all feedback state', () => {
      useUIStore.getState().openFeedbackModal();
      useUIStore.getState().setFeedbackSuccess(true);
      useUIStore.getState().setFeedbackError(true);

      useUIStore.getState().resetFeedbackModal();

      expect(useUIStore.getState().feedbackModal.open).toBe(false);
      expect(useUIStore.getState().feedbackModal.success).toBe(false);
      expect(useUIStore.getState().feedbackModal.error).toBe(false);
    });
  });

  // ===========================================================================
  // Theme Tests
  // ===========================================================================
  describe('Theme', () => {
    it('defaults to system theme', () => {
      expect(useUIStore.getState().theme).toBe('system');
    });

    it('setTheme updates theme preference', () => {
      useUIStore.getState().setTheme('dark');
      expect(useUIStore.getState().theme).toBe('dark');

      useUIStore.getState().setTheme('light');
      expect(useUIStore.getState().theme).toBe('light');

      useUIStore.getState().setTheme('system');
      expect(useUIStore.getState().theme).toBe('system');
    });
  });

  // ===========================================================================
  // Layout Tests
  // ===========================================================================
  describe('Layout', () => {
    it('defaults to sidebar open with width 256', () => {
      expect(useUIStore.getState().layout.sidebarOpen).toBe(true);
      expect(useUIStore.getState().layout.sidebarWidth).toBe(256);
    });

    it('setSidebarOpen updates sidebar open state', () => {
      useUIStore.getState().setSidebarOpen(false);
      expect(useUIStore.getState().layout.sidebarOpen).toBe(false);

      useUIStore.getState().setSidebarOpen(true);
      expect(useUIStore.getState().layout.sidebarOpen).toBe(true);
    });

    it('toggleSidebar toggles sidebar state', () => {
      expect(useUIStore.getState().layout.sidebarOpen).toBe(true);

      useUIStore.getState().toggleSidebar();
      expect(useUIStore.getState().layout.sidebarOpen).toBe(false);

      useUIStore.getState().toggleSidebar();
      expect(useUIStore.getState().layout.sidebarOpen).toBe(true);
    });

    it('setSidebarWidth updates sidebar width', () => {
      useUIStore.getState().setSidebarWidth(320);
      expect(useUIStore.getState().layout.sidebarWidth).toBe(320);
    });
  });
});
