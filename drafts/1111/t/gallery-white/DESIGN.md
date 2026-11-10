# DESIGN.md — Gallery White

## Overview / mood
An exhibition hang on a white wall. Works are placed at deliberately different sizes and offsets on a 12-column grid, each with a small wall label (number, title, medium) tucked under its lower-left corner. Type is one size and one weight; the air between works does the talking. On the home wall the images rest in greyscale and return to colour when approached (hover/focus; always colour on touch devices). Quiet, bright, unhurried.

## Colors
| Token | Hex | Role |
|---|---|---|
| `--wall` | `#FFFFFF` | Page ground |
| `--ink` | `#111111` | Text |
| `--mute` | `#8E8E8E` | Label numbers, secondary lines, inactive controls |
| `--hair` | `#E6E6E6` | Rare 1px rules (footer, comments, next) |
| `--plinth` | `#F4F4F4` | Image placeholder before load |

Monochrome UI. The only colour on the site is inside the photographs.

## Typography
- **Hanken Grotesk** 400 only. No bold: emphasis is ink vs. mute.
- Scale: wall text 13px / 1.45 · labels 12px / 1.45 · room paragraph 14px / 1.5 · room heading 28px / 1.15 / -0.025em · project title 44px / 1.08 / -0.03em (second line in mute).
- Sentence case with full stops, like a wall caption: "Automotive visualization. 22 plates".

## Spacing / grid
- 12 columns, 24px gutter, 40px margins.
- Home hang (rows share a centre line, 150px between rows): work 1 cols 1–7 with work 2 cols 10–12 hung low; work 3 cols 2–4 with work 4 cols 6–12; work 5 cols 1–5 with work 6 cols 8–11. The statement sits top-right as a wall text.
- Project: five plate placements — `a` cols 1–10 label right · `b` cols 3–10 · `c` cols 4–9 (small, centred) · `d` cols 3–12 label left · `f` full width label below — plus `two` pairs (7 + 3 or 3 + 7 columns, centre-aligned). 170px between works; 90–110px around a room heading.

## Components
- **Index row → hung work**: 4:3 image, label absolutely placed under the lower-left corner (number in mute, title, medium in mute). Greyscale → colour over .8s on hover/focus.
- **Image plate**: no border, radius, shadow or background. Natural aspect ratio inside a project; sizes vary on purpose — large for whole-car views, small for boards and details.
- **Caption (wall label)**: 12px, three short lines max; sits beside the plate (`a`–`d`) or below (`f`, pairs).
- **Room heading**: `Room n` in mute (cols 1–2) · 28px heading (cols 3–6) · mute paragraph (cols 8–11).
- **Stage**: the side elevation on bare white with four text buttons (Whole / Parts / UV / Rig); active = ink, others mute; caption centred.
- **Nav**: name left, wall title centre ("Selected works, 2021–2025"), `Works / About / Lock` right. Not sticky.
- **Lock**: an invitation card — three lines of 13px text centred on white, a single underlined passcode field, `Enter`. Any input + Enter opens.
- **Comments**: fixed last section styled as a visitors' book: hairline-ruled lines, 44px line height.

## Motion
- Greyscale ↔ colour .8s; stage cross-fade .5s. Nothing else. `prefers-reduced-motion` removes transitions.

## Do / Don't
- Do vary image size and leave whole columns empty. Do keep labels tiny and close to their work.
- Do keep one weight and (almost) one size.
- Don't align everything into a regular grid of equal thumbnails, add rules between works, tint the wall, or set uppercase labels.
- Don't let two large works share a row.

## Spectrum
Not drawn as graphics. It appears as behaviour: the wall is greyscale and each work releases its full colour only when approached, so colour is felt as an event. Never one colour per process stage.
