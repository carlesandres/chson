import * as React from 'react'

import type { ChSONDocument } from '@chson/schema'

import { getEntries, getSections } from '../../core/normalize'
import { cn } from '../utils/cn'
import { Separator } from '../../shadcn/separator'

export interface TldrProps {
  data: ChSONDocument
  className?: string
}

/**
 * TLDR renderer: compact Q&A layout.
 */
export function Tldr({ data, className }: TldrProps) {
  const sections = getSections(data)
  if (sections.length === 0) return <p className={className}>No content found.</p>

  return (
    <div className={cn('mt-6 space-y-6', className)}>
      {sections.map((section, sectionIdx) => {
        const entries = getEntries(section)

        return (
          <div key={sectionIdx}>
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {section.title}
              </h2>
              <Separator className="flex-1" />
            </div>

            <div className="mt-3 space-y-0">
              {entries.map((entry, entryIdx) => (
                <div
                  key={entryIdx}
                  className={cn('rounded-md px-3 py-2.5', entryIdx % 2 === 0 ? 'bg-muted/30' : '')}
                >
                  <div className="text-sm font-medium leading-snug">{entry.anchor}</div>
                  <div className="mt-0.5 text-sm text-muted-foreground leading-snug">
                    <span className="mr-1.5 text-primary">→</span>
                    {entry.content}
                  </div>
                  {entry.details && (
                    <div className="mt-1 text-xs text-muted-foreground/70">{entry.details}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
