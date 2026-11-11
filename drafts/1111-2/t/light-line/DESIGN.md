# DESIGN.md — Light Line

## Overview
Studio Dark wide plates; a 1px mint hairline under the nav that opens into spectrum.
Studio Dark structure (wide studio band, mono spec-sheet index, horizontal plates down the project page) on Minho's own PDF charcoal and mint. Group: Mint + Spectrum — mint is the anchor; a tiny spectrum "+" is the only new idea.

One 1px mint hairline runs under the sticky nav. It is the progress line of the page: on the index it opens to the hovered project (01→06 of the width), on the project page it follows scroll. The opened part turns into a thin 2px spectrum that always starts at mint on the left, so reading further = more colour. Nothing else on the page carries colour beyond mint codes.

## Colors
| token | hex | role |
|---|---|---|
| `--bg` | `#1F2021` | main ground (site + PDF page charcoal) |
| `--deep` | `#121213` | band vignette corners |
| `--pbg` | `#171819` | plate ground behind contained images, comment slot |
| `--ink` | `#E8E8EA` | titles, active row, playheads |
| `--mid` | `#A9A9A9` | secondary text, mono data |
| `--mute` | `#60656E` | inactive rows, column heads |
| `--hair` | `#34363A` | 1px rules |
| `--mint` | `#1FFFE0` | anchor accent: active number, plate code, focus, start of the spectrum |
| spectrum | `#1FFFE0 → #3FB2FF → #7A6BFF → #D45CF0 → #FF5D7E → #FFB04A` | 1–2px only, always starting at mint |

The car's red interior inside the images is the only other chroma.

## Typography
- Geist 300 — titles (46px home band, up to 88px project, −0.035/−0.045em).
- Geist Mono 400, 11px, uppercase, +0.07em — labels, index cells, captions, timecodes.

## Spacing / grid
- 28px page margin (16px mobile); project headers 2 / 5 / 5 columns.
- **Plate ratio: 2.4 : 1 (12:5, the PDF page ratio)** for the hero band and every project plate. Cells inside a plate sit side by side; never square, never stacked.
- 2px between consecutive plates.

## Components
- **Nav**: 48px; name left, three mono links centre (current = mint), Lock right.
- **Band / image plate**: 2.4:1, charcoal vignette; studio shots `contain`ed, full-frame shots `cover`.
- **Index row**: 38px, six mono columns (No. / Project / With / Discipline / Year / →). Active: off-white, mint number, mint arrow; hovering cross-fades the band.
- **Caption**: one mono line `3.02 / Rear three-quarter / Rear`, code in mint.
- **Lock**: full-screen charcoal vignette, name, underlined passcode. Any input + Enter opens; `#lock` or Lock shows it.
- **Comments**: fixed last section of the project page, empty bordered slot for the widget.

## Mint + spectrum
Nav hairline: base 1px `#1FFFE0` (dimmed to ~55%), opened part 2px spectrum gradient mapped to the full viewport width, revealed with clip-path. A 1px off-white playhead tick marks the edge. Lock input: underline becomes spectrum once something is typed.
Rules: spectrum ≤ 2px, never a fill, never a glow/blur/shadow, never one colour per section. Mint must be visibly the first colour of any spectrum.

## Motion
0.2s colour changes, 0.6s band cross-fade, the template's own line motion described above. Nothing moves position. All transitions/animations off under `prefers-reduced-motion`.

## Do / Don't
- Do keep every plate wide (2.4:1) and the ground charcoal.
- Do keep the spectrum as one hairline-scale element.
- Don't add a second accent, cards, square thumbnails or gradients behind text.
- Don't let the spectrum move fast or light up areas.
