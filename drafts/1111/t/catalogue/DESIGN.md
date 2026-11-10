# DESIGN.md — Catalogue

## Overview / mood
A museum catalogue raisonné as an interface. The whole home page is one table — Cat. no., title, context, medium, year, plates — on cool grey. Rows open in place to show a strip of cropped plates and a short entry; the full entry page keeps the catalogue data pinned on the left while plates scroll on the right. Type is small and even; hierarchy comes from the table, the lighter open-row tone and one prism hairline.

## Colors
| Token | Hex | Role |
|---|---|---|
| `--bg` | `#DADDE0` | Page, cool grey |
| `--open` | `#E8EAEC` | Opened row, comment slot (one step lighter) |
| `--ink` | `#14171A` | Text, strong rules |
| `--mute` | `#69717A` | Secondary text, table header |
| `--rule` / `--soft` | `#A9B0B7` / `#C6CBD0` | Row rules / data-list rules |
| `--plate` | `#0F1012` | Image ground |
| `--prism` | `#6A5BFF → #2FA8F0 → #35C9A0 → #E8D24A → #F2893E → #E0447C` | 1px hairline only |

No accent colour. The interface is achromatic so the renders supply all colour.

## Typography
- **Geist** 400/500 for everything; **Geist Mono** 400 for catalogue numbers, plate numbers and table headers (10.5px uppercase +0.06em).
- Scale: entry title 64px / .98 / -0.035em · intro 26px / 1.14 / -0.022em · section title 26px · row title 20px / -0.018em · text 13px / 1.45.
- Year after a title is set in mute at the same size (`Title, 2025`).

## Spacing / grid
- One shared column template for header, table, panels and footer: `96 | 1.5fr | 1.15fr | 1fr | 84 | 64 | 28`, 16px gap, 24px margins. Everything left-aligns to a table column.
- Rows 50px; open panel = 262px plate strip + 26px foot. Plate gutter 6px (tight, like a contact sheet).
- Entry page: 320px sticky data column + plates column; sections separated by a rule and a three-part header (label / title / text).

## Components
- **Index row**: button row with `+ / −` glyph. One row open at a time; opening expands a panel (grid-rows 0fr→1fr) with a strip of 4 cropped plates (mono `Pl.` tags), a summary, a data list and `Open entry →`. The first entry is open on load.
- **Image plate**: sharp, frameless; pairs share a height (one natural, one cover-cropped); 6px gutters.
- **Caption**: grid line under the plate — `Pl. 9` (mono) · description · category (mono, mute).
- **Nav**: plain text top row on the table columns; current item underlined.
- **Data column**: definition list with soft rules; section list with plate ranges and scroll-spy dot.
- **Lock**: an empty catalogue with a single open row `Cat. 00` — the passcode is typed into the row. Any input + Enter opens.
- **Comments**: fixed last section in the plates column, in the open-row tone.

## Motion
Row expansion .35s (ease-out), plus/minus glyph .25s, background .2s. No image motion. Reduced motion removes transitions.

## Do / Don't
- Do keep all type at 13px except titles. Do align every element to a table column.
- Do crop boldly inside the strip (details read better than whole cars at 262px).
- Don't add colour to UI, don't use cards or shadows, don't open more than one row.
- Don't let the prism line exceed 1px or appear more than once per view.

## Spectrum
Used once, as light: a 1px full-spectrum hairline replaces the top rule of whatever is currently *open* — the open row on the index, the lock row, and the rule under the entry title. It marks "the light is on here"; it never encodes category or process stage.
