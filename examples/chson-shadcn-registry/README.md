# ChSON shadcn Registry Example

This directory is a prototype of a shadcn-compatible registry that distributes `.chson.json` files.

## Commands

```bash
npm install
npm run registry:build
npm run registry:check
```

`registry:build` generates `public/r/*.json` payloads that can be installed with the `shadcn` CLI.

## Local Test

Serve the registry locally:

```bash
npm run registry:serve
```

Then install an item in another project:

```bash
npx shadcn@latest add https://chson-registry.localhost/r/git-core.json
npx shadcn@latest add https://chson-registry.localhost/r/git-pack.json
```

The file is installed into `~/chson-files/...` based on each item's `target` path.

`git-pack` is an aggregate item that installs multiple cheatsheets through `registryDependencies`.
