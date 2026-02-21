import fs from 'node:fs';
import path from 'node:path';

// V2 schema types (current)
export type CheatsheetEntry = {
  anchor: string;
  content: string;
  label?: string;
  comments?: unknown;
};

export type CheatsheetSection = {
  title: string;
  description?: string;
  entries: CheatsheetEntry[];
};

export type Cheatsheet = {
  $schema?: string;
  title: string;
  version?: string;
  publicationDate: string;
  description: string;
  retrievalDirection?: 'intent-to-mechanism' | 'mechanism-to-meaning';
  anchorLabel?: string;
  contentLabel?: string;
  metadata?: Record<string, unknown>;
  sections: CheatsheetSection[];
};

// V1 schema types (legacy support)
type CheatsheetItemV1 = {
  title: string;
  description: string;
  example?: unknown;
  comments?: unknown;
};

type CheatsheetSectionV1 = {
  title: string;
  description?: string;
  items: CheatsheetItemV1[];
};

type CheatsheetV1 = {
  $schema?: string;
  title: string;
  version?: string;
  publicationDate: string;
  description: string;
  metadata?: Record<string, unknown>;
  sections: CheatsheetSectionV1[];
};

export type CheatsheetRef = {
  product: string;
  name: string;
  filePath: string;
  data: Cheatsheet;
};

/**
 * Detect schema version from $schema URL
 */
function detectVersion(data: unknown): 'v1' | 'v2' {
  const schemaUrl = (data as { $schema?: string }).$schema ?? '';
  if (schemaUrl.includes('/v2/')) return 'v2';
  return 'v1';
}

/**
 * Normalize v1 cheatsheet to v2 format
 */
function normalizeToV2(data: CheatsheetV1): Cheatsheet {
  return {
    ...data,
    sections: data.sections.map((section) => ({
      title: section.title,
      description: section.description,
      entries: section.items.map((item) => ({
        anchor: formatExample(item.example) || item.title,
        content: item.description,
        label: item.example ? item.title : undefined,
        comments: item.comments,
      })),
    })),
  };
}

/**
 * Get the path to the cheatsheets directory in @chson/registry.
 * Uses the known monorepo structure.
 */
function getRegistryPath(): string {
  // Try repo root first (when run from repo root)
  const fromRepoRoot = path.join(
    process.cwd(),
    'packages/chson-registry/cheatsheets',
  );
  if (fs.existsSync(fromRepoRoot)) {
    return fromRepoRoot;
  }

  // Try from apps/web (when turbo runs from workspace directory)
  const fromWeb = path.join(
    process.cwd(),
    '../../packages/chson-registry/cheatsheets',
  );
  if (fs.existsSync(fromWeb)) {
    return path.resolve(fromWeb);
  }

  throw new Error(
    `Could not find cheatsheets at ${fromRepoRoot} or ${fromWeb}. ` +
      `Ensure you're running from the repo root or apps/web.`,
  );
}

function listFilesRecursive(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      results.push(...listFilesRecursive(entryPath));
      continue;
    }
    if (entry.isFile()) results.push(entryPath);
  }
  return results;
}

export function listCheatsheetPaths(): string[] {
  const cheatsheetsDir = getRegistryPath();
  if (!fs.existsSync(cheatsheetsDir)) return [];

  return listFilesRecursive(cheatsheetsDir).filter((p) =>
    p.endsWith('.chson.json'),
  );
}

export function loadCheatsheet(filePath: string): Cheatsheet {
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);

  // Normalize v1 to v2 format
  if (detectVersion(data) === 'v1') {
    return normalizeToV2(data as CheatsheetV1);
  }

  return data as Cheatsheet;
}

export function getAllCheatsheets(): CheatsheetRef[] {
  const cheatsheetsDir = getRegistryPath();

  return listCheatsheetPaths()
    .map((filePath) => {
      const rel = path.relative(cheatsheetsDir, filePath);
      const parts = rel.split(path.sep);
      const product = parts[0] ?? '';
      const fileName = parts.at(-1) ?? '';
      const name = fileName.replace(/\.chson\.json$/i, '');
      const data = loadCheatsheet(filePath);
      return { product, name, filePath, data };
    })
    .filter((ref) => Boolean(ref.product) && Boolean(ref.name));
}

export function formatExample(example: unknown): string {
  if (example === null || example === undefined) return '';
  if (typeof example === 'string') return example;
  return JSON.stringify(example, null, 2);
}
