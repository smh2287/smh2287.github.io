# DESIGN.md — Quiet Sheet

## Overview
The site is Minho's PDF, made quieter. Every screen is one presentation sheet: the PDF label pair top-left (`MERCEDES BENZ` / `CLE CABRIOLET _EXTERIOR`), a single wide plate centred with generous margins, one caption line, and the tiny mint footer (`minho.song` … `digital visualization portfolio 2026`). Sheets stack with a 2px darker seam between them, like pages in a viewer. Text is minimal.

## Colors
| token | hex | role |
|---|---|---|
| `--bg` | `#1F2021` | sheet (PDF page charcoal) |
| `--deep` | `#121213` | seam between sheets, lock backdrop |
| `--ink` | `#E8E8EA` | `MERCEDES BENZ`, caption lead |
| `--mid` | `#A9A9A9` | caption text |
| `--mute` | `#60656E` | page numbers, inactive index |
| `--hair` | `#2B2B2B` | index rule, comment border |
| `--mint` | `#1FFFE0` | `CLE CABRIOLET _EXTERIOR` label, footer, active index number |

Only other chroma: the red interior inside the images.

## Typography
One family, Montserrat (the PDF's geometric sans):
- 700 11px +0.12em uppercase — brand line (`MERCEDES BENZ`).
- 600 15px +0.06em uppercase mint — model label; the `_EXTERIOR` suffix in 300.
- 600/300 12px — caption: bold lead (`Athletic Stance`) + light sentence, as in the PDF.
- 500 9–10px +0.14em uppercase — page numbers, footer, index.

## Spacing / grid / plate
- Side margin `clamp(20px, 8.4vw, 120px)`; sheet = 100svh, rows: label / plate / footer.
- **Plate 12 : 5 (2.4 : 1)**, width `min(100vw − 2·margin, (100svh − 300px) × 2.4)` → 1200 × 500 at 1440 × 900, the exact PDF page size.
- Studio shots wider than 2.4 are contained and faded into the sheet; others are covered.

## Components
- **Label pair**: brand line + mint model label. Page number `03 / 11` top-right in mute.
- **Plate + caption**: centred plate, caption 16px under it, left-aligned.
- **Home index**: one hairline under the plate, six tiny entries `01 CLE CABRIOLET … 06 NIVA` spread across the plate width; hover/focus swaps the plate and the label pair.
- **Footer**: mint `minho.song` left; right, a 22px spectrum seal + `digital visualization portfolio 2026`.
- **Lock**: a single 2.4 : 1 sheet on the deep backdrop — `MINHO SONG / PRIVATE _PORTFOLIO`, an underlined field (mint on focus), the same footer. Any input + Enter opens.
- **Comments**: the last sheet, `CLE CABRIOLET _COMMENTS`, a 2.4 : 1 bordered slot, then `← Index · Lock · 02 MDEK →`.

## Motion
Only the home plate cross-fades (0.7s) when the index changes. Reduced motion: none.

## Mint + spectrum
Mint is used exactly where the PDF uses it: the model label and the footer, plus the active index number. Spectrum appears once: a 1px, 22px seal before the footer text, running mint → blue → violet, so mint is the anchor end. No fills, no glow.

## Do / Don't
- Do keep one plate per sheet and keep the margins empty.
- Do follow the PDF label grammar (`_EXTERIOR`, `_INTERIOR`, `_CLOSEUP`, `_MODEL`, `_REVIEW`).
- Don't paste PDF pages as images; the sheet is built from type + one plate.
- Don't add a second family, cards or grids.
