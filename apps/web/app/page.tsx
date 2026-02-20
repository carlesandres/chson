import Link from 'next/link';
import { getAllCheatsheets } from 'lib/cheatsheets';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { ArrowRight } from 'lucide-react';

const schemaUrl = 'https://chson.dev/schema/v2/chson.schema.json';

export default function Home() {
  const sheets = getAllCheatsheets().slice(0, 4);

  return (
    <section>
      <h1 className="font-display text-[clamp(34px,6vw,56px)] font-semibold leading-[1.05] tracking-[-0.03em]">
        Cheatsheets that tools can understand.
      </h1>
      <p className="mt-3 max-w-[68ch] text-muted-foreground">
        ChSON is a small JSON format for writing software cheatsheets in a
        consistent, tool-friendly way.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-border/50 bg-card/70 shadow-soft backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold tracking-wide">
              Quick example
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-auto rounded-xl border border-border bg-muted/50 p-4">
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
            <p className="mt-2 text-xs text-muted-foreground">
              Add <code className="rounded bg-muted px-1 font-mono">$schema</code>{' '}
              for editor autocompletion.{' '}
              <Link
                href="/docs"
                className="text-primary underline-offset-4 hover:underline"
              >
                Learn more
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/70 shadow-soft backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold tracking-wide">
              Browse cheatsheets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Start with a few essentials from the registry:
            </p>
            <ul className="mt-3 grid gap-2">
              {sheets.map((s) => (
                <li key={`${s.product}/${s.name}`}>
                  <Link
                    className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-border bg-background/60 px-3 py-2 transition-colors hover:border-border/80 hover:bg-background/80 hover:no-underline"
                    href={`/cheatsheets/${s.product}/${s.name}`}
                  >
                    <span className="font-semibold">{s.data.title}</span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {s.product}/{s.name}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-3 gap-2" variant="outline">
              <Link href="/cheatsheets">
                See all cheatsheets
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-7 border-border/50 bg-card/60">
        <CardContent className="p-5">
          <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-sm font-semibold tracking-wide">CLI</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Validate and render cheatsheets from the repo.
              </p>
            </div>
            <pre className="overflow-auto rounded-xl border border-border bg-muted/50 p-3">
              <code className="font-mono text-[13px]">{`npm run validate
npm run render`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
