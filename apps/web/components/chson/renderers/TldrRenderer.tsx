import { Separator } from 'components/ui/separator'
import { cn } from 'lib/utils'

import type { Cheatsheet } from 'lib/cheatsheets'

export interface RendererProps {
  data: Cheatsheet
  product: string
  name: string
}

/**
 * TLDR renderer — compact Q&A layout for brief, scannable content.
 * Intentionally minimal visual chrome. Designed to fit on one screen.
 */
export function TldrRenderer({ data }: RendererProps) {
  if (!Array.isArray(data.sections) || data.sections.length === 0) {
    return <p>No content found.</p>
  }

  return (
    <div className="mt-6 space-y-6">
      {data.sections.map((section, sectionIdx) => (
        <div key={sectionIdx}>
          {/* Section header */}
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {section.title}
            </h2>
            <Separator className="flex-1" />
          </div>

          {/* Entries as compact Q&A pairs */}
          <div className="mt-3 space-y-0">
            {(section.entries ?? []).map((entry, entryIdx) => (
              <div
                key={entryIdx}
                className={cn(
                  'rounded-md px-3 py-2.5',
                  entryIdx % 2 === 0 ? 'bg-muted/30' : '',
                )}
              >
                {/* Need (anchor) */}
                <div className="text-sm font-medium leading-snug">
                  {entry.anchor}
                </div>
                {/* Quick Answer (content) */}
                <div className="mt-0.5 text-sm text-muted-foreground leading-snug">
                  <span className="mr-1.5 text-primary">→</span>
                  {entry.content}
                </div>
                {/* Optional details */}
                {entry.details && (
                  <div className="mt-1 text-xs text-muted-foreground/70">
                    {entry.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
