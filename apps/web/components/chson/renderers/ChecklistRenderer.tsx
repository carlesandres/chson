
'use client'

import { Checklist, useChecklistState } from '@chson/ui'

import type { Cheatsheet } from 'lib/cheatsheets'

export interface RendererProps {
  data: Cheatsheet
  product: string
  name: string
}

export function ChecklistRenderer({ data, product, name }: RendererProps) {
  const { checkedKeys, onCheckedKeysChange, getKey } = useChecklistState(`${product}/${name}`, {
    // Keep existing key format for backwards compatibility with stored state.
    getKey: ({ sectionIndex, entryIndex }) => `${sectionIndex}-${entryIndex}`,
  })

  return (
    <Checklist
      data={data}
      checkedKeys={checkedKeys}
      onCheckedKeysChange={onCheckedKeysChange}
      getKey={getKey}
    />
  )
}