---
sidebar_position: 1
---

# git Core Cheats

Version: 2.x
Published: 2026-01-15T00:00:00Z

Common git commands for day-to-day work.

## Inspect

Understand repo state and history.

| Cheat | Description |
| --- | --- |
| Working tree status | git status<br/><br/><strong>Comments</strong><br/><pre>{<br/>  "example": "git status --porcelain"<br/>}</pre> |
| Show last commits | git log --oneline --decorate --graph --max-count 20 |

## Changes

| Cheat | Description |
| --- | --- |
| Stage everything (current directory) | git add .<br/><br/><strong>Comments</strong><br/><pre>Stages all changes under the current directory.</pre> |
| Commit with message | git commit -m "message" |
