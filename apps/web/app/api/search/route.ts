import { source } from 'lib/source'
import { createFromSource } from 'fumadocs-core/search/server'

/**
 * Search API endpoint for Fumadocs documentation.
 *
 * Uses Orama search engine to index and search through MDX content.
 * The search indexes are built from the source defined in lib/source.ts.
 */
export const { GET } = createFromSource(source, {
  language: 'english',
})
