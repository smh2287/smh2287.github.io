# DESIGN.md — Edge Fringe

## Overview / mood
One Car seen through a lens. The plate has no frame; its left and right edges carry a single mint hairline that fades out toward top and bottom. Just outside each mint line sit two fainter ones — blue and violet on the left, orange and red on the right — the lateral chromatic fringe you see at the edge of glass. At rest they are 4px apart and almost not there. At every change the edges open — the wavelengths separate to seven times that distance — and fold back into the mint edge.

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
| `--mint` | `#1FFFE0` | **the hero colour** — the two edge lines, the PDF label under the plate, plate codes, `Post`, caret and focus |
| spectrum | `#FF4D5E #FFA640 #E9F25A` · mint · `#3FC8FF/#3F8CFF #3F6BFF #8E5CFF` | four 1px lines (two per side) at 36–60 % opacity, masked to fade at both ends; wide only for ≈0.3s at a change |

The only other chroma is inside the images (the red interior, the concept-car skies).

## Typography
- Hanken Grotesk 300 — name 16px, project title 30–46px, `Comments` 32px.
- DM Mono 400, 10.5px, uppercase, +0.09em — labels, codes, footer.
Two families only. Nothing bold, nothing larger than the project title.

## Spacing / plate
- Plate ratio **12 : 5 (2.4 : 1)**, always horizontal, one plate per view.
- Plate width = `min(72vw, (100svh − 280px) × 2.4)` → **72 % of the viewport at 1440×900 (1037px)`, optically centred both ways (stage centred by grid; labels hang off it absolutely so they never push the plate). Side margins ≥ 14 % on desktop; mobile 16px margins.
- Project page: every plate has its own 100svh screen (proximity snap), same width as the home plate — never edge to edge, never smaller than the home car.
- Nothing sits in a bottom band: one 9.5px mono line in the two footer corners on the home, nothing on the project.
- Studio shots wider than 2.4 are contained and feathered into the charcoal; full-frame shots are covered with a per-image `object-position`.

## Components
- **Plate**: one image, no border.
- **Fringe** (`.fr`): three 1px lines on each vertical edge — mint on the edge, then cool colours outward on the left, warm colours outward on the right; all masked 16 % → 84 % so they have no ends.
- **Caption (home)**: grey brand + mute `Selected works` above; mint label + mute `01 / 06` below.
- **Caption (project)**: mint code, grey label, one sentence. Plates that are not current hold their fringe at 45 %.
- **Nav**: `Minho Song` top-left, `Lock` (and `Index`) top-right.
- **Lock**: centred mark, mint `SPECTRUM`, name, one underlined field (mint caret, mint rule on focus), `Mobility Digital Visualization Portfolio`. Any input + Enter opens; `Lock` or `#lock` shows it again.
- **Comments**: fixed last screen. A 560px column in the middle of the air: mint `CLE CABRIOLET _COMMENTS`, `Comments`, hairline-separated entries (mono name/date left, text right), a borderless field with a single rule that turns mint on focus, `Name`, the hint `Refer to plates by code, e.g. 1.03`, mint `Post`. Plate codes typed in a comment become mint links that scroll to that plate. (The local script only previews posting; wire the real widget into `#cmf` / `#cml`.) Below it, `← Index / 02 MDEK →` in tiny mono.

## Motion
Home: plates cross-fade in 0.8s; the fringe snaps open in 0.28s and closes over 1.5s. Project: the same when a plate becomes current.
Wheel / keys / swipe are throttled to one car per gesture. `prefers-reduced-motion`: no transitions or animations, instant state changes.

## Mint + prism / spectrum
Mint is the edge in focus; the spectrum is what the edge does for a moment when the picture changes — cool to the left, warm to the right, as in a real lens.

## Do
- Keep all lines 1px and end-less (masked).
- Keep cool left / warm right.
- Keep the rest state nearly invisible.

## Don't
- Don't add top and bottom edges — it must not become a frame.
- Don't apply RGB-split to the photograph itself.
- Don't leave the fringe open.
