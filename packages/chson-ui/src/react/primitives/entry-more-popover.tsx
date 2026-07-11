'use client'

import { safeExternalUrl } from '../../core/url'
import { Popover, PopoverContent, PopoverTrigger } from '../../shadcn/popover'
import { ExternalLinkIcon } from '../icons'
import { cn } from '../utils/cn'
import { Markdown } from './markdown'

export interface EntryMorePopoverProps {
  details?: string
  url?: string
  className?: string
  /** Used for a clearer accessible name, e.g. entry.anchor */
  label?: string
}

/** True when EntryMorePopover would render (details or a safe external url). */
export function hasEntryMore(details?: string, url?: string): boolean {
  if (details) return true
  if (url && safeExternalUrl(url)) return true
  return false
}

/**
 * Single "More" control for cheatsheet rows: opens a popover with markdown
 * details and/or a reference link. At most one per entry.
 */
export function EntryMorePopover({ details, url, className, label }: EntryMorePopoverProps) {
  const safeUrl = url ? safeExternalUrl(url) : null
  if (!hasEntryMore(details, url)) return null

  const accessibleName = label ? `More about ${label}` : 'More'

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
            className,
          )}
          aria-label={accessibleName}
        >
          More
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 max-w-[min(20rem,calc(100vw-2rem))] space-y-3 p-3">
        {details ? <Markdown content={details} /> : null}
        {safeUrl ? (
          <a
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <ExternalLinkIcon className="h-3 w-3" aria-hidden />
            <span>Link</span>
          </a>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
