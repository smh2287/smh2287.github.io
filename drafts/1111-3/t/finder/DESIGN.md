# DESIGN.md — Viewfinder

## Overview / mood
One Car, seen through a finder. Four small mint corner ticks stand 18px outside the centred 2.4 : 1 plate, the way crop marks or a camera viewfinder hold a subject. The finder never moves. On the home the six cars stand in a row and the row slides under it — the frame "takes" the next car. In the project the finder stays fixed in the middle of the screen while the plates scroll up into it and snap. It is the designer's own act — framing — made into the interface.

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
| `--mint` | `#1FFFE0` | **the hero colour** — the four corner ticks, the one PDF label under the plate, plate codes, caret and focus |
| spectrum | `#FFE14A → #FF3D6E → #8B5CFF` | only as the small "+" described below |

The only other chroma is the car's red interior inside the images.

## Typography
- Geist 300 — name 17px, project title 30–48px, `Comments` 32px.
- Geist Mono 400, 11px, uppercase, +0.09em — labels, codes, footer.

## Spacing / plate
- Plate ratio **12 : 5 (2.4 : 1)**, always horizontal, one per view.
- Plate width = `min(70vw, (100svh − 280px) × 2.4)` → **70 % of the viewport width at 1440×900**, optically centred both ways (the stage is centred by grid; labels hang off it absolutely so they never push the plate).
- Side margins ≥ 15 % on desktop; mobile 16px margins.
- Page margin 32px for the name / Lock / footer line. Nothing sits in a bottom band: only one 11px mono line in the footer corners.
- Studio shots wider than 2.4 are contained and feathered into the charcoal (mask, no box); full-frame shots are covered with a per-image `object-position`.

## Components
- **Plate**: one image, 70vw × 12 : 5, no border — the ticks are its only frame.
- **Finder**: four 22px L-ticks, 1px, mint, offset 18px outside the plate (8px / 14px ticks on mobile). `position:fixed` on the project page.
- **Caption (home)**: one mono line 38px under the plate: grey `MERCEDES BENZ`, mint `CLE CABRIOLET _EXTERIOR`, mute `01 / 06` at the right.
- **Caption (project)**: mint code / grey label / one sentence. Title sits above the plate, outside the ticks.
- **Comments**: the last frame the finder holds is the empty comment plate.
- **Nav**: `Minho Song` top-left, `Lock` top-right. No menu.
- **Lock**: centred name, `Mobility Digital Visualization Portfolio`, one underlined field with a mint caret and mint rule on focus; any input + Enter opens. `#lock` or Lock shows it.
- **Comments**: fixed last screen of the project — an empty 12 : 5 hairline frame the size of a plate (label, `Comments`, widget slot), then `← Index / 02 MDEK →` in the same tiny mono.

## Motion
Home: the row of cars slides one plate + 50vw in 0.9s (neighbours are always fully off-screen at rest; the 6 → 1 wrap is a cut); the ticks open 12px and close again in 0.5s, like a focus breath. Project: mandatory vertical snap, one plate per screen; the ticks breathe on each change. Wheel/keys/swipe are throttled to one car per gesture. `prefers-reduced-motion`: no transitions or animations, instant jumps.

## Mint + spectrum
Mint is the frame — four tiny right angles and the label that names what is framed. The spectrum is one corner: the top-right tick is "prism-cut" — its 1px line runs violet → magenta → yellow at the vertex and returns to mint at both ends. 22 pixels of spectrum on the whole page.

## Do
- Keep the finder perfectly still; only its contents move.
- Keep ticks at 1px and 22px.
- Keep the prism on exactly one corner.

## Don't
- Don't close the ticks into a full border.
- Don't add camera-HUD data (ISO, grid, centre cross).
- Don't let neighbouring cars peek in at rest.
