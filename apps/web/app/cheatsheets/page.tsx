import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllCheatsheets } from 'lib/cheatsheets';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Badge } from 'components/ui/badge';

export const metadata: Metadata = {
  title: 'Cheatsheets | ChSON',
  description: 'Browse example cheatsheets in ChSON format.',
};

export default function CheatsheetsPage() {
  const all = getAllCheatsheets().sort((a, b) => {
    const ap = a.product.localeCompare(b.product);
    if (ap !== 0) return ap;
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      <h1 className="font-display text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.03em]">
        Cheatsheets
      </h1>
      <p className="mt-3 text-muted-foreground">
        Source of truth lives in{' '}
        <code className="rounded bg-muted px-1 font-mono">cheatsheets/**</code>{' '}
        as <code className="rounded bg-muted px-1 font-mono">.chson.json</code>.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {all.map((s) => (
          <Link
            key={`${s.product}/${s.name}`}
            href={`/cheatsheets/${s.product}/${s.name}`}
            className="group"
          >
            <Card className="h-full min-h-[120px] border-border/50 bg-card/70 shadow-soft backdrop-blur transition-all hover:border-border hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-semibold group-hover:text-primary">
                    {s.data.title}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="shrink-0 font-mono text-xs"
                  >
                    {s.product}/{s.name}
                  </Badge>
                </div>
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
    </>
  );
}
