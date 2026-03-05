import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllCheatsheets, loadCheatsheet } from 'lib/cheatsheets';
import { cn } from 'lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from 'components/ui/breadcrumb';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/ui/table';
import { ScrollArea, ScrollBar } from 'components/ui/scroll-area';
import { ExternalLink, Home } from 'lucide-react';
import { Preformatted } from '@/components/chson/Preformatted';

type Params = Promise<{ product: string; name: string }>;

export async function generateStaticParams() {
  return getAllCheatsheets().map((ref) => ({
    product: ref.product,
    name: ref.name,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { product, name } = await params;
  const ref = getAllCheatsheets().find(
    (r) => r.product === product && r.name === name,
  );
  if (!ref) return { title: 'Not Found' };

  return {
    title: `${ref.data.title} | ChSON`,
    description: ref.data.description,
  };
}

/**
 * Renders content as plain text with optional details and URL
 */
function TextCell({
  children,
  details,
  url,
}: {
  children: React.ReactNode;
  details?: string;
  url?: string;
}) {
  return (
    <div className="space-y-1">
      <div>{children}</div>
      {details && (
        <div className="text-sm text-muted-foreground">{details}</div>
      )}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          <span>Link</span>
        </a>
      )}
    </div>
  );
}

export default async function CheatsheetPage({ params }: { params: Params }) {
  const { product, name } = await params;
  const ref = getAllCheatsheets().find(
    (r) => r.product === product && r.name === name,
  );

  if (!ref) {
    notFound();
  }

  const data = loadCheatsheet(ref.filePath);
  const title = data.title || 'Cheatsheet';
  const anchorLabel = data.anchorLabel || 'Anchor';
  const contentLabel = data.contentLabel || 'Content';
  const retrievalDirection = data.retrievalDirection || 'mechanism-to-meaning';

  // Determine which column contains the mechanism (code) vs intent (text)
  // - mechanism-to-meaning: anchor is mechanism (code), content is meaning (text)
  // - intent-to-mechanism: anchor is intent (text), content is mechanism (code)
  const anchorIsMechanism = retrievalDirection === 'mechanism-to-meaning';

  return (
    <>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/use-cases">Use Cases</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(28px,4.2vw,44px)] font-semibold leading-[1.08] tracking-[-0.03em]">
            {title}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {data.version && (
              <span>
                Version:{' '}
                <strong className="font-semibold text-foreground">
                  {data.version}
                </strong>
              </span>
            )}
            {data.publicationDate && (
              <span>
                Published:{' '}
                <strong className="font-semibold text-foreground">
                  {data.publicationDate}
                </strong>
              </span>
            )}
            <Badge variant="outline" className="font-mono text-[11px]">
              {ref.product}/{ref.name}
            </Badge>
          </div>
          <p className="mt-4 max-w-[80ch] text-muted-foreground">
            {data.description}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/use-cases">All use cases</Link>
          </Button>
          <Button asChild variant="secondary" size="sm" className="gap-1.5">
            <a
              href={`https://github.com/carlesandres/csif.sh/blob/main/packages/chson-registry/cheatsheets/${ref.product}/${ref.name}.chson.json`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View source
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>

      {Array.isArray(data.sections) && data.sections.length > 0 ? (
        <div className="mt-6 grid gap-5">
          {data.sections.map((section, sectionIdx) => (
            <Card
              key={sectionIdx}
              className="border-border/50 bg-card/70 shadow-soft"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  {section.title}
                </CardTitle>
                {section.description && (
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full">
                  <div className="min-w-[640px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40%]">
                            {anchorLabel}
                          </TableHead>
                          <TableHead>{contentLabel}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.isArray(section.entries) &&
                          section.entries.map((entry, entryIdx) => (
                            <TableRow key={entryIdx}>
                              <TableCell
                                className={cn(
                                  'align-middle',
                                  anchorIsMechanism && 'p-0',
                                )}
                              >
                                {anchorIsMechanism ? (
                                  entry.anchor && (
                                    <Preformatted>{entry.anchor}</Preformatted>
                                  )
                                ) : (
                                  <TextCell
                                    details={entry.details}
                                    url={entry.url}
                                  >
                                    {entry.anchor}
                                  </TextCell>
                                )}
                              </TableCell>
                              <TableCell
                                className={cn(
                                  'align-middle',
                                  !anchorIsMechanism && 'p-0',
                                )}
                              >
                                {anchorIsMechanism ? (
                                  <TextCell
                                    details={entry.details}
                                    url={entry.url}
                                  >
                                    {entry.content}
                                  </TextCell>
                                ) : (
                                  entry.content && (
                                    <Preformatted>{entry.content}</Preformatted>
                                  )
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>No sections found.</p>
      )}
    </>
  );
}
