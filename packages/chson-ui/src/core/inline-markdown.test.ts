import { describe, expect, it } from 'vitest'

import { parseInlineMarkdown } from './inline-markdown'

describe('core/inline-markdown', () => {
  it('parses supported inline constructs', () => {
    expect(parseInlineMarkdown('Use `git status` for **state** and *style*')).toEqual([
      { type: 'text', value: 'Use ' },
      { type: 'code', value: 'git status' },
      { type: 'text', value: ' for ' },
      { type: 'strong', value: 'state' },
      { type: 'text', value: ' and ' },
      { type: 'em', value: 'style' },
    ])
  })

  it('parses links', () => {
    expect(parseInlineMarkdown('See [docs](https://example.com)')).toEqual([
      { type: 'text', value: 'See ' },
      { type: 'link', label: 'docs', url: 'https://example.com' },
    ])
  })
})
