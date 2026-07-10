import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { EntryDetails } from './entry-details'

describe('EntryDetails', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders details as GFM when expanded', () => {
    render(
      <EntryDetails
        details={'Use **bold** and `code`.\n\n- pick\n- squash'}
        label="git rebase -i"
      />,
    )

    expect(screen.queryByText('bold')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'More about git rebase -i' }))

    // Streamdown renders strong as a styled span with data-streamdown="strong".
    expect(screen.getByText('bold')).toHaveAttribute('data-streamdown', 'strong')
    expect(screen.getByText('code').tagName).toBe('CODE')
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getByText('pick')).toBeInTheDocument()
    expect(screen.getByText('squash')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Less about git rebase -i' })).toBeInTheDocument()
  })

  it('renders safe external links from markdown', () => {
    render(
      <EntryDetails details={'See [docs](https://example.com/guide).'} label="docs" />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'More about docs' }))

    const link = screen.getByRole('link', { name: 'docs' })
    expect(link).toHaveAttribute('href', 'https://example.com/guide')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('does not render unsafe link targets as anchors', () => {
    render(<EntryDetails details={'Bad [x](javascript:alert(1)).'} label="x" />)

    fireEvent.click(screen.getByRole('button', { name: 'More about x' }))

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText(/blocked/i)).toBeInTheDocument()
  })

  it('falls back to More/Less when no label is provided', () => {
    render(<EntryDetails details="Extra" />)
    expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'More' }))
    expect(screen.getByRole('button', { name: 'Less' })).toBeInTheDocument()
  })
})
