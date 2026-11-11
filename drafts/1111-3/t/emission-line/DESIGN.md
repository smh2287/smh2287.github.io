# DESIGN.md — Emission Line

## Overview / mood
Every element has its own emission line; here every project has one. Above the centred car plate sits a hair-thin 380–780 nm scale, exactly as wide as the plate. One vertical mint hairline drops from the scale at the project's wavelength (CLE Cabriolet = 500 nm), disappears behind the car and reappears below it, carrying the only label on the page: `500 nm — CLE CABRIOLET _EXTERIOR`. Change the car and the line travels along the scale to the next wavelength — and *only while it travels* it takes the true colour of the wavelength it is crossing, then settles back to mint. On the project page the line simply stays at 500 nm on every screen; all captions hang from it.

Mood: a quiet optics lab. Precise, scientific, a lot of air. One confident object, one measuring mark.

## Colors
| token | hex | role |
|---|---|---|
| `--bg` | `#1F2021` | ground (site + PDF charcoal) |
| `--deep` | `#121213` | vignette edge of the ground, lock |
| `--ink` | `#E8E8EA` | name, titles |
| `--mid` | `#A9A9A9` | captions, mono labels |
| `--mute` | `#60656E` | ticks, counters, secondary |
| `--hair` | `#34363A` | hairlines, comment rules |
| `--mint` | `#1FFFE0` | **the central colour** — the measuring mark, labels, codes, focus, passcode caret |
| spectral gradient | `#4b1fd6 → #1f4bff → #1FFFE0 → #3dff5a → #ffc21f → #e0102a` | visible only through the 1px line while it moves |

Only other chroma: the car's red interior inside the images.

## Typography
Inter Tight 300/400 — name 16px, project title 26–36px (−0.035em). IBM Plex Mono 400, 10.5px uppercase +0.09em — label on the line; 9px scale numerals.
Two typefaces maximum.

## Spacing / plate
- Plate ratio **12 : 5 (2.4 : 1)**, always horizontal, one per view.
- Plate width = `min(70vw, (100svh − 300px) × 2.4)` → **70 % of the viewport (1008px) at 1440×900**, 15 % side margins, ~240px air above and below. Mobile: 100vw − 32px.
- The plate is the grid: it is centred with `place-items:center`; every label is absolutely hung off it so nothing pushes it off-centre.
- Page margin 28px (16px mobile). Captions 18px below the plate, 10.5px mono — never a band.

## Components
- **Plate**: one 2.4 : 1 image. Studio shots wider than 2.4 are contained and faded into the charcoal (mask, no box); full-frame shots are covered with per-image `object-position`.
- **Caption**: one line under the plate: mint code / grey PDF label (`CLE CABRIOLET _EXTERIOR`) / one sentence.
- **Nav**: name left; `Index` (project only) + `Lock` right. No menu.
- **Index**: there is no list — the home *is* the index: wheel / arrow keys / swipe change the car, click opens it.
- **Scale**: 1px rule 44px above the plate, ticks every 10 nm up, numerals at 400/500/600/700, six short ticks below the rule = the six projects' lines (436 Hg, 500, 546 Hg, 589 Na, 656 Hα, 707 He — real emission lines).
- **Line**: 1px, two segments — scale → plate top, plate bottom → label. It never crosses the car.
- **Hung label**: text sits right of the line; past ~58 % of the scale it flips to the left of the line so it never leaves the plate width.
- **Lock**: `SPECTRUM` in mint, name, underlined passcode field (mint text + caret, mint rule on focus). Any input + Enter opens. `#lock` or `Lock` shows it.
- **Comments**: fixed last section — a 520px column in the middle of an otherwise empty screen: mint label, `Comments`, a ruled slot, then `← Index / 02 MDEK →`.

## Motion
Line travel 1.0s; label fades out during travel and in on arrival; plate cross-fade 0.8s. Reduced motion: line jumps, no colour phase.

## Mint + spectrum
Mint = the line at rest + the wavelength reading + plate codes + focus. Spectrum = the colour the 1px line shows **only in transit** (a fixed-attachment spectral gradient seen through a 1px window, so the hue is physically tied to the x-position on the scale). At rest there is no spectral colour anywhere on the page.

## Do / Don't
- Do keep the line 1px and the scale exactly plate-wide.
- Do hang every piece of text on the line.
- Don't leave the travelling colour on — the project is not 'the red one'.
- Don't draw the line over the car.
- Don't let anything touch the plate edge-to-edge or sit in a bottom band.
