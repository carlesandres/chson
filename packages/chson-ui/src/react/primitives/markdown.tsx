'use client'

import { Streamdown } from 'streamdown'

import { safeExternalUrl } from '../../core/url'
import { cn } from '../utils/cn'

export interface MarkdownProps {
  content: string
  className?: string
}

/**
 * Renders entry.details (and similar fields) as GitHub-Flavored Markdown via Streamdown.
 * Link targets are restricted via safeExternalUrl.
 */
export function Markdown({ content, className }: MarkdownProps) {
  if (!content) return null

  return (
    <Streamdown
      mode="static"
      className={cn(
        'text-sm leading-relaxed text-muted-foreground',
        '[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0',
        '[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-4',
        '[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-4',
        '[&_li]:my-0.5',
        className,
      )}
      controls={false}
      urlTransform={(url) => safeExternalUrl(url) ?? ''}
      components={{
        a: ({ href, children }) => {
          if (!href) {
            return <span>{children}</span>
          }
          return (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          )
        },
      }}
    >
      {content}
    </Streamdown>
  )
}
