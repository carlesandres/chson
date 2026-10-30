import { describe, expect, it } from 'vitest'

import type { ChSONDocument } from '@chson/schema'

import { getLabels, getRetrievalDirection } from './document'

function baseDoc(overrides: Partial<ChSONDocument> = {}): ChSONDocument {
  return {
    title: 'T',
    publicationDate: '2026-01-01' as ChSONDocument['publicationDate'],
    description: 'D',
    sections: [{ title: 'S', entries: [{ anchor: 'A', content: 'C' }] }],
    ...overrides,
  }
}

describe('core/document', () => {
  it('defaults labels', () => {
    expect(getLabels(baseDoc())).toEqual({ anchorLabel: 'Anchor', contentLabel: 'Content' })
  })

  it('defaults retrievalDirection', () => {
    expect(getRetrievalDirection(baseDoc())).toBe('mechanism-to-meaning')
  })
})
