import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { EntryMorePopover, hasEntryMore } from './entry-more-popover'

describe('hasEntryMore', () => {
  it('is true when details are present', () => {
    expect(hasEntryMore('extra', undefined)).toBe(true)
  })

  it('is true only for safe urls without details', () => {
    expect(hasEntryMore(undefined, 'https://example.com')).toBe(true)
    expect(hasEntryMore(undefined, 'javascript:alert(1)')).toBe(false)
    expect(hasEntryMore(undefined, undefined)).toBe(false)
  })
})

describe('EntryMorePopover', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders nothing when there is no details or safe url', () => {
    const { container } = render(<EntryMorePopover label="x" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing for unsafe url alone', () => {
    const { container } = render(
      <EntryMorePopover url="javascript:alert(1)" label="bad" />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('opens details-only content in the popover', () => {
    render(<EntryMorePopover details="Only details" label="git status" />)

    expect(screen.queryByText('Only details')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'More about git status' }))
    expect(screen.getByText('Only details')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Link' })).not.toBeInTheDocument()
  })

  it('opens url-only content in the popover', () => {
    render(<EntryMorePopover url="https://example.com/docs" label="docs" />)

    fireEvent.click(screen.getByRole('button', { name: 'More about docs' }))
    const link = screen.getByRole('link', { name: 'Link' })
    expect(link.getAttribute('href')).toMatch(/^https:\/\/example\.com\/docs\/?$/)
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('shows both details and link when both are provided', () => {
    render(
      <EntryMorePopover
        details="Extra notes"
        url="https://example.com"
        label="both"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'More about both' }))
    expect(screen.getByText('Extra notes')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Link' }).getAttribute('href')).toMatch(
      /^https:\/\/example\.com\/?$/,
    )
  })
})
