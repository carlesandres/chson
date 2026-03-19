#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.join(__dirname, "..");
const cheatsheetsDir = path.join(packageRoot, "cheatsheets");
const outputPath = path.join(packageRoot, "index.json");

function listFilesRecursive(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      results.push(...listFilesRecursive(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".chson.json")) {
      results.push(entryPath);
    }
  }
  return results;
}

function buildIndex() {
  console.log("Building cheatsheet index...\n");

  const files = listFilesRecursive(cheatsheetsDir);
  const cheatsheets = [];

  for (const filePath of files) {
    const rel = path.relative(cheatsheetsDir, filePath);
    const parts = rel.split(path.sep);
    const product = parts[0];
    const fileName = parts.at(-1);
    const name = fileName.replace(/\.chson\.json$/, "");

    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);

    cheatsheets.push({
      product,
      name,
      path: path.posix.join("cheatsheets", ...parts),
      title: data.title,
      description: data.description,
      version: data.version ?? null,
      publicationDate: data.publicationDate,
      documentType: data.documentType ?? null,
      retrievalDirection: data.retrievalDirection ?? null,
      tags: data.tags ?? [],
    });
  }

  // Sort: product asc, then name asc
  cheatsheets.sort((a, b) =>
    a.product.localeCompare(b.product) || a.name.localeCompare(b.name)
  );

  const index = {
    generatedAt: new Date().toISOString(),
    count: cheatsheets.length,
    cheatsheets,
  };

  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2) + "\n", "utf8");

  console.log(`  → index.json (${cheatsheets.length} cheatsheets)`);
  for (const cs of cheatsheets) {
    console.log(`    ${cs.product}/${cs.name} — ${cs.title}`);
  }
  console.log("\nDone.");
}

buildIndex();
