import { describe, it, expect, beforeAll } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const schemaPath = path.resolve(__dirname, '../schema/chson.schema.json')
const registryDir = path.resolve(__dirname, '../../chson-registry/cheatsheets')

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

describe('ChSON Schema', () => {
  let schema
  let validate

  beforeAll(() => {
    schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'))
    const ajv = new Ajv({ allErrors: true, strict: false })
    addFormats(ajv)
    validate = ajv.compile(schema)
  })

  describe('Schema structure', () => {
    it('has correct $schema draft', () => {
      expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema')
    })

    it('has correct $id', () => {
      expect(schema.$id).toBe('https://chson.dev/api/schema.json')
    })

    it('requires title, publicationDate, description, sections', () => {
      expect(schema.required).toContain('title')
      expect(schema.required).toContain('publicationDate')
      expect(schema.required).toContain('description')
      expect(schema.required).toContain('sections')
    })

    it('defines retrievalDirection enum correctly', () => {
      const enumValues = schema.properties.retrievalDirection.enum
      expect(enumValues).toContain('intent-to-mechanism')
      expect(enumValues).toContain('mechanism-to-meaning')
      expect(enumValues.length).toBe(2)
    })

    it('defines documentType enum correctly', () => {
      const enumValues = schema.properties.documentType.enum
      expect(enumValues).toContain('cheatsheet')
      expect(enumValues).toContain('checklist')
      expect(enumValues).toContain('runbook')
      expect(enumValues).toContain('tldr')
      expect(enumValues).toContain('bookmarks')
      expect(enumValues.length).toBe(5)
    })

    it('defines section with required title and entries', () => {
      const sectionDef = schema.$defs.section
      expect(sectionDef.required).toContain('title')
      expect(sectionDef.required).toContain('entries')
    })

    it('defines entry with required anchor and content', () => {
      const entryDef = schema.$defs.entry
      expect(entryDef.required).toContain('anchor')
      expect(entryDef.required).toContain('content')
    })

    it('requires at least one section', () => {
      expect(schema.properties.sections.minItems).toBe(1)
    })

    it('requires at least one entry per section', () => {
      expect(schema.$defs.section.properties.entries.minItems).toBe(1)
    })
  })

  describe('Character limits', () => {
    it('limits title to 80 characters', () => {
      expect(schema.properties.title.maxLength).toBe(80)
    })

    it('limits description to 150 characters', () => {
      expect(schema.properties.description.maxLength).toBe(150)
    })

    it('limits section title to 100 characters', () => {
      expect(schema.$defs.section.properties.title.maxLength).toBe(100)
    })

    it('limits anchor to 100 characters', () => {
      expect(schema.$defs.entry.properties.anchor.maxLength).toBe(100)
    })

    it('limits content to 150 characters', () => {
      expect(schema.$defs.entry.properties.content.maxLength).toBe(150)
    })

    it('limits anchorLabel to 50 characters', () => {
      expect(schema.properties.anchorLabel.maxLength).toBe(50)
    })

    it('limits contentLabel to 50 characters', () => {
      expect(schema.properties.contentLabel.maxLength).toBe(50)
    })

    it('does NOT limit details (progressive disclosure)', () => {
      // details should NOT have maxLength to support extended explanations
      expect(schema.$defs.entry.properties.details.maxLength).toBeUndefined()
    })

  })

  describe('Format validation', () => {
    it('validates homepage as URI', () => {
      expect(schema.properties.homepage.format).toBe('uri')
    })

    it('validates entry.url as URI', () => {
      expect(schema.$defs.entry.properties.url.format).toBe('uri')
    })

    it('validates publicationDate as date or date-time', () => {
      const dateSchema = schema.properties.publicationDate
      expect(dateSchema.anyOf).toBeDefined()
      const formats = dateSchema.anyOf.map(s => s.format)
      expect(formats).toContain('date')
      expect(formats).toContain('date-time')
    })
  })

  describe('Validation behavior', () => {
    it('rejects title over 80 characters', () => {
      const invalid = {
        title: 'A'.repeat(81),
        publicationDate: '2024-01-01',
        description: 'Test',
        sections: [{ title: 'S', entries: [{ anchor: 'a', content: 'b' }] }]
      }
      expect(validate(invalid)).toBe(false)
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
            details: 'D'.repeat(10000) // Very long details should be allowed
          }]
        }]
      }
      expect(validate(valid)).toBe(true)
    })

    it('rejects empty sections array', () => {
      const invalid = {
        title: 'Test',
        publicationDate: '2024-01-01',
        description: 'Test',
        sections: []
      }
      expect(validate(invalid)).toBe(false)
    })

    it('rejects empty entries array', () => {
      const invalid = {
        title: 'Test',
        publicationDate: '2024-01-01',
        description: 'Test',
        sections: [{ title: 'Section', entries: [] }]
      }
      expect(validate(invalid)).toBe(false)
    })

    it('rejects invalid date format', () => {
      const invalid = {
        title: 'Test',
        publicationDate: 'not-a-date',
        description: 'Test',
        sections: [{ title: 'S', entries: [{ anchor: 'a', content: 'b' }] }]
      }
      expect(validate(invalid)).toBe(false)
    })

    it('rejects invalid URI format in homepage', () => {
      const invalid = {
        title: 'Test',
        publicationDate: '2024-01-01',
        description: 'Test',
        homepage: 'not-a-url',
        sections: [{ title: 'S', entries: [{ anchor: 'a', content: 'b' }] }]
      }
      expect(validate(invalid)).toBe(false)
    })

    it('rejects invalid URI format in entry.url', () => {
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
      '%s validates against schema',
      (_, filePath) => {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        const isValid = validate(data)
        if (!isValid) {
          console.error(`Validation errors for ${filePath}:`, validate.errors)
        }
        expect(isValid).toBe(true)
      }
    )

    it('all cheatsheets have required fields', () => {
      for (const filePath of cheatsheetFiles) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        expect(data.title).toBeTruthy()
        expect(data.publicationDate).toBeTruthy()
        expect(data.description).toBeTruthy()
        expect(data.sections).toBeInstanceOf(Array)
        expect(data.sections.length).toBeGreaterThan(0)
      }
    })

    it('all cheatsheets respect character limits', () => {
      for (const filePath of cheatsheetFiles) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        
        // Check top-level limits
        expect(data.title.length).toBeLessThanOrEqual(80)
        expect(data.description.length).toBeLessThanOrEqual(150)
        
        // Check section/entry limits
        for (const section of data.sections) {
          expect(section.title.length).toBeLessThanOrEqual(100)
          for (const entry of section.entries) {
            expect(entry.anchor.length).toBeLessThanOrEqual(100)
            expect(entry.content.length).toBeLessThanOrEqual(150)
          }
        }
      }
    })
  })
})
