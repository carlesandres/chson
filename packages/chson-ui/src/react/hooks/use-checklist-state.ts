'use client'

import * as React from 'react'

import { defaultChecklistKey, type ChecklistKeyArgs } from '../../core/checklist'

export function checklistStorageKey(scope: string): string {
  return `chson-checklist:${scope}`
}

function loadCheckedKeys(storageKey: string): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function saveCheckedKeys(storageKey: string, checked: string[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(checked))
  } catch {
    // localStorage may be full or unavailable
  }
}

export interface UseChecklistStateOptions {
  getKey?: (args: ChecklistKeyArgs) => string
}

export function useChecklistState(scope: string, options: UseChecklistStateOptions = {}) {
  const { getKey = defaultChecklistKey } = options
  const storageKey = checklistStorageKey(scope)
  const [checkedKeys, setCheckedKeys] = React.useState<string[]>([])

  React.useEffect(() => {
    setCheckedKeys(loadCheckedKeys(storageKey))
  }, [storageKey])

  const onCheckedKeysChange = React.useCallback(
    (next: string[]) => {
      setCheckedKeys(next)
      saveCheckedKeys(storageKey, next)
    },
    [storageKey],
  )

  return { checkedKeys, onCheckedKeysChange, getKey }
}