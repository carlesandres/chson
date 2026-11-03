import type { ChSONDocument } from '@chson/schema'

export function getLabels(data: ChSONDocument): {
  anchorLabel: string
  contentLabel: string
} {
  return {
    anchorLabel: data.anchorLabel || 'Anchor',
    contentLabel: data.contentLabel || 'Content',
  }
}

export function getRetrievalDirection(
  data: ChSONDocument,
): NonNullable<ChSONDocument['retrievalDirection']> {
  return data.retrievalDirection ?? 'mechanism-to-meaning'
}
