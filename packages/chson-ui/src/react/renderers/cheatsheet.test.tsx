import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { ChSONDocument } from '@chson/schema'

import { Cheatsheet } from './cheatsheet'

describe('Cheatsheet', () => {
  it('renders section title and entries', () => {
    const data: ChSONDocument = {
      title: 'Git',
      publicationDate: '2026-01-01' as ChSONDocument['publicationDate'],
      description: 'Core git commands',
      retrievalDirection: 'mechanism-to-meaning',
      formatHints: { content: 'markdown' },
      sections: [
        {
          title: 'Basics',
          entries: [
            {
              anchor: 'git status',
              content: 'Show **status** and `changes`',
              url: 'https://example.com',
              details: 'Details',
            },
          ],
        },
      ],
    }

    render(<Cheatsheet data={data} />)
    expect(screen.getByText('Basics')).toBeInTheDocument()
    expect(screen.getByText('git status')).toBeInTheDocument()
    expect(screen.getByText('status')).toBeInTheDocument()
    expect(screen.getByText('changes')).toBeInTheDocument()
    expect(screen.getByText('Details')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Link' })).toHaveAttribute('href')
    expect(screen.getByRole('link', { name: 'Link' }).getAttribute('href')).toMatch(
      /^https:\/\/example\.com\/?$/,
    )
  })
})
