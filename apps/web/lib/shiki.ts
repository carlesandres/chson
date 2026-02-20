import { createHighlighter, type Highlighter, type BundledLanguage } from 'shiki';

// Languages commonly used in cheatsheets
const BUNDLED_LANGUAGES: BundledLanguage[] = [
  'bash',
  'shell',
  'sh',
  'json',
  'javascript',
  'typescript',
  'python',
  'sql',
  'yaml',
  'markdown',
  'html',
  'css',
  'tsx',
  'jsx',
  'vim',
  'git-commit',
  'git-rebase',
  'diff',
];

// Use globalThis to ensure singleton works across module reloads in development
// and across the build process
const globalForShiki = globalThis as unknown as {
  shikiHighlighter: Highlighter | undefined;
  shikiHighlighterPromise: Promise<Highlighter> | undefined;
};

export async function getHighlighter(): Promise<Highlighter> {
  if (globalForShiki.shikiHighlighter) {
    return globalForShiki.shikiHighlighter;
  }

  // Avoid race conditions by caching the promise
  if (!globalForShiki.shikiHighlighterPromise) {
    globalForShiki.shikiHighlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: BUNDLED_LANGUAGES,
    });
  }

  globalForShiki.shikiHighlighter = await globalForShiki.shikiHighlighterPromise;
  return globalForShiki.shikiHighlighter;
}

export async function highlightCode(
  code: string,
  language?: string
): Promise<string> {
  const hl = await getHighlighter();

  // Validate language, fallback to 'text' if not supported
  const lang = language && hl.getLoadedLanguages().includes(language as BundledLanguage)
    ? language
    : 'text';

  return hl.codeToHtml(code, {
    lang,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
  });
}
