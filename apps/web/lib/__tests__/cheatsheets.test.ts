import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fs module before importing the module under test
vi.mock('node:fs', () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    readdirSync: vi.fn(),
  },
}));

describe('cheatsheets library', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  describe('Cheatsheet module exports', () => {
    it('exports correct functions', async () => {
      // Just verify the module can be imported without errors
      const cheatsheetModule = await import('lib/cheatsheets');
      expect(cheatsheetModule.getAllCheatsheets).toBeDefined();
      expect(cheatsheetModule.loadCheatsheet).toBeDefined();
      expect(cheatsheetModule.listCheatsheetPaths).toBeDefined();
    });
  });
});
