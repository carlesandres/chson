# @chson/ui

React components for rendering ChSON documents.

## Installation

```bash
npm install @chson/ui
```

## Requirements

- React 18+ (React 19 supported)
- Tailwind CSS in the consuming app (components are className-based)

## Usage

```tsx
import type { ChSONDocument } from '@chson/schema'
import { Cheatsheet } from '@chson/ui'

export function Page({ data }: { data: ChSONDocument }) {
  return <Cheatsheet data={data} />
}
```

## Layout

`Cheatsheet` renders each section as a table: anchor | content | an optional **More** popover for `details` and `url`.

## Exports

- `@chson/ui`: the `Cheatsheet` renderer and its primitives
- `@chson/ui/core`: headless helpers (format inference, normalization, etc.)
- `@chson/ui/shadcn/*`: internal UI primitives used by renderers and the reference app
