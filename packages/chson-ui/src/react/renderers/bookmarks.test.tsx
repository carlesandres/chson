import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { ChSONDocument } from '@chson/schema'

import { Bookmarks } from './bookmarks'

describe('Bookmarks', () => {
  it('renders an external link card', () => {
    const data: ChSONDocument = {
      title: 'Links',
      publicationDate: '2026-01-01' as ChSONDocument['publicationDate'],
      description: 'Bookmarks',
      documentType: 'bookmarks',
      sections: [
        {
          title: 'Perf',
          entries: [
            {
              anchor: 'Web Vitals',
              content: 'https://example.com/docs',
              details: 'Read this',
            },
          ],
        },
      ],
    }

    render(<Bookmarks data={data} />)

    const link = screen.getByRole('link', { name: /web vitals/i })
    expect(link).toHaveAttribute('href', 'https://example.com/docs')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })
})
