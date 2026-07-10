import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import type { ChSONDocument } from '@chson/schema'

import { Cheatsheet } from './cheatsheet'

describe('Cheatsheet', () => {
  afterEach(() => {
    cleanup()
  })

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
    expect(screen.queryByText('Details')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'More about git status' }))
    expect(screen.getByText('Details')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Link' })).toHaveAttribute('href')
    expect(screen.getByRole('link', { name: 'Link' }).getAttribute('href')).toMatch(
      /^https:\/\/example\.com\/?$/,
    )
  })

  it('shows at most one More control when both columns are non-code', () => {
    const data: ChSONDocument = {
      title: 'Git',
      publicationDate: '2026-01-01' as ChSONDocument['publicationDate'],
      description: 'Core git commands',
      formatHints: { anchor: 'markdown', content: 'markdown' },
      sections: [
        {
          title: 'Basics',
          entries: [
            {
              anchor: 'status',
              content: 'working tree',
              details: 'Extra explanation',
              url: 'https://example.com/docs',
            },
          ],
        },
      ],
    }

    render(<Cheatsheet data={data} />)

    const moreButtons = screen.getAllByRole('button', { name: /More about/i })
    expect(moreButtons).toHaveLength(1)

    fireEvent.click(moreButtons[0])
    expect(screen.getByText('Extra explanation')).toBeInTheDocument()
    expect(screen.getAllByText('Extra explanation')).toHaveLength(1)
  })

  it('omits the More control when there is no details or url', () => {
    const data: ChSONDocument = {
      title: 'Git',
      publicationDate: '2026-01-01' as ChSONDocument['publicationDate'],
      description: 'Core git commands',
      sections: [
        {
          title: 'Basics',
          entries: [{ anchor: 'git status', content: 'Show status' }],
        },
      ],
    }

    render(<Cheatsheet data={data} />)
    expect(screen.queryByRole('button', { name: /More/i })).not.toBeInTheDocument()
  })
})
