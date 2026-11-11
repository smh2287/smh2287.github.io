# DESIGN.md — Thin Numeral

## Overview / mood
One Car with a number. In the left margin stands the index of the current project — two stacked digits, Geist Thin, as tall as the plate and drawn in mint, like a race number set in hairline. The plate stays dead centre. Change car and only the lower digit rolls. Inside the project the numeral stays fixed in the margin and counts the plates 01–12.

## Colors
| token | hex | role |
|---|---|---|
| `--bg` | `#1F2021` | ground (PDF charcoal) |
| `--deep` | `#171819` | soft vignette at the far corners, lock |
| `--ink` | `#E8E8EA` | name, titles |
| `--mid` | `#A9A9A9` | captions, mono labels |
| `--mute` | `#60656E` | counters, secondary |
| `--dim` | `#4A4E55` | footer line |
| `--hair` | `#34363A` | input rule, comment border |
| `--mint` | `#1FFFE0` | **the hero colour** — the numeral, and nothing else at rest (labels are grey/white so the number owns the colour); caret and focus |
| spectrum | `#FFE14A → #FF3D6E → #8B5CFF` | only as the small "+" described below |

The only other chroma is the car's red interior inside the images.

## Typography
- Geist **100** — the numeral, font-size ≈ 1.06 × the side margin (≈ 260px at 1440), line-height 0.8, tabular.
- Geist 300 — name 17px, project title 30–48px, `Comments` 32px.
- Geist Mono 400, 11px, uppercase, +0.09em — labels, codes, footer.

## Spacing / plate
- Plate ratio **12 : 5 (2.4 : 1)**, always horizontal, one per view.
- Plate width = `min(66vw, (100svh − 260px) × 2.4)` → **66 % of the viewport width at 1440×900**, optically centred both ways (the stage is centred by grid; labels hang off it absolutely so they never push the plate).
- Side margins ≥ 17 % on desktop; mobile 16px margins.
- Page margin 32px for the name / Lock / footer line. Nothing sits in a bottom band: only one 11px mono line in the footer corners.
- Studio shots wider than 2.4 are contained and feathered into the charcoal (mask, no box); full-frame shots are covered with a per-image `object-position`.

## Components
- **Plate**: one image, 66vw × 12 : 5 — slightly narrower than the other Mint Field templates so the 17vw margins can hold the numeral.
- **Index numeral**: `0` over `1`, centred in the left margin, vertically centred on the plate. It is the whole index.
- **Caption (home)**: one mono line under the plate — grey `MERCEDES BENZ`, white `CLE CABRIOLET _EXTERIOR`, mute `/ 06` at the right.
- **Caption (project)**: mute code / grey label / one sentence; the fixed numeral is the plate number. It fades out on the comments screen.
- **Nav**: `Minho Song` top-left, `Lock` top-right. No menu.
- **Lock**: centred name, `Mobility Digital Visualization Portfolio`, one underlined field with a mint caret and mint rule on focus; any input + Enter opens. `#lock` or Lock shows it.
- **Comments**: fixed last screen of the project — an empty 12 : 5 hairline frame the size of a plate (label, `Comments`, widget slot), then `← Index / 02 MDEK →` in the same tiny mono.

## Motion
Home: 0.8s cross-fade of the car; the changed digit rises 0.16em into place over 0.9s. Wheel/keys/swipe are throttled to one car per gesture. `prefers-reduced-motion`: no transitions or animations, instant jumps.

## Mint + spectrum
Mint is a single typographic object: big in size, almost nothing in weight (≈ 5px strokes), so it reads as drawn light rather than a colour block. The spectrum appears only while a digit is rolling: its strokes split into a magenta and a violet fringe (±3.5 % of the font size) that converge to pure mint within 0.9s — a prism for one instant, then gone.

## Do
- Keep the numeral at weight 100 and keep it the only mint thing.
- Keep the two digits stacked; the tall shape is what fits the margin.
- Keep the plate centred regardless of the numeral.

## Don't
- Don't let the numeral overlap the plate.
- Don't outline, fill a box behind, or glow it.
- Don't leave the chromatic fringe visible at rest.
