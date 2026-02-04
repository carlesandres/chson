import fs from "node:fs";
import path from "node:path";

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

function repoRootFromAppCwd(): string {
  // Turbo runs each package command with cwd set to the package directory.
  // This app lives at apps/site, so repo root is two levels up.
  return path.resolve(process.cwd(), "../..");
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
  const cheatsheetsDir = path.join(repoRootFromAppCwd(), "cheatsheets");
  if (!fs.existsSync(cheatsheetsDir)) return [];

  return listFilesRecursive(cheatsheetsDir).filter((p) => p.endsWith(".chson.json"));
}

export function loadCheatsheet(filePath: string): Cheatsheet {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

export function getAllCheatsheets(): CheatsheetRef[] {
  const cheatsheetsDir = path.join(repoRootFromAppCwd(), "cheatsheets");

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
