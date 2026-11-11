# DESIGN.md — Spec Wide

## Overview
Studio Dark, refined. Same structure Minho liked — one wide studio band, a mono spec-sheet index under it — but moved onto his own colours: the PDF charcoal with its corner vignette, and mint where the red tick used to be. Calm, flat, nothing else.

## Colors
| token | hex | role |
|---|---|---|
| `--bg` | `#1F2021` | main ground (site + PDF page charcoal) |
| `--deep` | `#121213` | vignette corners of the band |
| `--pbg` | `#171819` | plate ground behind contained images, comment slot |
| `--ink` | `#E8E8EA` | titles, active row |
| `--mid` | `#A9A9A9` | secondary text, mono data |
| `--mute` | `#60656E` | inactive rows, column heads |
| `--hair` | `#34363A` | 1px rules |
| `--mint` | `#1FFFE0` | tick, active number, arrow, plate code, focus |

The only other chroma is the car's red interior inside the images.

## Typography
- Geist 300 — titles (46px home, up to 88px project, −0.035/−0.045em).
- Geist Mono 400, 11px, uppercase, +0.07em — every label, index cell and caption.

## Grid / plates
- 28px page margin (16px mobile), 12-column feel on project headers (2 / 5 / 5).
- **Every plate is 2.4 : 1 (12:5, the PDF page ratio), full-bleed.** A plate holds one image or two cells side by side; never a square, never stacked.
- Images with a studio backdrop are `contain`ed on the plate ground; full-frame interiors/close-ups are `cover`.
- 2px gap between consecutive plates.

## Components
- **Band (hero)**: 2.4:1, radial vignette `#1F2021 → #121213`, title top-left, mono counter top-right. Image cross-fades when an index row is hovered/focused.
- **Index row**: 38px, six mono columns (No. / Project / With / Discipline / Year / →), hairline below. Active: off-white text, mint number, 16px mint tick in the left margin, mint arrow.
- **Image plate + caption**: plate, then one mono line `3.02 / Rear three-quarter / Rear` — code in mint.
- **Section header**: hairline with a 16px mint tick, `n — Name`, 34px heading, one annotation.
- **Nav**: 48px, name left, three mono links centre (current = mint), Lock right.
- **Lock**: full-screen charcoal vignette, name, underlined passcode field (mint on focus). Any input + Enter opens. `#lock` or the Lock button shows it.
- **Comments**: fixed last section, empty bordered slot for the widget.

## Motion
Opacity cross-fade on the band (0.6s) and 0.2s colour changes. Nothing moves position. All disabled under `prefers-reduced-motion`.

## Mint + spectrum
Mint is a 1px instrument mark: ticks, the active index number, plate codes, focus. No fills, no glow. Spectrum is not used here — this is the pure dark + mint baseline.

## Do / Don't
- Do keep the band and every plate at 2.4:1.
- Do keep one mint mark per row/caption.
- Don't add cards, thumbnails grids or a second accent.
- Don't put text over the car; the title sits in the empty upper-left of the band.
