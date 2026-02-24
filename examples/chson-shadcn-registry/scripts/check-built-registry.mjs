import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const registryRoot = path.join(cwd, "public", "r");
const registryIndexPath = path.join(registryRoot, "registry.json");

if (!fs.existsSync(registryIndexPath)) {
  throw new Error(`Missing built index: ${registryIndexPath}`);
}

const registryIndex = JSON.parse(fs.readFileSync(registryIndexPath, "utf8"));
if (!Array.isArray(registryIndex.items) || registryIndex.items.length === 0) {
  throw new Error("Built registry.json has no items");
}

for (const item of registryIndex.items) {
  if (!item.name) {
    throw new Error("Encountered item without a name in built registry index");
  }

  const itemFilePath = path.join(registryRoot, `${item.name}.json`);
  if (!fs.existsSync(itemFilePath)) {
    throw new Error(`Missing item payload: ${itemFilePath}`);
  }

  JSON.parse(fs.readFileSync(itemFilePath, "utf8"));
}

console.log(
  `Registry build check passed with ${registryIndex.items.length} items.`,
);
