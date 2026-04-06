export type InlineMarkdownToken =
  | { type: 'text'; value: string }
  | { type: 'code'; value: string }
  | { type: 'strong'; value: string }
  | { type: 'em'; value: string }
  | { type: 'link'; label: string; url: string }

function pushText(tokens: InlineMarkdownToken[], value: string) {
  if (!value) return
  const prev = tokens.at(-1)
  if (prev?.type === 'text') {
    prev.value += value
    return
  }
  tokens.push({ type: 'text', value })
}

/**
 * Markdown-lite inline parser.
 * Supports: `code`, **strong**, *em*, and [label](url).
 * Intentionally does not support nesting or block elements.
 */
export function parseInlineMarkdown(input: string): InlineMarkdownToken[] {
  const tokens: InlineMarkdownToken[] = []
  let i = 0

  while (i < input.length) {
    const rest = input.slice(i)

    if (rest.startsWith('`')) {
      const end = input.indexOf('`', i + 1)
      if (end !== -1) {
        tokens.push({ type: 'code', value: input.slice(i + 1, end) })
        i = end + 1
        continue
      }
    }

    if (rest.startsWith('**')) {
      const end = input.indexOf('**', i + 2)
      if (end !== -1) {
        tokens.push({ type: 'strong', value: input.slice(i + 2, end) })
        i = end + 2
        continue
      }
    }

    if (rest.startsWith('*') && !rest.startsWith('**')) {
      const end = input.indexOf('*', i + 1)
      if (end !== -1) {
        tokens.push({ type: 'em', value: input.slice(i + 1, end) })
        i = end + 1
        continue
      }
    }

    if (rest.startsWith('[')) {
      const closeLabel = input.indexOf(']', i + 1)
      if (closeLabel !== -1 && input[closeLabel + 1] === '(') {
        const closeUrl = input.indexOf(')', closeLabel + 2)
        if (closeUrl !== -1) {
          const label = input.slice(i + 1, closeLabel)
          const url = input.slice(closeLabel + 2, closeUrl)
          tokens.push({ type: 'link', label, url })
          i = closeUrl + 1
          continue
        }
      }
    }

    const nextSpecial = (() => {
      const idxs = [
        input.indexOf('`', i),
        input.indexOf('*', i),
        input.indexOf('[', i),
      ].filter((n) => n !== -1)
      return idxs.length ? Math.min(...idxs) : -1
    })()

    if (nextSpecial === -1) {
      pushText(tokens, input.slice(i))
      break
    }

    if (nextSpecial === i) {
      pushText(tokens, input[i])
      i++
      continue
    }

    pushText(tokens, input.slice(i, nextSpecial))
    i = nextSpecial
  }

  return tokens
}
