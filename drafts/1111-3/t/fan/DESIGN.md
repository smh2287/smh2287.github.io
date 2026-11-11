# DESIGN.md — Prism Index

## Overview / mood
One Car plus one instrument. In the left margin, level with the car, a white hairline comes in from the screen edge into a 24px mint outline triangle; six hairlines leave it towards six small numerals. That drawing is the whole navigation. Five rays are neutral graphite; the one for the car on screen is mint. When the prism turns to another project all six flash, for a third of a second, in their spectral colours — and settle back to graphite with one mint.

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
| `--mint` | `#1FFFE0` | **the hero colour** — the prism outline, the lit ray, the current numeral, the PDF label under the plate, plate codes, `Post`, caret and focus |
| spectrum | `#FF4D5E #FFA640 #E9F25A` · mint · `#3FC8FF/#3F8CFF #3F6BFF #8E5CFF` | the six rays, ≈0.35s, only while the index changes. At rest there is no spectrum on the page — projects never own a colour |

The only other chroma is inside the images (the red interior, the concept-car skies).

## Typography
- Inter Tight 300 — name 16px, project title 30–46px, `Comments` 32px.
- JetBrains Mono 400, 10–10.5px, uppercase, +0.08em — labels, numerals, codes, footer.
Two families only. Nothing bold, nothing larger than the project title.

## Spacing / plate
- Plate ratio **12 : 5 (2.4 : 1)**, always horizontal, one plate per view.
- Plate width = `min(66vw, (100svh − 280px) × 2.4)` → **66 % of the viewport at 1440×900 (950px)** — slightly narrower so the index has its own air on the left`, optically centred both ways (stage centred by grid; labels hang off it absolutely so they never push the plate). Side margins ≥ 14 % on desktop; mobile 16px margins.
- Project page: every plate has its own 100svh screen (proximity snap), same width as the home plate — never edge to edge, never smaller than the home car.
- Nothing sits in a bottom band: one 9.5px mono line in the two footer corners on the home, nothing on the project.
- Studio shots wider than 2.4 are contained and feathered into the charcoal; full-frame shots are covered with a per-image `object-position`.

## Components
- **Plate**: one image, no border.
- **Prism index** (`.fan`): fixed, vertically centred; beam 1px white 50 %, prism 1px mint, rays 1px `#3C3F44`, lit ray mint; numerals `01–06` at the ray ends, 19px pitch, mute → mint. Home: click a numeral to bring that car; the lit one opens the project. Project: the same instrument lists the chapters `1 Exterior … 6 Comments` and scrolls to them; the chapter name shows only for the current one and on hover.
- **Caption (home)**: grey brand + mute `Selected works` above; mint label + mute `01 / 06` below.
- **Caption (project)**: mint code, grey label, one sentence.
- **Nav**: `Minho Song` top-left, `Lock` (and `Index`) top-right. Under 760px the instrument is hidden and swipe / scroll takes over.
- **Lock**: centred mark, mint `SPECTRUM`, name, one underlined field (mint caret, mint rule on focus), `Mobility Digital Visualization Portfolio`. Any input + Enter opens; `Lock` or `#lock` shows it again.
- **Comments**: fixed last screen. A 560px column in the middle of the air: mint `CLE CABRIOLET _COMMENTS`, `Comments`, hairline-separated entries (mono name/date left, text right), a borderless field with a single rule that turns mint on focus, `Name`, the hint `Refer to plates by code, e.g. 1.03`, mint `Post`. Plate codes typed in a comment become mint links that scroll to that plate. (The local script only previews posting; wire the real widget into `#cmf` / `#cml`.) Below it, `← Index / 02 MDEK →` in tiny mono.

## Motion
Home: plates cross-fade in 0.8s; the newly lit ray is drawn from the prism in 0.9s while all rays flash spectral for 0.35s. Project: the same on chapter change.
Wheel / keys / swipe are throttled to one car per gesture. `prefers-reduced-motion`: no transitions or animations, instant state changes.

## Mint + prism / spectrum
The prism is drawn in mint and the chosen ray is mint: mint is the wavelength you are looking at. The spectrum is the act of choosing — visible only during the turn.

## Do
- Keep the instrument tiny (≈110px wide) and level with the car's waistline.
- Keep idle rays graphite.
- Keep the incoming beam running to the very edge of the screen.

## Don't
- Don't give each project its own ray colour at rest.
- Don't fill the triangle.
- Don't add a second menu.
