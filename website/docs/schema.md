---
sidebar_position: 2
---

# Schema Reference

CSIF uses [JSON Schema](https://json-schema.org/) (Draft 2020-12) for validation.

**Schema URL:** `https://csif.sh/schema/v1/csif.schema.json`

## Top-Level Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `$schema` | string | No | Schema URL for editor support |
| `title` | string | Yes | Cheatsheet title |
| `version` | string | No | Version of the software being documented |
| `publicationDate` | string | Yes | ISO 8601 date or datetime |
| `description` | string | Yes | Brief description of the cheatsheet |
| `metadata` | object | No | Custom fields (homepage, category, etc.) |
| `sections` | array | Yes | Array of section objects |

## Section Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Section heading |
| `description` | string | No | Section description |
| `items` | array | Yes | Array of cheat items |

## Item Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Short name for the cheat |
| `description` | string | Yes | What it does |
| `example` | string | No | Code example or command |
| `comments` | any | No | Additional notes or structured data |

## Minimal Example

```json
{
  "$schema": "https://csif.sh/schema/v1/csif.schema.json",
  "title": "My Cheatsheet",
  "publicationDate": "2026-01-16",
  "description": "A minimal CSIF cheatsheet.",
  "sections": [
    {
      "title": "Getting Started",
      "items": [
        {
          "title": "Hello World",
          "description": "Print hello world.",
          "example": "echo 'Hello, World!'"
        }
      ]
    }
  ]
}
```

## Extensibility

CSIF allows additional properties at all levels (`additionalProperties: true`). This lets you add custom fields for your specific use case while remaining compatible with standard tooling.

Common custom fields in `metadata`:
- `homepage` - URL to the official documentation
- `category` - Type of tool (cli, editor, language, etc.)
- `tags` - Array of searchable tags
