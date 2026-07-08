'use client'

import * as React from 'react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../shadcn/collapsible'
import { ChevronDownIcon } from '../icons'
import { cn } from '../utils/cn'

export interface EntryDetailsProps {
  details: string
  className?: string
  triggerClassName?: string
}

/**
 * Collapsed-by-default disclosure for entry.details.
 */
export function EntryDetails({ details, className, triggerClassName }: EntryDetailsProps) {
  const [open, setOpen] = React.useState(false)

  if (!details) return null

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        type="button"
        className={cn(
          'inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground',
          triggerClassName,
        )}
      >
        <span>{open ? 'Less' : 'More'}</span>
        <ChevronDownIcon
          className={cn('h-3 w-3 transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </CollapsibleTrigger>
      <CollapsibleContent
        className={cn(
          'mt-1 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground',
          className,
        )}
      >
        {details}
      </CollapsibleContent>
    </Collapsible>
  )
}