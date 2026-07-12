import * as React from 'react'

import type { ChSONDocument } from '@chson/schema'

import { looksLikeCommand } from '../../core/runbook'
import { getEntries, getSections } from '../../core/normalize'
import { safeExternalUrl } from '../../core/url'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../shadcn/accordion'
import { Badge } from '../../shadcn/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../shadcn/card'
import { EntryDetails } from '../primitives/entry-details'
import { Preformatted } from '../primitives/preformatted'
import { cn } from '../utils/cn'

export interface RunbookProps {
  data: ChSONDocument
  className?: string
}

/**
 * Runbook renderer: accordion-based operational flow.
 */
export function Runbook({ data, className }: RunbookProps) {
  const sections = getSections(data)
  if (sections.length === 0) return <p className={className}>No procedures found.</p>

  return (
    <div className={cn('mt-6 space-y-5', className)}>
      {sections.map((section, sectionIdx) => {
        const entries = getEntries(section)

        return (
          <Card key={sectionIdx} className="border-border/50 bg-card/70 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-[11px] tabular-nums">
                  {sectionIdx + 1}
                </Badge>
                <CardTitle className="text-base font-semibold">{section.title}</CardTitle>
              </div>
              {section.description && (
                <p className="text-sm text-muted-foreground">{section.description}</p>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <Accordion type="multiple" className="w-full">
                {entries.map((entry, entryIdx) => {
                  const isCommand = looksLikeCommand(entry.content)
                  const safeUrl = entry.url ? safeExternalUrl(entry.url) : null

                  return (
                    <AccordionItem
                      key={entryIdx}
                      value={`${sectionIdx}-${entryIdx}`}
                      className="border-border/50"
                    >
                      <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
                        <div className="flex items-center gap-2 text-left">
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {entryIdx + 1}.
                          </span>
                          <span>{entry.anchor}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pl-5">
                          {isCommand ? (
                            <Preformatted className="block w-full">{entry.content}</Preformatted>
                          ) : (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {entry.content}
                            </p>
                          )}
                          {entry.details && (
                            <EntryDetails
                              details={entry.details}
                              label={entry.anchor}
                              className="text-xs"
                            />
                          )}
                          {safeUrl ? (
                            <a
                              href={safeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              Documentation →
                            </a>
                          ) : null}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
