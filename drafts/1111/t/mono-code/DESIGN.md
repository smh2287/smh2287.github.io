# DESIGN.md — Mono Code

## Overview / mood
A portfolio that behaves like a well-made tool. One monospace family at essentially one size; hierarchy comes from weight (400/500), grey level and position on a fixed character grid. The home is a file-list index you can drive entirely from the keyboard (`j`/`k`, `1–6`, `/` filter, `↵` open, `l` lock) with a live preview pane; the project page is a document with a file-tree rail, per-plate filenames and a status bar that always says where you are. Precision is the sensory quality: every edge aligns, every state change is instant.

## Colors
| Token | Hex | Role |
|---|---|---|
| `--bg` | `#FBFBFA` | Page, bars |
| `--ink` | `#111112` | Text, selected row fill, mode block, focus outline |
| `--mute` | `#9B9B97` | Secondary text, keys' labels, comments |
| `--dim` | `#C9C9C5` | Separators, placeholder |
| `--line` | `#E6E6E3` | Rules (solid for structure, dashed between rows) |
| `--hover` | `#F1F1EF` | Row hover |
| `--spec` | `#6C5CFF → #27B7FF → #35E0A1 → #FFD84A → #FF8A3D → #FF4D6D` | 2px cursor sliver and 2px reading-progress line only |

Image plates sit on `#111`. No other colour.

## Typography
- **JetBrains Mono** 400 / 500, slashed zero. Base 12.5px / 1.6. Small 11px (column heads, status, plate headers). The only larger size is the project H1 at 30px / 1.15 / -0.03em.
- Lowercase by default; uppercase only for the mode block (`INDEX`, `READ`).
- Intro is written as a doc comment (`/** … */`); empty states as `// comments`.

## Spacing / grid
- 8px unit, 32px page margins, 40px top bar, 32px status bar.
- Home: index column (fluid) + preview pane (≤600px), 72px gap. Row grid: `44px | 1fr | 236px | 56px | 40px` — #, project, kind, year, key hint. Rows 42px.
- Project: 232px rail + document (≤1120px), 56px gap. Section header grid `150px | 300px | 1fr`. Plate rows flex by natural ratio with 8px gap, 22px between rows, 88px between sections.

## Components
- **Index row**: number · name (500) · kind · year · `kbd` hint, dashed rule below. Hover = `--hover`. Selected = solid ink row with reversed text and a 2px spectrum sliver on its left edge (the cursor).
- **Filter**: `/` focuses a plain input above the list; rows filter live; `esc` clears.
- **Preview pane**: 4:3 image inside four 9px corner ticks, then a key/value list (name, kind, year, plates, path). Sticky.
- **Image plate**: header line with plate code + filename left and pixel size right, image, one-line caption below. The plate currently in the reading position gets a 1px ink outline at 3px offset.
- **Rail** (project): file tree of sections with counts, active section in ink; project key/values pinned to the bottom.
- **Nav / bars**: top bar = `minho-song / work · about · contact`, Seoul clock, `lock`. Status bar = mode block, key hints as `kbd`, position counter `01/06`.
- **Lock**: a prompt box (`> ____ ↵`) with an 8-segment meter that fills per character. Any input + Enter opens.
- **Comments**: fixed last section; dashed slot containing a one-line prompt input.

## Motion
- State changes are immediate (≤120ms colour only). Preview swaps without fade. `j`/`k` on the project page smooth-scrolls plate to plate; `prefers-reduced-motion` makes that instant.

## Do / Don't
- Do keep one size and let grey levels do the hierarchy. Do show a `kbd` for every shortcut that exists.
- Do keep the selected row solid ink — it is the only large dark shape.
- Don't add a second typeface, icons, rounded cards or shadows.
- Don't colour syntax-highlight the text; this is not a fake terminal.

## Spectrum
Two 2px slivers: the cursor on the selected index row and the reading-progress line at the top of the project page. One continuous gradient, never split into per-section colours.
