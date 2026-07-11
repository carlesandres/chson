import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const cliPath = path.resolve(__dirname, '../chson.js')

function renderMarkdown(doc) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'chson-render-'))
  const filePath = path.join(dir, 'sample.chson.json')
  fs.writeFileSync(filePath, JSON.stringify(doc), 'utf8')
  try {
    return execFileSync(process.execPath, [cliPath, 'render', 'markdown', filePath], {
      encoding: 'utf8',
    })
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
}

describe('CLI render markdown — details/url', () => {
  afterEach(() => {
    // temp dirs cleaned in renderMarkdown
  })

  it('attaches details and url once on the content side (not duplicated)', () => {
    const markdown = renderMarkdown({
      title: 'Git',
      publicationDate: '2026-01-01',
      description: 'Core',
      retrievalDirection: 'mechanism-to-meaning',
      sections: [
        {
          title: 'Basics',
          entries: [
            {
              anchor: 'git status',
              content: 'Show status',
              details: 'Use **short** form with `-s`.',
              url: 'https://example.com/docs',
            },
          ],
        },
      ],
    })

    expect(markdown).toContain('Use **short** form with `-s`.')
    expect(markdown).toContain('[Link](https://example.com/docs)')

    // Appears once each (not once per cell).
    expect(markdown.split('Use **short** form with `-s`.').length - 1).toBe(1)
    expect(markdown.split('[Link](https://example.com/docs)').length - 1).toBe(1)

    // Full escape would turn * into escaped form or mangle markdown — keep raw emphasis markers.
    expect(markdown).not.toMatch(/\\\*short\\\*/)
  })

  it('puts secondary material on the anchor when content is code and anchor is not', () => {
    const markdown = renderMarkdown({
      title: 'Git',
      publicationDate: '2026-01-01',
      description: 'Core',
      formatHints: { anchor: 'text', content: 'code' },
      sections: [
        {
          title: 'Basics',
          entries: [
            {
              anchor: 'Show status',
              content: 'git status',
              details: 'Extra notes',
              url: 'https://example.com',
            },
          ],
        },
      ],
    })

    // Content cell is code-only; secondary lives with the text anchor.
    expect(markdown).toMatch(
      /Show status<br>Extra notes<br>\[Link\]\(https:\/\/example\.com\)/,
    )
    expect(markdown).toContain('<pre>git status</pre>')
    // Secondary must not also appear after the pre cell.
    expect(markdown).not.toMatch(/<pre>git status<\/pre><br>Extra notes/)
  })

  it('does not over-escape markdown in details (lists stay usable)', () => {
    const markdown = renderMarkdown({
      title: 'Git',
      publicationDate: '2026-01-01',
      description: 'Core',
      sections: [
        {
          title: 'Basics',
          entries: [
            {
              anchor: 'git rebase -i',
              content: 'Interactive rebase',
              details: 'Commands:\n- pick\n- squash',
            },
          ],
        },
      ],
    })

    expect(markdown).toContain('Commands:<br/>- pick<br/>- squash')
    // Should not HTML-escape list markers into unusable forms via full escapeMarkdown.
    expect(markdown).not.toContain('&#123;')
  })
})
