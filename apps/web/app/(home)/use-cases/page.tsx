import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllCheatsheets } from 'lib/cheatsheets';
import { Badge } from '@chson/ui/shadcn/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@chson/ui/shadcn/card';

export const metadata: Metadata = {
  title: 'Use Cases | ChSON',
  description:
    'Explore how ChSON can be used for cheatsheets, checklists, runbooks, TLDRs, and bookmarks.',
};

type PlaceholderUseCase = {
  key: 'cheatsheet' | 'checklist' | 'runbook' | 'tldr' | 'bookmarks';
  title: string;
  description: string;
  suggestedFile: string;
};

const useCases: PlaceholderUseCase[] = [
  {
    key: 'cheatsheet',
    title: 'Cheatsheets',
    description: 'Fast lookup references for commands, shortcuts, and syntax.',
    suggestedFile:
      'packages/chson-registry/cheatsheets/<product>/<name>.chson.json',
  },
  {
    key: 'checklist',
    title: 'Checklists',
    description:
      'Task-oriented documents for repeatable workflows such as releases, onboarding, and incident drills.',
    suggestedFile:
      'packages/chson-registry/cheatsheets/devops/release-checklist.chson.json',
  },
  {
    key: 'runbook',
    title: 'Runbooks',
    description:
      'Operational procedures with clear diagnostics and recovery steps for production systems.',
    suggestedFile:
      'packages/chson-registry/cheatsheets/kubernetes/pod-troubleshooting-runbook.chson.json',
  },
  {
    key: 'tldr',
    title: 'TLDRs',
    description:
      'Compressed explanations for tools and concepts when you need fast orientation.',
    suggestedFile:
      'packages/chson-registry/cheatsheets/git/rebase-tldr.chson.json',
  },
  {
    key: 'bookmarks',
    title: 'Bookmarks',
    description:
      'Curated links with short context to quickly find trusted references and tools.',
    suggestedFile:
      'packages/chson-registry/cheatsheets/web/performance-bookmarks.chson.json',
  },
];

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
          ChSON supports multiple document patterns. Each section below maps to
          a `documentType` value and is populated directly from files in the
          registry.
        </p>
      </div>

      <div className="space-y-8">
        {useCases.map((useCase) => {
          const items = all.filter((item) => {
            const kind = item.data.documentType ?? 'cheatsheet';
            return kind === useCase.key;
          });

          return (
            <section
              key={useCase.key}
              className="space-y-4"
              id={useCase.key === 'cheatsheet' ? 'cheatsheets' : useCase.key}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">{useCase.title}</h2>
                <Badge variant={items.length > 0 ? 'secondary' : 'outline'}>
                  {items.length > 0
                    ? `${items.length} available`
                    : 'Placeholder'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {useCase.description}
              </p>
              {items.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((s) => (
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
              ) : (
                <Card className="border-border/50 bg-card/70 shadow-soft">
                  <CardContent className="space-y-3 pt-6">
                    <p className="text-sm text-muted-foreground">
                      No examples yet. Suggested starter file:
                    </p>
                    <code className="block rounded bg-muted px-2 py-1 font-mono text-xs">
                      {useCase.suggestedFile}
                    </code>
                  </CardContent>
                </Card>
              )}
            </section>
          );
        })}
      </div>
    </section>
  );
}
