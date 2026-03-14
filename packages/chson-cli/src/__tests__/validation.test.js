import { describe, it, expect, beforeAll } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import schema from '@chson/schema' with { type: 'json' }

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const registryDir = path.resolve(__dirname, '../../../chson-registry/cheatsheets')

/**
 * Collect all .chson.json files recursively from a directory
 */
function collectChsonFiles(dir) {
  const results = []
  
  function walk(currentPath) {
    const stat = fs.statSync(currentPath)
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(currentPath)) {
        walk(path.join(currentPath, entry))
      }
      return
    }
    if (stat.isFile() && currentPath.endsWith('.chson.json')) {
      results.push(currentPath)
    }
  }
  
  walk(dir)
  return results
}

describe('CLI Validation', () => {
  let validate

  beforeAll(() => {
    const ajv = new Ajv({ allErrors: true, strict: false })
    addFormats(ajv)
    validate = ajv.compile(schema)
  })

  describe('Schema validation', () => {
    it('accepts valid minimal cheatsheet', () => {
      const valid = {
        title: 'Test',
        publicationDate: '2024-01-01',
        description: 'A test cheatsheet',
        sections: [
          {
            title: 'Section 1',
            entries: [
              { anchor: 'test', content: 'description' }
            ]
          }
        ]
      }
      expect(validate(valid)).toBe(true)
    })

    it('accepts valid full cheatsheet', () => {
      const valid = {
        $schema: 'https://chson.dev/api/schema.json',
        title: 'Full Test',
        version: '1.0',
        publicationDate: '2024-01-01',
        description: 'A complete test cheatsheet',
        documentType: 'cheatsheet',
        author: 'Test Author',
        license: 'MIT',
        homepage: 'https://example.com',
        tags: ['test', 'example'],
        retrievalDirection: 'mechanism-to-meaning',
        anchorLabel: 'Command',
        contentLabel: 'Description',
        sections: [
          {
            title: 'Section 1',
            description: 'First section',
            entries: [
              { anchor: 'cmd', content: 'description', details: 'more info', url: 'https://docs.example.com' }
            ]
          }
        ]
      }
      expect(validate(valid)).toBe(true)
    })

    it('rejects missing required field: title', () => {
      const invalid = {
        publicationDate: '2024-01-01',
        description: 'Missing title',
        sections: [{ title: 'S', entries: [{ anchor: 'a', content: 'b' }] }]
      }
      expect(validate(invalid)).toBe(false)
      expect(validate.errors.some(e => e.message.includes('title'))).toBe(true)
    })

    it('rejects missing required field: publicationDate', () => {
      const invalid = {
        title: 'Test',
        description: 'Missing date',
        sections: [{ title: 'S', entries: [{ anchor: 'a', content: 'b' }] }]
      }
      expect(validate(invalid)).toBe(false)
    })

    it('rejects missing required field: description', () => {
      const invalid = {
        title: 'Test',
        publicationDate: '2024-01-01',
        sections: [{ title: 'S', entries: [{ anchor: 'a', content: 'b' }] }]
      }
      expect(validate(invalid)).toBe(false)
    })

    it('rejects missing required field: sections', () => {
      const invalid = {
        title: 'Test',
        publicationDate: '2024-01-01',
        description: 'No sections'
      }
      expect(validate(invalid)).toBe(false)
    })

    it('rejects empty sections array', () => {
      const invalid = {
        title: 'Test',
        publicationDate: '2024-01-01',
        description: 'Empty sections',
        sections: []
      }
      expect(validate(invalid)).toBe(false)
    })

    it('rejects empty entries array', () => {
      const invalid = {
        title: 'Test',
        publicationDate: '2024-01-01',
        description: 'Empty entries',
        sections: [{ title: 'Section', entries: [] }]
      }
      expect(validate(invalid)).toBe(false)
    })
  })

  describe('Character limits', () => {
    it('rejects title over 80 characters', () => {
      const invalid = {
        title: 'A'.repeat(81),
        publicationDate: '2024-01-01',
        description: 'Too long title',
        sections: [{ title: 'S', entries: [{ anchor: 'a', content: 'b' }] }]
      }
      expect(validate(invalid)).toBe(false)
      expect(validate.errors.some(e => e.keyword === 'maxLength')).toBe(true)
    })

    it('accepts title at exactly 80 characters', () => {
      const valid = {
        title: 'A'.repeat(80),
        publicationDate: '2024-01-01',
        description: 'Max length title',
        sections: [{ title: 'S', entries: [{ anchor: 'a', content: 'b' }] }]
      }
      expect(validate(valid)).toBe(true)
    })

    it('rejects description over 150 characters', () => {
      const invalid = {
        title: 'Test',
        publicationDate: '2024-01-01',
        description: 'D'.repeat(151),
        sections: [{ title: 'S', entries: [{ anchor: 'a', content: 'b' }] }]
      }
      expect(validate(invalid)).toBe(false)
    })

    it('rejects anchor over 100 characters', () => {
      const invalid = {
        title: 'Test',
        publicationDate: '2024-01-01',
        description: 'Test',
        sections: [{ title: 'S', entries: [{ anchor: 'A'.repeat(101), content: 'b' }] }]
      }
      expect(validate(invalid)).toBe(false)
    })

    it('rejects content over 150 characters', () => {
      const invalid = {
        title: 'Test',
        publicationDate: '2024-01-01',
        description: 'Test',
        sections: [{ title: 'S', entries: [{ anchor: 'a', content: 'C'.repeat(151) }] }]
      }
      expect(validate(invalid)).toBe(false)
    })

    it('rejects section title over 100 characters', () => {
      const invalid = {
        title: 'Test',
        publicationDate: '2024-01-01',
        description: 'Test',
        sections: [{ title: 'T'.repeat(101), entries: [{ anchor: 'a', content: 'b' }] }]
      }
      expect(validate(invalid)).toBe(false)
    })

    it('allows unlimited details length', () => {
      const valid = {
        title: 'Test',
        publicationDate: '2024-01-01',
        description: 'Test',
        sections: [{
          title: 'Section',
          entries: [{
            anchor: 'cmd',
            content: 'description',
            details: 'D'.repeat(5000) // Very long details should be allowed
          }]
        }]
      }
      expect(validate(valid)).toBe(true)
    })
  })

  describe('Enum validation', () => {
    it('accepts valid retrievalDirection: mechanism-to-meaning', () => {
      const valid = {
        title: 'Test',
        publicationDate: '2024-01-01',
        description: 'Test',
        retrievalDirection: 'mechanism-to-meaning',
        sections: [{ title: 'S', entries: [{ anchor: 'a', content: 'b' }] }]
      }
      expect(validate(valid)).toBe(true)
    })

    it('accepts valid retrievalDirection: intent-to-mechanism', () => {
      const valid = {
        title: 'Test',
        publicationDate: '2024-01-01',
        description: 'Test',
        retrievalDirection: 'intent-to-mechanism',
        sections: [{ title: 'S', entries: [{ anchor: 'a', content: 'b' }] }]
      }
      expect(validate(valid)).toBe(true)
    })

    it('rejects invalid retrievalDirection', () => {
      const invalid = {
        title: 'Test',
        publicationDate: '2024-01-01',
        description: 'Test',
        retrievalDirection: 'invalid-direction',
        sections: [{ title: 'S', entries: [{ anchor: 'a', content: 'b' }] }]
      }
      expect(validate(invalid)).toBe(false)
    })

    it('accepts valid documentType values', () => {
      const types = ['cheatsheet', 'checklist', 'runbook', 'tldr', 'bookmarks']
      for (const docType of types) {
        const valid = {
          title: 'Test',
          publicationDate: '2024-01-01',
          description: 'Test',
          documentType: docType,
          sections: [{ title: 'S', entries: [{ anchor: 'a', content: 'b' }] }]
        }
        expect(validate(valid)).toBe(true)
      }
    })

    it('rejects invalid documentType', () => {
      const invalid = {
        title: 'Test',
        publicationDate: '2024-01-01',
        description: 'Test',
        documentType: 'invalid-type',
        sections: [{ title: 'S', entries: [{ anchor: 'a', content: 'b' }] }]
      }
      expect(validate(invalid)).toBe(false)
    })
  })

  describe('Format validation', () => {
    it('rejects invalid date format', () => {
      const invalid = {
        title: 'Test',
        publicationDate: 'not-a-date',
        description: 'Test',
        sections: [{ title: 'S', entries: [{ anchor: 'a', content: 'b' }] }]
      }
      expect(validate(invalid)).toBe(false)
    })

    it('rejects invalid URL format in homepage', () => {
      const invalid = {
        title: 'Test',
        publicationDate: '2024-01-01',
        description: 'Test',
        homepage: 'not-a-url',
        sections: [{ title: 'S', entries: [{ anchor: 'a', content: 'b' }] }]
      }
      expect(validate(invalid)).toBe(false)
    })

    it('rejects invalid URL format in entry.url', () => {
      const invalid = {
        title: 'Test',
        publicationDate: '2024-01-01',
        description: 'Test',
        sections: [{
          title: 'Section',
          entries: [{ anchor: 'cmd', content: 'desc', url: 'not-a-url' }]
        }]
      }
      expect(validate(invalid)).toBe(false)
    })
  })

  describe('Real cheatsheets validation (integration)', () => {
    const cheatsheetFiles = fs.existsSync(registryDir)
      ? collectChsonFiles(registryDir)
      : []

    it('registry directory exists and contains cheatsheets', () => {
      expect(cheatsheetFiles.length).toBeGreaterThan(0)
    })

    it.each(cheatsheetFiles.map(f => [path.relative(registryDir, f), f]))(
      'validates %s',
      (_, filePath) => {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        const isValid = validate(data)
        if (!isValid) {
          console.error(`Validation errors for ${filePath}:`, validate.errors)
        }
        expect(isValid).toBe(true)
      }
    )
  })
})
