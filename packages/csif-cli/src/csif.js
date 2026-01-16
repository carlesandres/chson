#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

function usage() {
  return [
    "CSIF CLI",
    "",
    "Usage:",
    "  csif validate <file-or-dir> [...more]",
    "  csif render markdown <file-or-dir> [...more] [--out <dir>]",
    "",
    "Notes:",
    "  - If a directory is provided, scans for *.csif.json recursively.",
    "  - render outputs 2-column Markdown tables.",
  ].join("\n");
}

function collectCsifFiles(inputPath) {
  const results = [];

  function walk(currentPath) {
    const stat = fs.statSync(currentPath);

    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(currentPath)) {
        walk(path.join(currentPath, entry));
      }
      return;
    }

    if (stat.isFile() && currentPath.endsWith(".csif.json")) {
      results.push(currentPath);
    }
  }

  walk(inputPath);
  return results;
}

function parseJsonFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  try {
    return JSON.parse(raw);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON in ${filePath}: ${message}`);
  }
}

function findUp(startDir, relativePath) {
  let dir = startDir;
  for (;;) {
    const candidate = path.join(dir, relativePath);
    if (fs.existsSync(candidate)) return candidate;

    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return null;
}

function loadSchema() {
  const thisFile = fileURLToPath(import.meta.url);
  const startDir = path.dirname(thisFile);

  const schemaPath = findUp(startDir, path.join("schema", "v1", "csif.schema.json"));
  if (!schemaPath) {
    throw new Error(
      `Could not locate CSIF schema (expected schema/v1/csif.schema.json). Started from: ${startDir}`,
    );
  }

  return { schemaPath, schema: parseJsonFile(schemaPath) };
}

function escapeMarkdown(text) {
  return String(text)
    .replaceAll("\\", "\\\\")
    .replaceAll("|", "\\|")
    // Docusaurus treats .md as MDX; escape braces/angles to avoid MDX expressions/JSX.
    .replaceAll("{", "&#123;")
    .replaceAll("}", "&#125;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\r\n", "\n")
    .replaceAll("\r", "\n")
    .replaceAll("\n", "<br/>");
}

function renderMarkdownTable(csif) {
  const lines = [];
  lines.push(`# ${escapeMarkdown(csif.title ?? "")}`);
  lines.push("");

  if (csif.version) {
    lines.push(`Version: ${escapeMarkdown(csif.version)}`);
  }
  if (csif.publicationDate) {
    lines.push(`Published: ${escapeMarkdown(csif.publicationDate)}`);
  }
  if (csif.description) {
    lines.push("");
    lines.push(escapeMarkdown(csif.description));
  }

  const sections = Array.isArray(csif.sections) ? csif.sections : [];
  for (const section of sections) {
    lines.push("");
    lines.push(`## ${escapeMarkdown(section.title ?? "")}`);

    if (section.description) {
      lines.push("");
      lines.push(escapeMarkdown(section.description));
    }

    lines.push("");
    lines.push("| Example | Description |");
    lines.push("| --- | --- |");

    const items = Array.isArray(section.items) ? section.items : [];
    for (const item of items) {
      let example = "";
      if (item.example !== undefined) {
        if (typeof item.example === "string") {
          example = item.example;
        } else {
          example = JSON.stringify(item.example, null, 2);
        }
      } else if (item.title !== undefined) {
        example = String(item.title);
      }

      const lhs = example ? `<pre>${escapeMarkdown(example)}</pre>` : "";
      const rhs = escapeMarkdown(item.description ?? "");

      lines.push(`| ${lhs} | ${rhs} |`);
    }
  }

  lines.push("");
  return lines.join("\n");
}

function validateFiles(filePaths) {
  const { schemaPath, schema } = loadSchema();
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);

  const validate = ajv.compile(schema);

  let ok = true;
  for (const filePath of filePaths) {
    const data = parseJsonFile(filePath);
    const valid = validate(data);

    if (!valid) {
      ok = false;
      console.error(`✗ ${filePath}`);
      console.error(`  schema: ${schemaPath}`);
      for (const err of validate.errors ?? []) {
        console.error(`  - ${err.instancePath || "/"}: ${err.message}`);
      }
    } else {
      console.log(`✓ ${filePath}`);
    }
  }

  return ok;
}

function writeRenderedMarkdown(outputDir, inputFilePath, markdown, baseDir) {
  if (!outputDir) {
    process.stdout.write(markdown);
    return;
  }

  const relativePath = path.relative(baseDir, inputFilePath);
  const relativeMarkdownPath = relativePath.replace(/\.csif\.json$/i, ".md");
  const outPath = path.join(outputDir, relativeMarkdownPath);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, markdown, "utf8");
  console.log(outPath);
}

function main(argv) {
  const [command, subcommand, ...rest] = argv;

  if (!command || command === "-h" || command === "--help") {
    console.log(usage());
    return 0;
  }

  if (command === "validate") {
    const inputs = [subcommand, ...rest].filter(Boolean);
    if (inputs.length === 0) {
      console.error(usage());
      return 2;
    }

    const files = [];
    for (const input of inputs) {
      if (!fs.existsSync(input)) {
        console.error(`Path not found: ${input}`);
        return 2;
      }
      const stat = fs.statSync(input);
      if (stat.isDirectory()) {
        files.push(...collectCsifFiles(input));
      } else {
        files.push(input);
      }
    }

    const ok = validateFiles(files);
    return ok ? 0 : 1;
  }

  if (command === "render") {
    if (subcommand !== "markdown") {
      console.error("Only supported: csif render markdown ...");
      return 2;
    }

    let outputDir;
    const inputs = [];

    for (let i = 0; i < rest.length; i++) {
      const arg = rest[i];
      if (arg === "--out") {
        outputDir = rest[i + 1];
        i++;
        continue;
      }
      inputs.push(arg);
    }

    if (inputs.length === 0) {
      console.error(usage());
      return 2;
    }

    const renderTargets = [];
    for (const input of inputs) {
      if (!fs.existsSync(input)) {
        console.error(`Path not found: ${input}`);
        return 2;
      }
      const stat = fs.statSync(input);
      if (stat.isDirectory()) {
        for (const filePath of collectCsifFiles(input)) {
          renderTargets.push({ filePath, baseDir: input });
        }
      } else {
        renderTargets.push({ filePath: input, baseDir: path.dirname(input) });
      }
    }

    for (const { filePath, baseDir } of renderTargets) {
      const csif = parseJsonFile(filePath);
      const markdown = renderMarkdownTable(csif);
      writeRenderedMarkdown(outputDir, filePath, markdown, baseDir);
    }

    return 0;
  }

  console.error(usage());
  return 2;
}

process.exitCode = main(process.argv.slice(2));
