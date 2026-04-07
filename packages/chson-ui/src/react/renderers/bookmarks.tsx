import * as React from 'react'

import type { ChSONDocument } from '@chson/schema'

import { getHostname } from '../../core/bookmarks'
import { safeExternalUrl } from '../../core/url'
import { getEntries, getSections } from '../../core/normalize'
import { ExternalLinkIcon } from '../icons'
import { Badge } from '../../shadcn/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shadcn/card'
import { cn } from '../utils/cn'

export interface BookmarksProps {
  data: ChSONDocument
  className?: string
}

/**
 * Bookmarks renderer: card grid of external links.
 */
export function Bookmarks({ data, className }: BookmarksProps) {
  const sections = getSections(data)
  if (sections.length === 0) return <p className={className}>No bookmarks found.</p>

  return (
    <div className={cn('mt-6 space-y-8', className)}>
      {sections.map((section, sectionIdx) => {
        const entries = getEntries(section)

        return (
          <div key={sectionIdx}>
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              {section.description && (
                <span className="text-sm text-muted-foreground">{section.description}</span>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry, entryIdx) => {
                const url = safeExternalUrl(entry.content)
                const hostname = getHostname(url ?? entry.content)

                return (
                  <a
                    key={entryIdx}
                    href={url ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn('group block', !url && 'pointer-events-none')}
                    aria-disabled={url ? undefined : true}
                  >
                    <Card className="h-full border-border/50 bg-card/70 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base font-semibold leading-snug group-hover:text-primary transition-colors">
                            {entry.anchor}
                          </CardTitle>
                          <ExternalLinkIcon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        {entry.details && (
                          <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                            {entry.details}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Badge variant="secondary" className="font-mono text-[11px] font-normal">
                          {hostname}
                        </Badge>
                      </CardContent>
                    </Card>
                  </a>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
