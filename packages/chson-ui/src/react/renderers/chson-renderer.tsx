import * as React from 'react'

import type { ChSONDocument } from '@chson/schema'

import { getDocumentType } from '../../core/document'
import { Bookmarks } from './bookmarks'
import { Cheatsheet } from './cheatsheet'
import { Checklist, type ChecklistProps } from './checklist'
import { Runbook } from './runbook'
import { Tldr } from './tldr'

export interface ChsonRendererProps {
  data: ChSONDocument
  className?: string
  checklist?: Pick<
    ChecklistProps,
    'checkedKeys' | 'defaultCheckedKeys' | 'onCheckedKeysChange' | 'getKey'
  >
}

export function ChsonRenderer({ data, className, checklist }: ChsonRendererProps) {
  const type = getDocumentType(data)

  switch (type) {
    case 'checklist':
      return <Checklist data={data} className={className} {...checklist} />
    case 'runbook':
      return <Runbook data={data} className={className} />
    case 'tldr':
      return <Tldr data={data} className={className} />
    case 'bookmarks':
      return <Bookmarks data={data} className={className} />
    case 'cheatsheet':
    default:
      return <Cheatsheet data={data} className={className} />
  }
}
