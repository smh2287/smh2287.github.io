# DESIGN.md — Swiss Grid

## Overview / mood
International Typographic Style rebuilt for a portfolio. One grotesk, one weight, one signal colour. Structure is carried by three vertical axes (columns 1, 5, 9 of a 12-column grid) and by numerals set very large: the project number is the biggest thing on every page. Nothing decorates; alignment and scale contrast do the sensory work. Cool off-white paper, near-black ink, dark image plates.

## Colors
| Token | Hex | Role |
|---|---|---|
| `--paper` | `#F5F5F2` | Page background |
| `--ink` | `#0B0B0B` | Text, 1–2px rules |
| `--signal` | `#F0301E` | The only accent: active numeral, active row, plate numbers, lock screen field |
| `--mute` | `#8A8A85` | Secondary text, second half of the statement |
| `--hair` | `#D4D4CE` | Inactive tab rules |
| `--plate` | `#101011` | Image plate background (letterbox colour) |

Signal red is never used for backgrounds inside the site — only type and rules. The one exception is the lock screen, which is a full signal-red field.

## Typography
- Family: **Inter Tight** 500 (400 only for long paragraphs). Tabular numerals on.
- Scale (desktop 1440): giant numeral 340px / .74 / -0.065em · H1 88px / .92 / -0.04em · section numeral 200px · index numeral 52px · statement & H2 30px / 1.08 / -0.022em · index title 26px · body 15px / 1.4 · label 13px / 1.38.
- Only two text sizes carry information: 13px (everything small) and 26–30px (everything said aloud). Numerals are the third voice.
- No uppercase, no italics, no letter-spaced labels.

## Spacing / grid
- 12 columns, 16px gutter, 32px margins; 8px base unit.
- Content snaps to three axes: col 1 (numbers/labels), col 5 (titles/statements), col 9 (meta/plates). Year is right-aligned in col 12.
- Horizontal rules: 2px ink opens a block, 1px ink separates rows.
- Section spacing 120px; figure row gap 40px; caption 8px under plate.

## Components
- **Index row**: 58px high, 1px top rule. `No.` 52px numeral (col 1) · title 26px (col 5) · discipline 13px (col 9) · year (col 12). Hover/focus/active turns the entire row signal red; the giant numeral and the plate (col 9–12, 4:3) swap to that project.
- **Image plate**: sharp corners, no border, no shadow, dark plate ground. Rows mix one natural-ratio image with one `fit` (cover-cropped) neighbour so both share a height.
- **Caption**: one line under the plate — red plate number (`3.02`), title, right-aligned view type in mute.
- **Stage** (project top): one 3.2:1 plate with a 4-step tab rail (0 Whole / 1 Parts / 2 Surface / 3 Rig); active tab = 2px red rule; one 26px sentence explains the state.
- **Nav**: single text row on the three axes; current item red; `Lock` is the last item.
- **Lock**: full signal-red field, giant white `00`, passcode input on a 2px white rule aligned to col 5. Any input + Enter opens.
- **Comments**: fixed last section, 1px ink box aligned to col 5–12, plate-number reference hint.

## Motion
- Only opacity cross-fades (.25s linear) on plate/stage swaps and .12s colour change on rows. No transforms, no scroll effects. `prefers-reduced-motion` removes all transitions.

## Do / Don't
- Do keep every left edge on col 1, 5 or 9. Do let numerals be huge and everything else small.
- Do crop detail plates; never crop a whole-car plate.
- Don't add a second accent, rounded corners, shadows, icons or uppercase labels.
- Don't centre anything.

## Spectrum
Not used. This template is the monochrome control: one signal colour stands in for the whole spectrum. If Spectrum is wanted later, the only permitted place is the lock field (a single red → prism sweep on unlock), never per-section colours.
