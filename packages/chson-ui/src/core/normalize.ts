import type { ChSONDocument, Entry, Section } from '@chson/schema'

export function getSections(data: ChSONDocument): Section[] {
  const sections = (data as { sections?: unknown }).sections
  return Array.isArray(sections) ? (sections as Section[]) : []
}

export function getEntries(section: Section): Entry[] {
  const entries = (section as { entries?: unknown }).entries
  return Array.isArray(entries) ? (entries as Entry[]) : []
}
