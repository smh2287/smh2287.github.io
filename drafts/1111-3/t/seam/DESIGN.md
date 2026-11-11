# DESIGN.md — Light Seam

## Overview / mood
One Car, standing on light. A single mint hairline runs the width of the screen like the ambient-light seam of a Mercedes cabin, and the centred 2.4 : 1 plate rests on it. One sixth of the seam is lit to full mint — the position of the current project — and its label hangs under that span. Change car and the lit span glides along the seam. Inside a project the same seam counts the plates.

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
| `--mint` | `#1FFFE0` | **the hero colour** — the seam (22 % along its length, 100 % on the lit span), the label under it, plate codes, caret, focus |
| spectrum | `#FFE14A → #FF3D6E → #8B5CFF` | only as the small "+" described below |

The only other chroma is the car's red interior inside the images.

## Typography
- Geist 300 — name 17px, project title 30–48px (−0.03em), `Comments` 32px.
- Geist Mono 400, 11px, uppercase, +0.09em — labels, codes, footer.

## Spacing / plate
- Plate ratio **12 : 5 (2.4 : 1)**, always horizontal, one per view.
- Plate width = `min(72vw, (100svh − 260px) × 2.4)` → **72 % of the viewport width at 1440×900**, optically centred both ways (the stage is centred by grid; labels hang off it absolutely so they never push the plate).
- Side margins ≥ 14 % on desktop; mobile 16px margins.
- Page margin 32px for the name / Lock / footer line. Nothing sits in a bottom band: only one 11px mono line in the footer corners.
- Studio shots wider than 2.4 are contained and feathered into the charcoal (mask, no box); full-frame shots are covered with a per-image `object-position`.

## Components
- **Plate**: one image, 72vw × 12 : 5; studio shots are bottom-aligned so the wheels stand just above the seam.
- **Seam**: 1px, full viewport width, fading out at both ends; lit span = plate width ÷ number of items, 2px, full mint.
- **Caption (home)**: `01  MERCEDES BENZ` grey over mint `CLE CABRIOLET _EXTERIOR`, hanging under the lit span and travelling with it.
- **Caption (project)**: under the seam, left: mint code / grey label / one sentence at 13.5px.
- **Index**: there is no list — the seam is the index (6 positions on the home, 12 in the project).
- **Nav**: `Minho Song` top-left, `Lock` top-right. No menu.
- **Lock**: centred name, `Mobility Digital Visualization Portfolio`, one underlined field with a mint caret and mint rule on focus; any input + Enter opens. `#lock` or Lock shows it.
- **Comments**: fixed last screen of the project — an empty 12 : 5 hairline frame the size of a plate (label, `Comments`, widget slot), then `← Index / 02 MDEK →` in the same tiny mono.

## Motion
Home: 0.8s cross-fade of the car while the lit span and its label slide to the next position along the seam. Wheel/keys/swipe are throttled to one car per gesture. `prefers-reduced-motion`: no transitions or animations, instant jumps.

## Mint + spectrum
Mint is a line of light, not a paint: one hairline at low intensity, one short span at full intensity, one label. The spectrum is 28px long: the leading (right) tip of the lit span disperses mint → yellow → magenta → violet, as if the light were leaving a prism at exactly that point. Nowhere else.

## Do
- Keep the seam exactly at the plate's bottom edge.
- Keep the lit span the only full-strength mint on screen besides its label.
- Let studio cars stand on the seam.

## Don't
- Don't add tick marks, numbers or a second line.
- Don't thicken the seam or give it glow.
- Don't extend the spectral tip beyond a few pixels.
