
'use client'

import { useCallback, useEffect, useState } from 'react'
import { Checklist } from '@chson/ui'

import type { Cheatsheet } from 'lib/cheatsheets'

export interface RendererProps {
  data: Cheatsheet
  product: string
  name: string
}

/**
 * Builds a localStorage key for checklist state.
 */
function storageKey(product: string, name: string): string {
  return `chson-checklist:${product}/${name}`
}

function loadChecked(product: string, name: string): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(storageKey(product, name))
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

/**
 * Saves checked state to localStorage.
 */
function saveChecked(product: string, name: string, checked: string[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      storageKey(product, name),
      JSON.stringify(checked),
    )
  } catch {
    // localStorage may be full or unavailable — fail silently
  }
}

export function ChecklistRenderer({ data, product, name }: RendererProps) {
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])

  useEffect(() => {
    setCheckedKeys(loadChecked(product, name))
  }, [product, name])

  const onCheckedKeysChange = useCallback(
    (next: string[]) => {
      setCheckedKeys(next)
      saveChecked(product, name, next)
    },
    [product, name],
  )

  return (
    <Checklist
      data={data}
      checkedKeys={checkedKeys}
      onCheckedKeysChange={onCheckedKeysChange}
      // Keep existing key format for backwards compatibility with stored state.
      getKey={({ sectionIndex, entryIndex }) => `${sectionIndex}-${entryIndex}`}
    />
  )
}
