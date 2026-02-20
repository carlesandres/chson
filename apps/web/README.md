# Description

This project template includes a scaffold web app with the following:

Main app dependencies:

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com)

And developer tools:

- [Oxlint](https://oxc.rs/docs/guide/usage/oxlint)
- [Stylelint](https://stylelint.io/)
- [Husky](https://github.com/typicode/husky)

## Installation

```bash
bunx degit carlesandres/project-template-supabase
```

```bash
pnpm dlx degit carlesandres/project-template-supabase <projectname>
```

```bash
npx degit carlesandres/project-template-supabase <projectname>
```

```bash
yarn dlx degit carlesandres/project-template-supabase <projectname>
```

## Configuration

You will need to setup project in [Supabase](app.supabase.com) and follow their
instructions to populate the following .env vars:

```.env
NEXT_PUBLIC_SUPABASE_URL=<some-value>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<some-other-value>
```
