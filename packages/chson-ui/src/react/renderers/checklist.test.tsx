import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { ChSONDocument } from '@chson/schema'

import { Checklist } from './checklist'

describe('Checklist', () => {
  it('calls onCheckedKeysChange when toggled (controlled)', () => {
    const onCheckedKeysChange = vi.fn()
    const data: ChSONDocument = {
      title: 'Release',
      publicationDate: '2026-01-01' as ChSONDocument['publicationDate'],
      description: 'Checklist',
      documentType: 'checklist',
      sections: [
        {
          title: 'One',
          entries: [
            { anchor: 'Do a', content: 'A' },
            { anchor: 'Do b', content: 'B' },
          ],
        },
      ],
    }

    render(
      <Checklist
        data={data}
        checkedKeys={[]}
        onCheckedKeysChange={onCheckedKeysChange}
      />,
    )

    const boxes = screen.getAllByRole('checkbox')
    fireEvent.click(boxes[0])

    expect(onCheckedKeysChange).toHaveBeenCalledTimes(1)
    expect(onCheckedKeysChange.mock.calls[0]?.[0]).toEqual(['0-0'])
  })
})
