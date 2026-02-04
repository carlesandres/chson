# Vim Essentials

Version: 9.x
Published: 2026-01-16

Essential Vim commands for text editing.

## Modes

| Example | Description |
| --- | --- |
| <pre>Esc</pre> | Return to normal mode from any other mode. |
| <pre>i</pre> | Enter insert mode before cursor. |
| <pre>a</pre> | Enter insert mode after cursor. |
| <pre>v</pre> | Start character-wise visual selection. |
| <pre>V</pre> | Start line-wise visual selection. |
| <pre>:</pre> | Enter command-line mode. |

## Navigation

| Example | Description |
| --- | --- |
| <pre>h j k l</pre> | Left, down, up, right. |
| <pre>w</pre> | Jump to start of next word. |
| <pre>b</pre> | Jump to start of previous word. |
| <pre>0</pre> | Jump to beginning of line. |
| <pre>$</pre> | Jump to end of line. |
| <pre>gg</pre> | Jump to first line of file. |
| <pre>G</pre> | Jump to last line of file. |
| <pre>42G</pre> | Jump to line 42. |

## Editing

| Example | Description |
| --- | --- |
| <pre>x</pre> | Delete character under cursor. |
| <pre>dw</pre> | Delete from cursor to start of next word. |
| <pre>dd</pre> | Delete entire current line. |
| <pre>cw</pre> | Delete word and enter insert mode. |
| <pre>cc</pre> | Delete line and enter insert mode. |
| <pre>r</pre> | Replace single character under cursor. |
| <pre>u</pre> | Undo last change. |
| <pre>Ctrl+r</pre> | Redo last undone change. |

## Copy & Paste

| Example | Description |
| --- | --- |
| <pre>yy</pre> | Copy current line. |
| <pre>yw</pre> | Copy from cursor to start of next word. |
| <pre>p</pre> | Paste after cursor. |
| <pre>P</pre> | Paste before cursor. |

## Search

| Example | Description |
| --- | --- |
| <pre>/pattern</pre> | Search for pattern forward. |
| <pre>?pattern</pre> | Search for pattern backward. |
| <pre>n</pre> | Jump to next search match. |
| <pre>N</pre> | Jump to previous search match. |
| <pre>:%s/old/new/g</pre> | Replace all occurrences in file. |

## Files

| Example | Description |
| --- | --- |
| <pre>:w</pre> | Write current file to disk. |
| <pre>:q</pre> | Quit (fails if unsaved changes). |
| <pre>:wq</pre> | Write and quit. |
| <pre>:q!</pre> | Quit without saving changes. |
| <pre>:e filename</pre> | Open another file for editing. |
