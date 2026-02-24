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
    "  chson registry init <file-or-dir> [...more] [--out <dir>] [--target-base <dir>] [--namespace <name>] [--homepage <url>] [--packs <mode>] [--fail-on-collision]",
    "",
    "Notes:",
    "  - If a directory is provided, scans for *.chson.json recursively.",
    "  - render outputs 2-column Markdown tables.",
    "  - registry init generates a shadcn-compatible registry source tree.",
    "  - --packs supports: none (default), by-directory",
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

function toPosixPath(inputPath) {
  return inputPath.split(path.sep).join("/");
}

function stripChsonExtension(filePath) {
  return filePath.replace(/\.chson\.json$/i, "");
}

function toKebabCase(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "")
    .replaceAll(/-{2,}/g, "-");
}

function uniqueSlug(baseSlug, seen) {
  if (!seen.has(baseSlug)) {
    seen.add(baseSlug);
    return baseSlug;
  }

  let index = 2;
  while (seen.has(`${baseSlug}-${index}`)) {
    index += 1;
  }

  const next = `${baseSlug}-${index}`;
  seen.add(next);
  return next;
}

function titleCase(input) {
  return String(input)
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((chunk) => `${chunk[0].toUpperCase()}${chunk.slice(1).toLowerCase()}`)
    .join(" ");
}

