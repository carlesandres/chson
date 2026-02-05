#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "json-schema-to-typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, "../schema/v1/chson.schema.json");
const outputPath = path.join(__dirname, "../types/index.d.ts");

async function main() {
  console.log("Generating TypeScript types from JSON Schema...");

  const schemaJson = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

  const ts = await compile(schemaJson, "ChsonCheatsheet", {
    bannerComment:
      "/* eslint-disable */\n/**\n * Auto-generated from chson.schema.json\n * Do not edit manually\n */",
    additionalProperties: false,
    strictIndexSignatures: true,
    style: {
      semi: true,
      singleQuote: false,
    },
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, ts, "utf8");

  console.log(`Types written to ${outputPath}`);
}

main().catch((err) => {
  console.error("Failed to generate types:", err);
  process.exit(1);
});
