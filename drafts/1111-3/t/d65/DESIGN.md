# DESIGN.md — D65

## Overview / mood
Before light can be trusted it is calibrated. D65 (6504 K) is the standard daylight white point every render is judged under. Here the One Car plate is presented the way a calibrated plate is: four hair-thin register marks standing just off its corners, and in the left margin a tiny photographic step wedge — eleven greys from the page ground to paper white — topped by one mint reference patch. That is the whole page. When the car changes, the wedge is 're-read' once: each step flashes its wavelength colour for a fraction of a second, bottom to top, violet to red, and returns to grey. The mint patch never changes — it is the reference.

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
| wedge | `#101011 … #E8E8EA` (11 steps) | grey calibration scale |
| read-out | `#4b1fd6 … #1FFFE0 … #e0102a` | 0.3s flash per step during a change, then gone |

Only other chroma: the car's red interior inside the images.

## Typography
Hanken Grotesk 300/400 — name 16px, project title 26–36px (−0.03em). DM Mono 400, 10.5px uppercase +0.09em — the four corner labels and captions.
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
- **Register marks**: 11px corners, 1px, 14px off the plate; top-left one is mint (the origin), the other three `--mute`.
- **Step wedge**: 7px squares, 3px gaps, bottom-aligned with the plate, 34px left of it; 11 greys `#101011 → #E8E8EA`, then a 9px gap and the mint reference.
- **Corner labels**: top-left brand (`MERCEDES BENZ`), top-right `D65 — 6504 K`, bottom-left mint `CLE CABRIOLET _EXTERIOR`, bottom-right `01 / 06`.
- **Lock**: `SPECTRUM` in mint, name, underlined passcode field (mint text + caret, mint rule on focus). Any input + Enter opens. `#lock` or `Lock` shows it.
- **Comments**: fixed last section — a 520px column in the middle of an otherwise empty screen: mint label, `Comments`, a ruled slot, then `← Index / 02 MDEK →`.

## Motion
Plate cross-fade 0.8s. Wedge read-out: 0.62s per step, 45ms stagger (≈1.1s total), once per change; on project pages once when a plate enters. Reduced motion: none.

## Mint + spectrum
Mint = the reference patch, the origin register mark, `D65`, one label, codes, focus. Spectrum = the read-out flash across the wedge — a calibration sweep that lasts about a second and leaves only greys and mint behind.

## Do / Don't
- Do keep the wedge tiny (7px) and outside the plate.
- Do keep the marks off the image — they frame, they don't crop.
- Don't leave the wedge coloured; don't enlarge it into a palette.
- Don't add crosshairs, grids or measurement readouts on the car.
- Don't let anything touch the plate edge-to-edge or sit in a bottom band.