function requireFlagValue(args, index, flagName) {
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${flagName}`);
  }
  return value;
}

function collectRegistrySources(inputs) {
  const sources = [];
  for (const input of inputs) {
    if (!fs.existsSync(input)) {
      throw new Error(`Path not found: ${input}`);
    }

    const stat = fs.statSync(input);
    if (stat.isDirectory()) {
      for (const filePath of collectChsonFiles(input)) {
        sources.push({
          filePath,
          relativePath: toPosixPath(path.relative(input, filePath)),
        });
      }
    } else {
      if (!input.endsWith(".chson.json")) {
        throw new Error(`Expected a .chson.json file: ${input}`);
      }
      const parentDirName = path.basename(path.dirname(input));
      sources.push({
        filePath: input,
        relativePath: toPosixPath(
          path.join(parentDirName, path.basename(input)),
        ),
      });
    }
  }

  return sources;
}

function parseRegistryInitArgs(args) {
  let outputDir = "registry";
  let targetBase = "chson-files";
  let namespace = "@chson";
  let homepage = "https://chson.dev";
  let packs = "none";
  let failOnCollision = false;
  const inputs = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--out") {
      outputDir = requireFlagValue(args, i, "--out");
      i += 1;
      continue;
    }

    if (arg === "--target-base") {
      targetBase = requireFlagValue(args, i, "--target-base");
      i += 1;
      continue;
    }

    if (arg === "--namespace") {
      namespace = requireFlagValue(args, i, "--namespace");
      i += 1;
      continue;
    }

    if (arg === "--homepage") {
      homepage = requireFlagValue(args, i, "--homepage");
      i += 1;
      continue;
    }

    if (arg === "--packs") {
      packs = requireFlagValue(args, i, "--packs");
      i += 1;
      continue;
    }

    if (arg === "--fail-on-collision") {
      failOnCollision = true;
      continue;
    }

    inputs.push(arg);
  }

  if (!namespace.startsWith("@")) {
    throw new Error("--namespace must start with '@' (example: @chson)");
  }

  if (packs !== "none" && packs !== "by-directory") {
    throw new Error("--packs must be one of: none, by-directory");
  }

  if (!outputDir || !targetBase || !homepage || inputs.length === 0) {
    throw new Error(usage());
  }

  return {
    outputDir,
    targetBase,
    namespace,
    homepage,
    packs,
    failOnCollision,
    inputs,
  };
}

function buildRegistryItems(sources, { targetBase, packs, failOnCollision }) {
  const fileItems = [];
  const seenNames = new Set();

  const sortedSources = [...sources].sort((left, right) =>
    left.relativePath.localeCompare(right.relativePath),
  );

  const prepared = sortedSources.map((source) => {
    const relativeInputPath = source.relativePath;
    const withoutExt = stripChsonExtension(relativeInputPath);
    const slugBase =
      toKebabCase(withoutExt.replaceAll("/", "-")) || "chson-item";
    return {
      source,
      relativeInputPath,
      withoutExt,
      slugBase,
    };
  });

  if (failOnCollision) {
    const collisions = new Map();
    for (const entry of prepared) {
      if (!collisions.has(entry.slugBase)) {
        collisions.set(entry.slugBase, []);
      }
      collisions.get(entry.slugBase).push(entry.source.filePath);
    }

    const conflictLines = [];
    for (const [slug, filePaths] of collisions.entries()) {
      if (filePaths.length > 1) {
        conflictLines.push(`- ${slug}: ${filePaths.join(", ")}`);
      }
    }

    if (conflictLines.length > 0) {
      throw new Error(
        `Item name collisions detected (rerun without --fail-on-collision to auto-suffix):\n${conflictLines.join("\n")}`,
      );
    }
  }

  const itemsByGroup = new Map();

  for (const entry of prepared) {
    const itemName = uniqueSlug(entry.slugBase, seenNames);

    const chson = parseJsonFile(entry.source.filePath);
    const title = chson.title || itemName;
    const description = chson.description || `Installs ${title} ChSON file.`;
    const tags = Array.isArray(chson.tags)
      ? chson.tags.filter((tag) => typeof tag === "string" && tag.length > 0)
      : [];

    const groupKey = path.posix.dirname(entry.withoutExt);
    if (!itemsByGroup.has(groupKey)) {
      itemsByGroup.set(groupKey, []);
    }
    itemsByGroup.get(groupKey).push(itemName);

    const sourcePath = `registry/default/${entry.withoutExt}.chson.json`;
    const targetPath = `~/${toPosixPath(path.join(targetBase, `${entry.withoutExt}.chson.json`))}`;

    const categories = [];
    if (chson.documentType) {
      categories.push(chson.documentType);
    }
    const productCategory = entry.withoutExt.split("/")[0];
    if (productCategory) {
      categories.push(productCategory);
    }

    fileItems.push({
      name: itemName,
      type: "registry:item",
      title,
      description,
      categories: Array.from(new Set(categories)),
      keywords: Array.from(new Set(tags)),
      meta: {
        publicationDate: chson.publicationDate,
        retrievalDirection: chson.retrievalDirection,
        version: chson.version,
        homepage: chson.homepage,
        documentType: chson.documentType,
      },
      files: [
        {
          path: sourcePath,
          type: "registry:file",
          target: targetPath,
        },
      ],
      _meta: {
        inputFilePath: entry.source.filePath,
        sourcePath,
      },
    });
  }

  const packItems = [];
  if (packs === "by-directory") {
    const groups = [...itemsByGroup.entries()].sort(([left], [right]) =>
      left.localeCompare(right),
    );

    for (const [groupKey, groupItems] of groups) {
      if (groupItems.length < 2) {
        continue;
      }

      const basePackSlug = `${toKebabCase(groupKey.replaceAll("/", "-")) || "root"}-pack`;
      const packName = uniqueSlug(basePackSlug, seenNames);
      const groupLabel =
        groupKey === "." ? "Root" : titleCase(groupKey.replaceAll("/", " "));

      packItems.push({
        name: packName,
        type: "registry:item",
        title: `${groupLabel} Pack`,
        description: `Installs ${groupItems.length} ChSON files from ${groupKey === "." ? "the root group" : groupKey}.`,
        categories: ["pack"],
        meta: {
          packStrategy: "by-directory",
          group: groupKey,
          itemCount: groupItems.length,
        },
        registryDependencies: [...groupItems].sort((left, right) =>
          left.localeCompare(right),
        ),
      });
    }
  }

  return {
    items: [...fileItems, ...packItems],
    stats: {
      files: fileItems.length,
      packs: packItems.length,
    },
  };
}

function writeRegistrySource({ outputDir, namespace, homepage, items }) {
  fs.mkdirSync(outputDir, { recursive: true });

  for (const item of items) {
    if (!item._meta) {
      continue;
    }
    const absoluteSourcePath = path.join(outputDir, item._meta.sourcePath);
    fs.mkdirSync(path.dirname(absoluteSourcePath), { recursive: true });
    fs.copyFileSync(item._meta.inputFilePath, absoluteSourcePath);
  }

  const cleanedItems = items.map(({ _meta, ...item }) => item);
  const registryName = namespace.replace(/^@/, "") || "chson";

  const registryJson = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: registryName,
    homepage,
    items: cleanedItems,
  };

  const registryPath = path.join(outputDir, "registry.json");
  fs.writeFileSync(
    registryPath,
    `${JSON.stringify(registryJson, null, 2)}\n`,
    "utf8",
  );
}

function initRegistry(args) {
  const {
    outputDir,
    targetBase,
    namespace,
    homepage,
    packs,
    failOnCollision,
    inputs,
  } = parseRegistryInitArgs(args);
  const sources = collectRegistrySources(inputs);
  const { items, stats } = buildRegistryItems(sources, {
    targetBase,
    packs,
    failOnCollision,
  });
  writeRegistrySource({ outputDir, namespace, homepage, items });

  console.log(`Created registry source in ${outputDir}`);
  console.log(`Generated ${items.length} items`);
  if (stats.packs > 0) {
    console.log(`Generated ${stats.packs} pack items`);
  }
}

function escapeMarkdown(text) {
  return (
    String(text)
      .replaceAll("\\", "\\\\")
      .replaceAll("|", "\\|")
      // Docusaurus treats .md as MDX; escape braces/angles to avoid MDX expressions/JSX.
      .replaceAll("{", "&#123;")
      .replaceAll("}", "&#125;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\r\n", "\n")
      .replaceAll("\r", "\n")
      .replaceAll("\n", "<br/>")
  );
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
    lines.push(
      `*Retrieval direction: ${escapeMarkdown(chson.retrievalDirection)}*`,
    );
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
    lines.push(
      `| ${escapeMarkdown(anchorLabel)} | ${escapeMarkdown(contentLabel)} |`,
    );
    lines.push("| --- | --- |");

    const entries = Array.isArray(section.entries) ? section.entries : [];
    for (const entry of entries) {
      const anchor = entry.anchor ?? "";
      const content = entry.content ?? "";
      const details = entry.details ?? "";
      const url = entry.url ?? "";

      let lhs, rhs;

      if (anchorIsMechanism) {
        // mechanism-to-meaning: anchor is code, content is text
        lhs = anchor ? `<pre>${escapeMarkdown(anchor)}</pre>` : "";
        // Build content cell with optional details and url
        const rhsParts = [];
        if (content) rhsParts.push(escapeMarkdown(content));
        if (details) rhsParts.push(escapeMarkdown(details));
        if (url) rhsParts.push(`[Link](${escapeMarkdown(url)})`);
        rhs = rhsParts.join("<br>");
      } else {
        // intent-to-mechanism: anchor is text, content is code
        // Build anchor cell with optional details and url
        const lhsParts = [];
        if (anchor) lhsParts.push(escapeMarkdown(anchor));
        if (details) lhsParts.push(escapeMarkdown(details));
        if (url) lhsParts.push(`[Link](${escapeMarkdown(url)})`);
        lhs = lhsParts.join("<br>");
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

  if (command === "registry") {
    if (subcommand !== "init") {
      console.error("Only supported: chson registry init ...");
      return 2;
    }

    try {
      initRegistry(rest);
      return 0;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(message);
      return 2;
    }
  }

  console.error(usage());
  return 2;
}

process.exitCode = main(process.argv.slice(2));
