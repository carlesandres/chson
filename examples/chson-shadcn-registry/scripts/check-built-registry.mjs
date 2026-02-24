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

const itemNames = new Set(
  registryIndex.items
    .map((item) => item?.name)
    .filter((name) => typeof name === "string" && name.length > 0),
);

for (const item of registryIndex.items) {
  if (!item.name) {
    throw new Error("Encountered item without a name in built registry index");
  }

  const itemFilePath = path.join(registryRoot, `${item.name}.json`);
  if (!fs.existsSync(itemFilePath)) {
    throw new Error(`Missing item payload: ${itemFilePath}`);
  }

  const payload = JSON.parse(fs.readFileSync(itemFilePath, "utf8"));

  if (Array.isArray(payload.registryDependencies)) {
    for (const dependency of payload.registryDependencies) {
      if (!itemNames.has(dependency)) {
        throw new Error(
          `Item '${item.name}' references unknown registry dependency '${dependency}'`,
        );
      }
    }
  }
}

console.log(
  `Registry build check passed with ${registryIndex.items.length} items.`,
);
