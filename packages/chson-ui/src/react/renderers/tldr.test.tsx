import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import type { ChSONDocument } from '@chson/schema'

import { Tldr } from './tldr'

describe('Tldr', () => {
  afterEach(() => {
    cleanup()
  })

  it('keeps details collapsed until More is activated', () => {
    const data: ChSONDocument = {
      title: 'Git tldr',
      publicationDate: '2026-01-01' as ChSONDocument['publicationDate'],
      description: 'Short answers',
      documentType: 'tldr',
      sections: [
        {
          title: 'Basics',
          entries: [
            {
              anchor: 'What is status?',
              content: 'Working tree summary',
              details: 'Shows staged, unstaged, and untracked paths.',
            },
          ],
        },
      ],
    }

    render(<Tldr data={data} />)

    expect(screen.getByText('What is status?')).toBeInTheDocument()
    expect(screen.getByText('Working tree summary')).toBeInTheDocument()
    expect(
      screen.queryByText('Shows staged, unstaged, and untracked paths.'),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'More about What is status?' }))
    expect(
      screen.getByText('Shows staged, unstaged, and untracked paths.'),
    ).toBeInTheDocument()
  })
})
