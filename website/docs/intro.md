---
sidebar_position: 1
slug: /
---

# What is CSIF?

**CSIF** (CheatSheet Interchange Format) is a simple JSON format for writing software cheatsheets in a consistent, tool-friendly way.

## The Problem

Developers constantly create and share cheatsheets, but they're scattered across PDFs, markdown files, images, and random websites. Each format has limitations:

- **PDFs** aren't searchable or easily updated
- **Markdown** varies wildly in structure
- **Images** can't be searched or copy-pasted
- **Websites** often have ads, paywalls, or disappear

## The Solution

CSIF provides a **standard JSON structure** that any tool can read, write, and transform. Write your cheatsheet once, then:

- Render it as a searchable website
- Generate printable PDFs
- Create flashcard decks for learning
- Import into your personal knowledge base
- Build custom tools on top of it

## Quick Example

```json
{
  "$schema": "https://csif.sh/schema/v1/csif.schema.json",
  "title": "Git Essentials",
  "publicationDate": "2026-01-16",
  "description": "Essential git commands.",
  "sections": [
    {
      "title": "Basics",
      "items": [
        {
          "title": "Check status",
          "example": "git status",
          "description": "Show staged, unstaged, and untracked files."
        }
      ]
    }
  ]
}
```

## Browse Cheatsheets

Check out the [Registry](/docs/registry) to see CSIF in action with real cheatsheets for Git, Docker, npm, Vim, and more.
