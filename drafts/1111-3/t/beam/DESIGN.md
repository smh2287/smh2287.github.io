# DESIGN.md — Single Beam

## Overview / mood
One Car with one line of light. A white hairline enters from the left edge of the screen at the exact mid-height of the plate, disappears behind the car, and leaves the plate on the right as a fan of seven hairlines — the car plate is the prism. It is the *Dark Side of the Moon* diagram reduced to 1px lines and stretched across the whole viewport, with the car where the triangle used to be. The ray that does not bend is mint.

## Colors
| token | hex | role |
|---|---|---|
| `--bg` | `#1F2021` | ground (PDF charcoal) |
| `--deep` | `#121213` | soft vignette at the far corners, lock |
| `--ink` | `#E8E8EA` | name, titles, comment text |
| `--mid` | `#A9A9A9` | captions, mono labels |
| `--mute` | `#60656E` | counters, secondary |
| `--dim` | `#4A4E55` | footer line |
| `--hair` | `#34363A` | input rule, comment rules |
| `--mint` | `#1FFFE0` | **the hero colour** — the undeviated centre ray, the PDF label under the plate, plate codes, `Post`, caret and focus |
| spectrum | `#FF4D5E #FFA640 #E9F25A` · mint · `#3FC8FF/#3F8CFF #3F6BFF #8E5CFF` | six 1px rays at 50–60 % opacity, only in the empty margin to the right of the plate (home) and in the gap between two plates (project) |

The only other chroma is inside the images (the red interior, the concept-car skies).

## Typography
- Geist 300 — name 16px, project title 30–46px, `Comments` 32px.
- Geist Mono 400, 10.5px, uppercase, +0.09em — labels, codes, footer.
Two families only. Nothing bold, nothing larger than the project title.

## Spacing / plate
- Plate ratio **12 : 5 (2.4 : 1)**, always horizontal, one plate per view.
- Plate width = `min(70vw, (100svh − 280px) × 2.4)` → **70 % of the viewport at 1440×900 (1008px)`, optically centred both ways (stage centred by grid; labels hang off it absolutely so they never push the plate). Side margins ≥ 14 % on desktop; mobile 16px margins.
- Project page: every plate has its own 100svh screen (proximity snap), same width as the home plate — never edge to edge, never smaller than the home car.
- Nothing sits in a bottom band: one 9.5px mono line in the two footer corners on the home, nothing on the project.
- Studio shots wider than 2.4 are contained and feathered into the charcoal; full-frame shots are covered with a per-image `object-position`.

## Components
- **Plate**: one image, no border, `z-index` above the beam so the crossing is hidden.
- **Beam in** (`.bin`): 1px, white at 55–75 %, fading in from the screen edge, ends at the plate's left edge.
- **Beam out** (`.bout`): seven 1px lines from the plate's right edge to the screen edge, ±39 units of spread; centre line mint at 100 %.
- **Caption (home)**: grey brand and mute `Selected works` above; mint `CLE CABRIOLET _EXTERIOR` and mute `01 / 06` below, 18px off the plate.
- **Caption (project)**: mint code, grey label, one sentence pushed to the right end of the same line.
- **Gutter** (`.gut`): on the project the beam turns vertical and runs down the centre of the page; between two plates it opens into a 30px-wide spindle of spectrum and closes again; after the last plate it opens once more and stays open — the fan lands on `Comments`.
- **Nav**: `Minho Song` top-left, `Lock` (and `Index` on the project) top-right.
- **Lock**: centred mark, mint `SPECTRUM`, name, one underlined field (mint caret, mint rule on focus), `Mobility Digital Visualization Portfolio`. Any input + Enter opens; `Lock` or `#lock` shows it again.
- **Comments**: fixed last screen. A 560px column in the middle of the air: mint `CLE CABRIOLET _COMMENTS`, `Comments`, hairline-separated entries (mono name/date left, text right), a borderless field with a single rule that turns mint on focus, `Name`, the hint `Refer to plates by code, e.g. 1.03`, mint `Post`. Plate codes typed in a comment become mint links that scroll to that plate. (The local script only previews posting; wire the real widget into `#cmf` / `#cml`.) Below it, `← Index / 02 MDEK →` in tiny mono.

## Motion
Home: plates cross-fade in 0.8s; the fan collapses to a single line at the cut and re-opens in 1.1s. Project: each spindle opens (scaleX) as its plate becomes current.
Wheel / keys / swipe are throttled to one car per gesture. `prefers-reduced-motion`: no transitions or animations, instant state changes.

## Mint + prism / spectrum
Mint is the wavelength that goes straight through: on every fan and spindle the centre line is mint and full strength, the others are thinner in presence. The spectrum exists only in air — never over an image, never as a fill.

## Do
- Keep every ray at 1px; keep the beam at the plate's exact mid-height.
- Let the fan run off the right edge of the screen.
- Keep the incoming beam white-grey, never mint.

## Don't
- Don't draw a triangle — the car is the prism.
- Don't thicken, glow or animate the rays in a loop.
- Don't put the fan on both sides.
