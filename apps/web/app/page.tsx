import Link from 'next/link';
import { getAllCheatsheets } from 'lib/cheatsheets';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { CodeBlock } from 'components/chson';
import {
  ArrowRight,
  BookOpen,
  CheckSquare,
  ClipboardList,
  FileText,
  Bookmark,
} from 'lucide-react';

const schemaUrl = 'https://chson.dev/schema/chson.schema.json';

const exampleCode = `{
  "$schema": "${schemaUrl}",
  "title": "Git Essentials",
  "documentType": "cheatsheet",
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
}`;

const documentTypes = [
  {
    type: 'Cheatsheets',
    icon: FileText,
    description: 'Commands, shortcuts, syntax',
  },
  {
    type: 'Checklists',
    icon: CheckSquare,
    description: 'Tasks and steps to complete',
  },
  {
    type: 'Runbooks',
    icon: ClipboardList,
    description: 'Operational procedures',
  },
  {
    type: 'TLDRs',
    icon: BookOpen,
    description: 'Quick summaries and guides',
  },
  {
    type: 'Bookmarks',
    icon: Bookmark,
    description: 'Curated link collections',
  },
];

export default function Home() {
  const sheets = getAllCheatsheets().slice(0, 3);

  return (
    <section className="space-y-10">
      {/* Hero */}
      <div>
        <h1 className="font-display text-[clamp(34px,6vw,56px)] font-semibold leading-[1.05] tracking-[-0.03em]">
          Structured knowledge,
          <br />
          <span className="text-muted-foreground">designed for retrieval.</span>
        </h1>
        <p className="mt-4 max-w-[60ch] text-lg text-muted-foreground">
          ChSON is a JSON format for writing cheatsheets, checklists, runbooks,
          and more. Built around how people actually scan and look up
          information.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/docs">
              Read the docs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/cheatsheets">Browse examples</Link>
          </Button>
        </div>
      </div>

      {/* The Core Idea */}
      <Card className="border-border/50 bg-card/70 shadow-soft backdrop-blur">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            The core idea
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Every entry has an <strong>anchor</strong> (what you scan for) and{' '}
            <strong>content</strong> (what you need when you find it). Like a
            dictionary: scan for the word, get the definition.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <CodeBlock language="json" showCopy={false}>
                {exampleCode}
              </CodeBlock>
            </div>
            <div className="flex flex-col justify-center space-y-3">
              <div className="rounded-lg border border-border bg-background/60 p-3">
                <div className="text-xs font-medium text-muted-foreground">
                  anchor
                </div>
                <code className="font-mono text-sm">git status</code>
              </div>
              <ArrowRight className="mx-auto h-4 w-4 text-muted-foreground" />
              <div className="rounded-lg border border-border bg-background/60 p-3">
                <div className="text-xs font-medium text-muted-foreground">
                  content
                </div>
                <span className="text-sm">Show working tree status.</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Types */}
      <div>
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground">
          One format, many uses
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {documentTypes.map(({ type, icon: Icon, description }) => (
            <Card
              key={type}
              className="border-border/50 bg-card/70 shadow-soft backdrop-blur"
            >
              <CardContent className="flex items-start gap-3 p-4">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <div className="font-medium">{type}</div>
                  <div className="text-sm text-muted-foreground">
                    {description}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Learn how the anchor-content model adapts to each use case in{' '}
          <Link
            href="/docs/use-cases"
            className="text-primary underline-offset-4 hover:underline"
          >
            the docs
          </Link>
          .
        </p>
      </div>

      {/* Explore the Docs */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-lg font-semibold">Explore the docs</h2>
              <p className="mt-1 text-muted-foreground">
                Understand the cognitive science behind ChSON, learn the schema,
                and start writing your own documents.
              </p>
              <ul className="mt-3 space-y-1 text-sm">
                <li>
                  <Link
                    href="/docs/core-concepts"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Core Concepts
                  </Link>{' '}
                  <span className="text-muted-foreground">
                    — Anchors, content, sections
                  </span>
                </li>
                <li>
                  <Link
                    href="/docs/cognitive-science"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Cognitive Science
                  </Link>{' '}
                  <span className="text-muted-foreground">
                    — Why this format works
                  </span>
                </li>
                <li>
                  <Link
                    href="/docs/schema-reference"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Schema Reference
                  </Link>{' '}
                  <span className="text-muted-foreground">
                    — Complete field documentation
                  </span>
                </li>
              </ul>
            </div>
            <Button asChild size="lg" className="gap-2">
              <Link href="/docs">
                Start reading
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Browse Cheatsheets */}
      <div>
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground">
          From the registry
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {sheets.map((s) => (
            <li key={`${s.product}/${s.name}`}>
              <Link
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/70 px-4 py-3 transition-colors hover:border-border/80 hover:bg-card"
                href={`/cheatsheets/${s.product}/${s.name}`}
              >
                <span className="font-medium">{s.data.title}</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {s.product}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
        <Button asChild className="mt-4 gap-2" variant="outline">
          <Link href="/cheatsheets">
            See all cheatsheets
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
