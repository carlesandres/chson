import type { ChSONDocument } from '@chson/schema'

export type DocumentType = NonNullable<ChSONDocument['documentType']> | 'cheatsheet'

export function getDocumentType(data: ChSONDocument): DocumentType {
  return (data.documentType ?? 'cheatsheet') as DocumentType
}

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
