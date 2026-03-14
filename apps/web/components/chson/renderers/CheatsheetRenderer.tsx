import { cn } from 'lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/ui/table'
import { ScrollArea, ScrollBar } from 'components/ui/scroll-area'
import { ExternalLink } from 'lucide-react'
import { Preformatted } from 'components/chson/Preformatted'
import { MarkdownCell } from 'components/chson/MarkdownCell'

import type { Cheatsheet } from 'lib/cheatsheets'

export interface RendererProps {
  data: Cheatsheet
  product: string
  name: string
}

/**
 * Determines the format for a column based on formatHints and retrievalDirection.
 */
function determineFormat(
  formatHint: string | undefined,
  isMechanism: boolean,
): 'text' | 'markdown' | 'code' {
  if (formatHint) {
    return formatHint as 'text' | 'markdown' | 'code'
  }
  return isMechanism ? 'code' : 'text'
}

/**
 * Renders a table cell based on format type
 */
function renderCell(
  text: string,
  format: 'text' | 'markdown' | 'code',
  details?: string,
  url?: string,
) {
  if (format === 'code') {
    return text ? <Preformatted>{text}</Preformatted> : null
  }

  if (format === 'markdown') {
    return (
      <MarkdownCell details={details} url={url}>
        {text}
      </MarkdownCell>
    )
  }

  return (
    <TextCell details={details} url={url}>
      {text}
    </TextCell>
  )
}

/**
 * Renders content as plain text with optional details and URL
 */
function TextCell({
  children,
  details,
  url,
}: {
  children: React.ReactNode
  details?: string
  url?: string
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
  )
}

/**
 * Default cheatsheet renderer — Card > Table layout for quick-reference lookup.
 */
export function CheatsheetRenderer({ data }: RendererProps) {
  const anchorLabel = data.anchorLabel || 'Anchor'
  const contentLabel = data.contentLabel || 'Content'
  const retrievalDirection = data.retrievalDirection || 'mechanism-to-meaning'

  const anchorIsMechanism = retrievalDirection === 'mechanism-to-meaning'

  const anchorFormat = determineFormat(data.formatHints?.anchor, anchorIsMechanism)
  const contentFormat = determineFormat(
    data.formatHints?.content,
    !anchorIsMechanism,
  )

  if (!Array.isArray(data.sections) || data.sections.length === 0) {
    return <p>No sections found.</p>
  }

  return (
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
                              anchorFormat === 'code' && 'p-0',
                            )}
                          >
                            {renderCell(
                              entry.anchor,
                              anchorFormat,
                              anchorFormat !== 'code'
                                ? entry.details
                                : undefined,
                              anchorFormat !== 'code' ? entry.url : undefined,
                            )}
                          </TableCell>
                          <TableCell
                            className={cn(
                              'align-middle',
                              contentFormat === 'code' && 'p-0',
                            )}
                          >
                            {renderCell(
                              entry.content,
                              contentFormat,
                              contentFormat !== 'code'
                                ? entry.details
                                : undefined,
                              contentFormat !== 'code' ? entry.url : undefined,
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
  )
}
