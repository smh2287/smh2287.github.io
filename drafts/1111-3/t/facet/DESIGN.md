# DESIGN.md — Facet

## Overview / mood
The plate is a block of glass. Its top-right corner is ground off at 45° — a 64px facet — and that cut is the only frame the picture has. A single hairline lies on the cut and overshoots it by 24px at both ends: mint where it touches the glass, dispersing to violet at the upper end and to yellow-red at the lower end, only in the two short pieces that are already in the air. The next car is not faded in; it is cut in from that corner along the same 45°, and for one second the moving cut is a spectrum.

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
| `--mint` | `#1FFFE0` | **the hero colour** — the cut line on the glass, the plate number at the end of it, the PDF label under the plate, `Post`, caret and focus |
| spectrum | `#FF4D5E #FFA640 #E9F25A` · mint · `#3FC8FF/#3F8CFF #3F6BFF #8E5CFF` | the two 24px overshoots of the cut line at rest; the 2px travelling cut during a change (≈1.1s) |

The only other chroma is inside the images (the red interior, the concept-car skies).

## Typography
- Instrument Sans 400 — name 16px, project title 30–46px, `Comments` 32px.
- IBM Plex Mono 400, 10.5px, uppercase, +0.09em — labels, codes, footer.
Two families only. Nothing bold, nothing larger than the project title.

## Spacing / plate
- Plate ratio **12 : 5 (2.4 : 1)**, always horizontal, one plate per view.
- Plate width = `min(70vw, (100svh − 280px) × 2.4)` → **70 % of the viewport at 1440×900 (1008px)`, optically centred both ways (stage centred by grid; labels hang off it absolutely so they never push the plate). Side margins ≥ 14 % on desktop; mobile 16px margins.
- Project page: every plate has its own 100svh screen (proximity snap), same width as the home plate — never edge to edge, never smaller than the home car.
- Nothing sits in a bottom band: one 9.5px mono line in the two footer corners on the home, nothing on the project.
- Studio shots wider than 2.4 are contained and feathered into the charcoal; full-frame shots are covered with a per-image `object-position`.

## Components
- **Plate** (`.pl`): 12 : 5 slab in `#171819` (one step deeper than the ground, so the cut reads even behind a feathered studio shot), `clip-path` removes a 64px right-angled corner top-right (34px on mobile).
- **Cut** (`.cut`): 1px line on the hypotenuse, 24px overshoot each end, gradient violet → mint (17.5–82.5 %) → red.
- **Number** (`.tip`): mint `01` (home) / `1.03` (project) at the lower end of the cut, in the right margin — the cut works as its leader line.
- **Caption (home)**: grey brand above; mint `CLE CABRIOLET _EXTERIOR` and mute `01 / 06` below.
- **Caption (project)**: grey label + one sentence under the plate; the code lives at the facet. Plates that are not in view dim their cut to 30 % and hide their code.
- **Nav**: `Minho Song` top-left, `Lock` (and `Index`) top-right.
- **Lock**: centred mark, mint `SPECTRUM`, name, one underlined field (mint caret, mint rule on focus), `Mobility Digital Visualization Portfolio`. Any input + Enter opens; `Lock` or `#lock` shows it again.
- **Comments**: fixed last screen. A 560px column in the middle of the air: mint `CLE CABRIOLET _COMMENTS`, `Comments`, hairline-separated entries (mono name/date left, text right), a borderless field with a single rule that turns mint on focus, `Name`, the hint `Refer to plates by code, e.g. 1.03`, mint `Post`. Plate codes typed in a comment become mint links that scroll to that plate. (The local script only previews posting; wire the real widget into `#cmf` / `#cml`.) Below it, `← Index / 02 MDEK →` in tiny mono.

## Motion
Home: the incoming image is clipped to a triangle that grows from the facet corner across the plate in 1.15s (`@property --t`), led by a 2px spectrum line parallel to the cut. Project: each plate is cut in the same way the first time it comes into view.
Wheel / keys / swipe are throttled to one car per gesture. `prefers-reduced-motion`: no transitions or animations, instant state changes.

## Mint + prism / spectrum
Mint is light inside glass; spectrum is the same light at the instant it leaves the glass or crosses the picture. At rest the page holds about 48px of spectrum in total.

## Do
- Keep the facet at exactly 45° and on one corner only.
- Keep the slab barely darker than the ground — it should be felt, not seen.
- Keep the number on the axis of the cut.

## Don't
- Don't chamfer more corners or round any.
- Don't add a border around the plate.
- Don't let the travelling cut linger or loop.
