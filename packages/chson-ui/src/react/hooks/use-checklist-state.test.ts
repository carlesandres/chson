import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { checklistStorageKey, useChecklistState } from './use-checklist-state'

describe('useChecklistState', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  it('builds a scoped storage key', () => {
    expect(checklistStorageKey('git/core')).toBe('chson-checklist:git/core')
  })

  it('persists checked keys to localStorage', async () => {
    const { result } = renderHook(() => useChecklistState('git/core'))

    await waitFor(() => {
      expect(result.current.checkedKeys).toEqual([])
    })

    act(() => {
      result.current.onCheckedKeysChange(['0-0'])
    })

    expect(result.current.checkedKeys).toEqual(['0-0'])
    expect(window.localStorage.getItem('chson-checklist:git/core')).toBe(JSON.stringify(['0-0']))
  })

  it('loads checked keys from localStorage on mount', async () => {
    window.localStorage.setItem('chson-checklist:git/core', JSON.stringify(['0-0', '1-2']))

    const { result } = renderHook(() => useChecklistState('git/core'))

    await waitFor(() => {
      expect(result.current.checkedKeys).toEqual(['0-0', '1-2'])
    })
  })

  it('ignores invalid localStorage payloads', async () => {
    window.localStorage.setItem('chson-checklist:git/core', '{not-json')
    const { result: broken } = renderHook(() => useChecklistState('git/core'))
    await waitFor(() => {
      expect(broken.current.checkedKeys).toEqual([])
    })

    window.localStorage.setItem('chson-checklist:other', JSON.stringify([1, 'ok', null]))
    const { result: mixed } = renderHook(() => useChecklistState('other'))
    await waitFor(() => {
      expect(mixed.current.checkedKeys).toEqual(['ok'])
    })
  })
})
