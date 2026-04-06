import * as React from 'react'

import { parseInlineMarkdown } from '../../core/inline-markdown'
import { safeExternalUrl } from '../../core/url'
import { cn } from '../utils/cn'

export interface InlineMarkdownProps {
  text: string
  className?: string
  linkClassName?: string
}

export function InlineMarkdown({ text, className, linkClassName }: InlineMarkdownProps) {
  const tokens = parseInlineMarkdown(text)

  return (
    <span className={cn('whitespace-pre-wrap', className)}>
      {tokens.map((token, idx) => {
        switch (token.type) {
          case 'text':
            return <React.Fragment key={idx}>{token.value}</React.Fragment>
          case 'code':
            return (
              <code
                key={idx}
                className="rounded bg-muted px-1 py-0.5 font-mono text-[0.925em]"
              >
                {token.value}
              </code>
            )
          case 'strong':
            return (
              <strong key={idx} className="font-semibold">
                {token.value}
              </strong>
            )
          case 'em':
            return (
              <em key={idx} className="italic">
                {token.value}
              </em>
            )
          case 'link':
            {
              const safeUrl = safeExternalUrl(token.url)
              if (!safeUrl) return <React.Fragment key={idx}>{token.label}</React.Fragment>
            return (
              <a
                key={idx}
                href={safeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn('text-primary hover:underline', linkClassName)}
              >
                {token.label}
              </a>
            )
            }
          default:
            return null
        }
      })}
    </span>
  )
}
