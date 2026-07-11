import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import type { ChSONDocument } from '@chson/schema'

import { Runbook } from './runbook'

function runbookWithUrl(url: string): ChSONDocument {
  return {
    title: 'Deploy',
    publicationDate: '2026-01-01' as ChSONDocument['publicationDate'],
    description: 'Runbook',
    documentType: 'runbook',
    sections: [
      {
        title: 'Ship',
        entries: [
          {
            anchor: 'Check docs',
            content: 'Read the guide',
            url,
          },
        ],
      },
    ],
  }
}

describe('Runbook', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders a safe documentation link for entry.url', () => {
    render(<Runbook data={runbookWithUrl('https://example.com/docs')} />)

    fireEvent.click(screen.getByText('Check docs'))
    const docsLink = screen.getByRole('link', { name: /documentation/i })
    expect(docsLink.getAttribute('href')).toMatch(/^https:\/\/example\.com\/docs\/?$/)
    expect(docsLink).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('does not render a documentation link for unsafe entry.url', () => {
    render(<Runbook data={runbookWithUrl('javascript:alert(1)')} />)

    fireEvent.click(screen.getByText('Check docs'))
    expect(screen.queryByRole('link', { name: /documentation/i })).not.toBeInTheDocument()
  })
})
