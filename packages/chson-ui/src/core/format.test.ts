import { describe, expect, it } from 'vitest'

import type { ChSONDocument } from '@chson/schema'

import { inferColumnFormats } from './format'

function baseDoc(overrides: Partial<ChSONDocument> = {}): ChSONDocument {
  return {
    title: 'T',
    publicationDate: '2026-01-01' as ChSONDocument['publicationDate'],
    description: 'D',
    sections: [{ title: 'S', entries: [{ anchor: 'A', content: 'C' }] }],
    ...overrides,
  }
}

describe('core/format', () => {
  it('infers formats from retrievalDirection when no hints', () => {
    expect(inferColumnFormats(baseDoc({ retrievalDirection: 'mechanism-to-meaning' }))).toEqual({
      anchorFormat: 'code',
      contentFormat: 'text',
    })

    expect(inferColumnFormats(baseDoc({ retrievalDirection: 'intent-to-mechanism' }))).toEqual({
      anchorFormat: 'text',
      contentFormat: 'code',
    })
  })

  it('respects formatHints when present', () => {
    expect(
      inferColumnFormats(
        baseDoc({
          retrievalDirection: 'mechanism-to-meaning',
          formatHints: { anchor: 'markdown', content: 'markdown' },
        }),
      ),
    ).toEqual({ anchorFormat: 'markdown', contentFormat: 'markdown' })
  })
})
