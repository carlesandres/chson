#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "json-schema-to-typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const typesDir = path.join(__dirname, "../types");

const schemas = [
  {
    version: "v1",
    schemaPath: path.join(__dirname, "../schema/v1/chson.schema.json"),
    outputPath: path.join(typesDir, "v1.d.ts"),
    typeName: "ChsonCheatsheetV1",
  },
  {
    version: "v2",
    schemaPath: path.join(__dirname, "../schema/v2/chson.schema.json"),
    outputPath: path.join(typesDir, "v2.d.ts"),
    typeName: "ChsonCheatsheet",
  },
];

async function generateTypes(config) {
  console.log(`Generating TypeScript types for ${config.version}...`);

  const schemaJson = JSON.parse(fs.readFileSync(config.schemaPath, "utf8"));

  const ts = await compile(schemaJson, config.typeName, {
    bannerComment: `/* eslint-disable */\n/**\n * Auto-generated from ${config.version}/chson.schema.json\n * Do not edit manually\n */`,
    additionalProperties: false,
    strictIndexSignatures: true,
    style: {
      semi: true,
      singleQuote: false,
    },
  });

  fs.writeFileSync(config.outputPath, ts, "utf8");
  console.log(`  → ${config.outputPath}`);
}

async function main() {
  console.log("Generating TypeScript types from JSON Schemas...\n");

  fs.mkdirSync(typesDir, { recursive: true });

  for (const config of schemas) {
    await generateTypes(config);
  }

  // Create index.d.ts that re-exports v2 as default
  const indexContent = `/* eslint-disable */
/**
 * Re-exports v2 types as default
 */
export * from "./v2";
export { ChsonCheatsheet as default } from "./v2";
`;
  fs.writeFileSync(path.join(typesDir, "index.d.ts"), indexContent, "utf8");
  console.log(`  → ${path.join(typesDir, "index.d.ts")}`);

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Failed to generate types:", err);
  process.exit(1);
});
