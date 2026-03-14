import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'components/ui/card'
import { Badge } from 'components/ui/badge'
import { ExternalLink } from 'lucide-react'

import type { Cheatsheet } from 'lib/cheatsheets'

export interface RendererProps {
  data: Cheatsheet
  product: string
  name: string
}

/**
 * Extracts the hostname from a URL for display.
 */
function getHostname(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

/**
 * Bookmarks renderer — clickable card grid layout.
 * Each bookmark is a card with title, description, and hostname badge.
 * Entire card is clickable and opens in a new tab.
 */
export function BookmarksRenderer({ data }: RendererProps) {
  if (!Array.isArray(data.sections) || data.sections.length === 0) {
    return <p>No bookmarks found.</p>
  }

  return (
    <div className="mt-6 space-y-8">
      {data.sections.map((section, sectionIdx) => (
        <div key={sectionIdx}>
          {/* Section header */}
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-lg font-semibold">{section.title}</h2>
            {section.description && (
              <span className="text-sm text-muted-foreground">
                {section.description}
              </span>
            )}
          </div>

          {/* Card grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(section.entries ?? []).map((entry, entryIdx) => {
              const url = entry.content
              const hostname = getHostname(url)

              return (
                <Link
                  key={entryIdx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <Card className="h-full border-border/50 bg-card/70 shadow-soft transition-all hover:border-primary/50 hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base font-semibold leading-snug group-hover:text-primary transition-colors">
                          {entry.anchor}
                        </CardTitle>
                        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      {entry.details && (
                        <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                          {entry.details}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Badge
                        variant="secondary"
                        className="font-mono text-[11px] font-normal"
                      >
                        {hostname}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
