'use client'

import * as React from 'react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../shadcn/collapsible'
import { ChevronDownIcon } from '../icons'
import { cn } from '../utils/cn'
import { Markdown } from './markdown'

export interface EntryDetailsProps {
  details: string
  className?: string
  triggerClassName?: string
  /** Used for a clearer accessible name, e.g. entry.anchor */
  label?: string
}

/**
 * Collapsed-by-default disclosure for entry.details (always markdown / GFM).
 */
export function EntryDetails({
  details,
  className,
  triggerClassName,
  label,
}: EntryDetailsProps) {
  const [open, setOpen] = React.useState(false)

  if (!details) return null

  const visible = open ? 'Less' : 'More'
  const accessibleName = label
    ? `${visible} about ${label}`
    : visible

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        type="button"
        aria-label={accessibleName}
        className={cn(
          'inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground',
          triggerClassName,
        )}
      >
        <span aria-hidden>{visible}</span>
        <ChevronDownIcon
          className={cn('h-3 w-3 transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1">
        <Markdown content={details} className={className} />
      </CollapsibleContent>
    </Collapsible>
  )
}
