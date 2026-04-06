import * as React from 'react'

import type { Entry } from '@chson/schema'

import type { CellFormat } from '../../core/format'
import { safeExternalUrl } from '../../core/url'
import { ExternalLinkIcon } from '../icons'
import { InlineMarkdown } from '../primitives/inline-markdown'
import { Preformatted } from '../primitives/preformatted'
import { cn } from '../utils/cn'

export interface CellProps {
  text: string
  format: CellFormat
  details?: Entry['details']
  url?: Entry['url']
  className?: string
}

function TextCell({ text, details, url, className }: Omit<CellProps, 'format'>) {
  const safeUrl = url ? safeExternalUrl(url) : null
  return (
    <div className={cn('space-y-1', className)}>
      <div className="whitespace-pre-wrap">{text}</div>
      {details && <div className="text-sm text-muted-foreground">{details}</div>}
      {safeUrl && (
        <a
          href={safeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ExternalLinkIcon className="h-3 w-3" />
          <span>Link</span>
        </a>
      )}
    </div>
  )
}

function MarkdownCell({ text, details, url, className }: Omit<CellProps, 'format'>) {
  const safeUrl = url ? safeExternalUrl(url) : null
  return (
    <div className={cn('space-y-1', className)}>
      <InlineMarkdown text={text} />
      {details && <div className="text-sm text-muted-foreground">{details}</div>}
      {safeUrl && (
        <a
          href={safeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ExternalLinkIcon className="h-3 w-3" />
          <span>Link</span>
        </a>
      )}
    </div>
  )
}

export function Cell({ text, format, details, url, className }: CellProps) {
  if (!text) return null

  if (format === 'code') {
    return <Preformatted className={className}>{text}</Preformatted>
  }

  if (format === 'markdown') {
    return <MarkdownCell text={text} details={details} url={url} className={className} />
  }

  return <TextCell text={text} details={details} url={url} className={className} />
}
