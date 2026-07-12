import * as React from 'react'

import type { CellFormat } from '../../core/format'
import { InlineMarkdown } from '../primitives/inline-markdown'
import { Preformatted } from '../primitives/preformatted'
import { cn } from '../utils/cn'

export interface CellProps {
  text: string
  format: CellFormat
  className?: string
}

function TextCell({ text, className }: Omit<CellProps, 'format'>) {
  return <div className={cn('whitespace-pre-wrap', className)}>{text}</div>
}

function MarkdownCell({ text, className }: Omit<CellProps, 'format'>) {
  return <InlineMarkdown text={text} className={className} />
}

/** Primary cell content only (anchor or content). Details/url live in EntryMorePopover. */
export function Cell({ text, format, className }: CellProps) {
  if (!text) return null

  if (format === 'code') {
    return <Preformatted className={className}>{text}</Preformatted>
  }

  if (format === 'markdown') {
    return <MarkdownCell text={text} className={className} />
  }

  return <TextCell text={text} className={className} />
}
