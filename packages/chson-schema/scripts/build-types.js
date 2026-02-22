#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "json-schema-to-typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const typesDir = path.join(__dirname, "../types");

const schemaPath = path.join(__dirname, "../schema/chson.schema.json");
const outputPath = path.join(typesDir, "index.d.ts");
const typeName = "ChsonDocument";

async function generateTypes() {
  console.log("Generating TypeScript types from JSON Schema...\n");

  fs.mkdirSync(typesDir, { recursive: true });

  const schemaJson = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

  const ts = await compile(schemaJson, typeName, {
    bannerComment: `/* eslint-disable */\n/**\n * Auto-generated from chson.schema.json\n * Do not edit manually\n */`,
    additionalProperties: false,
    strictIndexSignatures: true,
    style: {
      semi: true,
      singleQuote: false,
    },
  });

  fs.writeFileSync(outputPath, ts, "utf8");
  console.log(`  → ${outputPath}`);

  console.log("\nDone.");
}

generateTypes().catch((err) => {
  console.error("Failed to generate types:", err);
  process.exit(1);
});
