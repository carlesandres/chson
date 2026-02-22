#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

// Import schema from workspace package
import schema from "@chson/schema" with { type: "json" };

function usage() {
  return [
    "ChSON CLI",
    "",
    "Usage:",
    "  chson validate <file-or-dir> [...more]",
    "  chson render markdown <file-or-dir> [...more] [--out <dir>]",
    "",
    "Notes:",
    "  - If a directory is provided, scans for *.chson.json recursively.",
    "  - render outputs 2-column Markdown tables.",
  ].join("\n");
}

function collectChsonFiles(inputPath) {
  const results = [];

  function walk(currentPath) {
    const stat = fs.statSync(currentPath);

    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(currentPath)) {
        walk(path.join(currentPath, entry));
      }
      return;
    }

    if (stat.isFile() && currentPath.endsWith(".chson.json")) {
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

/**
 * Render ChSON format: entries with anchor, content, optional details/url
 * Applies <pre> formatting to mechanism column based on retrievalDirection
 */
function renderMarkdownTable(chson) {
  const lines = [];
  lines.push(`# ${escapeMarkdown(chson.title ?? "")}`);
  lines.push("");

  if (chson.version) {
    lines.push(`Version: ${escapeMarkdown(chson.version)}`);
  }
  if (chson.publicationDate) {
    lines.push(`Published: ${escapeMarkdown(chson.publicationDate)}`);
  }
  if (chson.description) {
    lines.push("");
    lines.push(escapeMarkdown(chson.description));
  }
  if (chson.retrievalDirection) {
    lines.push("");
    lines.push(`*Retrieval direction: ${escapeMarkdown(chson.retrievalDirection)}*`);
  }

  const anchorLabel = chson.anchorLabel ?? "Anchor";
  const contentLabel = chson.contentLabel ?? "Content";
  const retrievalDirection = chson.retrievalDirection ?? "mechanism-to-meaning";

  // Determine which column contains the mechanism (code) vs intent (text)
  // - mechanism-to-meaning: anchor is mechanism (code), content is meaning (text)
  // - intent-to-mechanism: anchor is intent (text), content is mechanism (code)
  const anchorIsMechanism = retrievalDirection === "mechanism-to-meaning";

  const sections = Array.isArray(chson.sections) ? chson.sections : [];
  for (const section of sections) {
    lines.push("");
    lines.push(`## ${escapeMarkdown(section.title ?? "")}`);

    if (section.description) {
      lines.push("");
      lines.push(escapeMarkdown(section.description));
    }

    lines.push("");
    lines.push(`| ${escapeMarkdown(anchorLabel)} | ${escapeMarkdown(contentLabel)} |`);
    lines.push("| --- | --- |");

    const entries = Array.isArray(section.entries) ? section.entries : [];
    for (const entry of entries) {
      const anchor = entry.anchor ?? "";
      const content = entry.content ?? "";

      let lhs, rhs;

      if (anchorIsMechanism) {
        // mechanism-to-meaning: anchor is code, content is text
        lhs = anchor ? `<pre>${escapeMarkdown(anchor)}</pre>` : "";
        rhs = escapeMarkdown(content);
      } else {
        // intent-to-mechanism: anchor is text, content is code
        lhs = anchor ? `${escapeMarkdown(anchor)}` : "";
        rhs = content ? `<pre>${escapeMarkdown(content)}</pre>` : "";
      }

      lines.push(`| ${lhs} | ${rhs} |`);
    }
  }

  lines.push("");
  return lines.join("\n");
}

function validateFiles(filePaths) {
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
  const relativeMarkdownPath = relativePath.replace(/\.chson\.json$/i, ".md");
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
        files.push(...collectChsonFiles(input));
      } else {
        files.push(input);
      }
    }

    const ok = validateFiles(files);
    return ok ? 0 : 1;
  }

  if (command === "render") {
    if (subcommand !== "markdown") {
      console.error("Only supported: chson render markdown ...");
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
        for (const filePath of collectChsonFiles(input)) {
          renderTargets.push({ filePath, baseDir: input });
        }
      } else {
        renderTargets.push({ filePath: input, baseDir: path.dirname(input) });
      }
    }

    for (const { filePath, baseDir } of renderTargets) {
      const chson = parseJsonFile(filePath);
      const markdown = renderMarkdownTable(chson);
      writeRenderedMarkdown(outputDir, filePath, markdown, baseDir);
    }

    return 0;
  }

  console.error(usage());
  return 2;
}

process.exitCode = main(process.argv.slice(2));
