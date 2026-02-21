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

  describe('formatExample', () => {
    it('returns empty string for null or undefined', async () => {
      const { formatExample } = await import('lib/cheatsheets');
      expect(formatExample(null)).toBe('');
      expect(formatExample(undefined)).toBe('');
    });

    it('returns string as-is', async () => {
      const { formatExample } = await import('lib/cheatsheets');
      expect(formatExample('git status')).toBe('git status');
    });

    it('stringifies objects', async () => {
      const { formatExample } = await import('lib/cheatsheets');
      const result = formatExample({ foo: 'bar' });
      expect(result).toBe('{\n  "foo": "bar"\n}');
    });
  });

  describe('Cheatsheet type definitions', () => {
    it('exports correct types', async () => {
      // Just verify the module can be imported without errors
      const cheatsheetModule = await import('lib/cheatsheets');
      expect(cheatsheetModule.formatExample).toBeDefined();
      expect(cheatsheetModule.getAllCheatsheets).toBeDefined();
      expect(cheatsheetModule.loadCheatsheet).toBeDefined();
      expect(cheatsheetModule.listCheatsheetPaths).toBeDefined();
    });
  });
});
