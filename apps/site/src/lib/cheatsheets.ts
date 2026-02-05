import fs from "node:fs";
import path from "node:path";

// Keep local type definitions for backwards compatibility
// These match the schema but are defined locally for simplicity
export type CheatsheetItem = {
  title: string;
  description: string;
  example?: unknown;
  comments?: unknown;
};

export type CheatsheetSection = {
  title: string;
  description?: string;
  items: CheatsheetItem[];
};

export type Cheatsheet = {
  $schema?: string;
  title: string;
  version?: string;
  publicationDate: string;
  description: string;
  metadata?: Record<string, unknown>;
  sections: CheatsheetSection[];
};

export type CheatsheetRef = {
  product: string;
  name: string;
  filePath: string;
  data: Cheatsheet;
};

/**
 * Get the path to the cheatsheets directory in @chson/registry.
 * Uses the known monorepo structure.
 */
function getRegistryPath(): string {
  // Try repo root first (when run from repo root)
  const fromRepoRoot = path.join(process.cwd(), "packages/chson-registry/cheatsheets");
  if (fs.existsSync(fromRepoRoot)) {
    return fromRepoRoot;
  }

  // Try from apps/site (when turbo runs from workspace directory)
  const fromSite = path.join(process.cwd(), "../../packages/chson-registry/cheatsheets");
  if (fs.existsSync(fromSite)) {
    return path.resolve(fromSite);
  }

  throw new Error(
    `Could not find cheatsheets at ${fromRepoRoot} or ${fromSite}. ` +
      `Ensure you're running from the repo root or apps/site.`
  );
}

function listFilesRecursive(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
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

  return listFilesRecursive(cheatsheetsDir).filter((p) => p.endsWith(".chson.json"));
}

export function loadCheatsheet(filePath: string): Cheatsheet {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

export function getAllCheatsheets(): CheatsheetRef[] {
  const cheatsheetsDir = getRegistryPath();

  return listCheatsheetPaths()
    .map((filePath) => {
      const rel = path.relative(cheatsheetsDir, filePath);
      const parts = rel.split(path.sep);
      const product = parts[0] ?? "";
      const fileName = parts.at(-1) ?? "";
      const name = fileName.replace(/\.chson\.json$/i, "");
      const data = loadCheatsheet(filePath);
      return { product, name, filePath, data };
    })
    .filter((ref) => Boolean(ref.product) && Boolean(ref.name));
}

export function formatExample(example: unknown): string {
  if (example === null || example === undefined) return "";
  if (typeof example === "string") return example;
  return JSON.stringify(example, null, 2);
}
