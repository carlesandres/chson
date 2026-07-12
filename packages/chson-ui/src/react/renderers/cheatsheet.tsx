import * as React from 'react'

import type { ChSONDocument } from '@chson/schema'

import { inferColumnFormats } from '../../core/format'
import { getLabels } from '../../core/document'
import { getEntries, getSections } from '../../core/normalize'
import { hasEntryMore } from '../../core/entry-more'
import { EntryMorePopover } from '../primitives/entry-more-popover'
import { cn } from '../utils/cn'
import { Card, CardContent, CardHeader, CardTitle } from '../../shadcn/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../shadcn/table'
import { Cell } from './_cell'

export interface CheatsheetProps {
  data: ChSONDocument
  className?: string
}

/**
 * Cheatsheet renderer: section cards with anchor | content | optional More (popover).
 * The More column is omitted per section when no entry has details or a safe url.
 */
export function Cheatsheet({ data, className }: CheatsheetProps) {
  const { anchorLabel, contentLabel } = getLabels(data)
  const { anchorFormat, contentFormat } = inferColumnFormats(data)
  const sections = getSections(data)

  if (sections.length === 0) return <p className={className}>No sections found.</p>

  return (
    <div className={cn('mt-6 grid gap-5', className)}>
      {sections.map((section, sectionIdx) => {
        const entries = getEntries(section)
        const showMoreColumn = entries.some((entry) => hasEntryMore(entry.details, entry.url))

        return (
          <Card key={sectionIdx} className="border-border/50 bg-card/70 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">{section.title}</CardTitle>
              {section.description && (
                <p className="text-sm text-muted-foreground">{section.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[640px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">{anchorLabel}</TableHead>
                        <TableHead>{contentLabel}</TableHead>
                        {showMoreColumn ? (
                          <TableHead className="w-14">
                            <span className="sr-only">More</span>
                          </TableHead>
                        ) : null}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries.map((entry, entryIdx) => (
                        <TableRow key={entryIdx}>
                          <TableCell className={cn('align-middle', anchorFormat === 'code' && 'p-0')}>
                            <Cell text={entry.anchor} format={anchorFormat} />
                          </TableCell>
                          <TableCell className={cn('align-middle', contentFormat === 'code' && 'p-0')}>
                            <Cell text={entry.content} format={contentFormat} />
                          </TableCell>
                          {showMoreColumn ? (
                            <TableCell className="align-middle text-right">
                              <EntryMorePopover
                                details={entry.details}
                                url={entry.url}
                                label={entry.anchor}
                              />
                            </TableCell>
                          ) : null}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
