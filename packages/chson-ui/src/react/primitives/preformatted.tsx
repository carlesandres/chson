import * as React from 'react'

import { cn } from '../utils/cn'

export interface PreformattedProps {
  children: string
  className?: string
}

/**
 * Compact preformatted block for command/code-like cells.
 */
export function Preformatted({ children, className }: PreformattedProps) {
  return (
    <pre
      className={cn(
        'inline-block rounded border bg-muted p-2 text-[13px] leading-snug overflow-auto',
        className,
      )}
    >
      {children}
    </pre>
  )
}
