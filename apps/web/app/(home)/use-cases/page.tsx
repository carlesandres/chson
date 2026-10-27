import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllCheatsheets } from 'lib/cheatsheets';
import { Card, CardContent, CardHeader, CardTitle } from '@chson/ui/shadcn/card';

export const metadata: Metadata = {
  title: 'Use Cases | ChSON',
  description: 'Browse the ChSON cheatsheets in the registry.',
};

export default function UseCasesPage() {
  const all = getAllCheatsheets().sort((a, b) => {
    const ap = a.product.localeCompare(b.product);
    if (ap !== 0) return ap;
    return a.name.localeCompare(b.name);
  });

  return (
    <section className="space-y-8">
      <div>
        <h1 className="font-display text-[length:var(--text-display-title)] font-semibold tracking-[var(--tracking-display)]">
          Use cases
        </h1>
        <p className="mt-3 max-w-[var(--max-w-prose)] text-muted-foreground">
          Fast lookup references for commands, shortcuts, and syntax, loaded
          directly from files in the registry.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {all.map((s) => (
          <Link
            key={`${s.product}/${s.name}`}
            href={`/cheatsheets/${s.product}/${s.name}`}
            className="group"
          >
            <Card className="h-full min-h-30 border-border/50 bg-card/70 shadow-soft backdrop-blur transition-all hover:border-border hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold group-hover:text-primary">
                  {s.data.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {s.data.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
