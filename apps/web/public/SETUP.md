## Favicon Setup (Next.js App Router)

This app uses Next.js metadata file conventions as the only favicon source.

Canonical files:

```
apps/web/app/icon.svg
apps/web/app/favicon.ico
apps/web/app/apple-icon.png
```

Notes:

- Do not add favicon files in `public/` for normal usage.
- Do not add manual icon `<link>` tags in `layout.tsx`.
- Next.js auto-injects icon links from files in `app/`.

Regenerate `favicon.ico` and `apple-icon.png` from `icon.svg`:

```bash
npm run favicon --workspace=@chson/web
```

Verification:

- Run `npm run dev --workspace=@chson/web`.
- Open `/` and `/docs`.
- Confirm the tab icon is the same on both routes.
