import { safeExternalUrl } from './url'

/** True when an entry should render progressive disclosure content. */
export function hasEntryMore(details?: string, url?: string): boolean {
  if (details) return true
  if (url && safeExternalUrl(url)) return true
  return false
}
