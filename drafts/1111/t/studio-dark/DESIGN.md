# DESIGN.md — Studio Dark

## Overview / mood
A car studio with the lights down. The page is near-black; the car sits in a full-bleed band lit by one soft box from above, its edges falling off into the dark. Below it, the project list is a spec sheet: mono columns (No. / Project / With / Discipline / Year) on hairlines. Light-weight grotesk for names, mono for data. Restraint is the point — one light, one thin red tick, no glow, no chrome.

## Colors
| Token | Hex | Role |
|---|---|---|
| `--bg` | `#0A0A0B` | Page ground |
| `--bg2` | `#101012` | Raised slot (comments) |
| `--ink` | `#ECEAE6` | Primary text (warm white) |
| `--mid` | `#9B9A97` | Data text, captions numbers |
| `--mute` | `#66665F` | Inactive rows, column heads |
| `--hair` | `#232325` | 1px rules |
| `--acc` | `#D9382C` | Tail-lamp red: 14px tick beside the active row, 1px active-mode rule |

Red appears as a line no longer than ~120px and never as a fill or text colour.

## Typography
- **Geist** 300 (display) / 400 (body) / 500 (name). **Geist Mono** 400, 11px, uppercase, +0.06em for all data.
- Scale (1440): project title 92px / .98 / -0.045em · home hero title 46px / 1.05 · section heading 36px / 1.08 · list name 16px · body 15px / 1.5 · data 11px.
- Display is always weight 300 — on black, thin type reads as light.

## Spacing / grid
- 28px margins. Top bar 56px.
- Home: hero band (3.2:1, capped so the six-row sheet always fits in 900px) + sheet with columns `64px · 4.2fr · 2.4fr · 3fr · 90px · 40px`, rows 44px.
- Project: header splits title / 4-row spec table; sections open with a `2fr · 5fr · 5fr` header on a hairline, 140px above.
- Plates are full-bleed, stacked with 2px gaps; duo rows share height via `--r`.

## Components
- **Index row**: 44px, hairline below. Inactive rows are mute; the active/hovered row turns ink, shows `→`, and a 14px red tick appears in the margin. The hero image and title cross-fade to that project.
- **Image plate (`.lit`)**: full-bleed, no radius. Overlay = soft-box radial highlight from the top + edge fall-off to `--bg` left/right/bottom, so renders melt into the page instead of sitting in boxes.
- **Caption**: mono, plate number in `--mid` + description in `--mute`, 10px under the plate.
- **Stage**: full-bleed side view with four mono tabs (0 Whole / 1 Parts / 2 UV / 3 Rig); active tab has a 1px red top rule; a short sentence right-aligned.
- **Nav**: name left, three mono links centred, `Lock` right. Not sticky.
- **Lock**: black screen with the same soft-box light, name in 300 weight, centred passcode input on a hairline, mono `Passcode / Enter`. Any input + Enter opens.
- **Comments**: fixed last section, heading + `--bg2` slot with hairline border.

## Motion
- Hero and stage cross-fade .7s / .5s ease; row colour .2s. No parallax, no light sweeps. `prefers-reduced-motion` removes all transitions.

## Do / Don't
- Do let images bleed to the edges and dissolve; do keep data in mono columns.
- Do keep one light direction (top) on every plate.
- Don't use pure black or pure white, neon accents, glows, glass, or bold weights.
- Don't put bright-background images (mood boards) full-bleed without the fall-off overlay.

## Spectrum
Not used by default: the car's red interior and the red tick are the only chroma. Optional: the soft-box highlight on the lock screen may carry a very faint prismatic edge (≤6% opacity) — a studio lamp seen through glass. Never per-section colours.
