import type { ChSONDocument } from '@chson/schema'

import { getRetrievalDirection } from './document'

export type CellFormat = 'text' | 'markdown' | 'code'

function determineFormat(
  formatHint: CellFormat | undefined,
  isMechanism: boolean,
): CellFormat {
  if (formatHint) return formatHint as CellFormat
  return isMechanism ? 'code' : 'text'
}

export function inferColumnFormats(data: ChSONDocument): {
  anchorFormat: CellFormat
  contentFormat: CellFormat
} {
  const retrievalDirection = getRetrievalDirection(data)
  const anchorIsMechanism = retrievalDirection === 'mechanism-to-meaning'

  const anchorFormat = determineFormat(data.formatHints?.anchor, anchorIsMechanism)
  const contentFormat = determineFormat(data.formatHints?.content, !anchorIsMechanism)

  return { anchorFormat, contentFormat }
}
