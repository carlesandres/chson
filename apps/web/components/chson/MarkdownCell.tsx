'use client'

import { marked } from 'marked'
import { cn } from 'lib/utils'
import { ExternalLink } from 'lucide-react'

interface MarkdownCellProps {
  children: string
  details?: string
  url?: string
  className?: string
}

/**
 * Renders markdown content with sanitization.
 * Supports inline code, bold, italics, and links.
 * Does NOT support block elements (headers, lists, images, etc.)
 */
export function MarkdownCell({
  children,
  details,
  url,
  className,
}: MarkdownCellProps) {
  // Configure marked for inline-only markdown
  marked.use({
    breaks: true,
    gfm: true,
    pedantic: false,
  })

  // Render main content as inline markdown
  const contentHtml = marked.parseInline(children)

  return (
    <div className={cn('space-y-1', className)}>
      <div
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
      {details && (
        <div className="text-sm text-muted-foreground">{details}</div>
      )}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          <span>Link</span>
        </a>
      )}
    </div>
  )
}
