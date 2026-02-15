import Link from "next/link";
import { getAllCheatsheets } from "@/lib/cheatsheets";

const schemaUrl = "https://chson.dev/schema/v2/chson.schema.json";

export default function Home() {
  const sheets = getAllCheatsheets().slice(0, 4);

  return (
    <section>
      <h1 className="font-display text-[clamp(34px,6vw,56px)] font-semibold leading-[1.05] tracking-[-0.03em]">
        Cheatsheets that tools can understand.
      </h1>
      <p className="mt-3 max-w-[68ch] text-zinc-600">
        ChSON is a small JSON format for writing software cheatsheets in a consistent,
        tool-friendly way.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-black/10 bg-white/70 p-5 shadow-soft backdrop-blur">
          <h2 className="text-sm font-semibold tracking-wide text-zinc-800">Quick example</h2>
          <pre className="mt-3 overflow-auto rounded-xl border border-black/10 bg-black/[0.04] p-4">
            <code className="font-mono text-[13px]">{`{
  "$schema": "${schemaUrl}",
  "title": "Git Essentials",
  "publicationDate": "2026-01-16",
  "description": "Essential git commands.",
  "sections": [
    {
      "title": "Basics",
      "entries": [
        {
          "anchor": "git status",
          "content": "Show working tree status."
        }
      ]
    }
  ]
}`}</code>
          </pre>
          <p className="mt-2 text-xs text-zinc-600">
            Add <code className="font-mono">$schema</code> for editor autocompletion.{" "}
            <Link href="/docs" className="text-blue-700 hover:text-blue-800">
              Learn more →
            </Link>
          </p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white/70 p-5 shadow-soft backdrop-blur">
          <h2 className="text-sm font-semibold tracking-wide text-zinc-800">Browse cheatsheets</h2>
          <p className="mt-2 text-sm text-zinc-600">Start with a few essentials from the registry:</p>
          <ul className="mt-3 grid gap-2">
            {sheets.map((s) => (
              <li key={`${s.product}/${s.name}`}>
                <Link
                  className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-black/10 bg-white/60 px-3 py-2 hover:border-black/20 hover:no-underline"
                  href={`/cheatsheets/${s.product}/${s.name}`}
                >
                  <span className="font-semibold">{s.data.title}</span>
                  <span className="text-xs text-zinc-600">{s.product}/{s.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            className="mt-3 inline-flex items-center justify-center rounded-xl border border-black/15 bg-blue-700/10 px-3 py-2 text-sm font-medium hover:bg-blue-700/15 hover:no-underline"
            href="/cheatsheets"
          >
            See all cheatsheets
          </Link>
        </div>
      </div>

      <section className="mt-7 rounded-2xl border border-black/10 bg-white/60 p-5">
        <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-zinc-800">CLI</h2>
            <p className="mt-1 text-sm text-zinc-600">Validate and render cheatsheets from the repo.</p>
          </div>
          <pre className="overflow-auto rounded-xl border border-black/10 bg-black/[0.04] p-3">
            <code className="font-mono text-[13px]">{`npm run validate
npm run render`}</code>
          </pre>
        </div>
      </section>
    </section>
  );
}
