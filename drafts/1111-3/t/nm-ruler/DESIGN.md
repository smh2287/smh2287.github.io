# DESIGN.md — Wavelength Ruler

## Overview / mood
One Car, measured. The home is still one 2.4 : 1 car plate floating on charcoal — but a hair-thin spectrometer ruler (380–780 nm) stands on the right page margin, exactly as tall as the plate. Each project is a line on that ruler (CLE Cabriolet = 500 nm, the mint line). When the car changes, a single mint cursor slides to the new wavelength and reads the number. Nothing else moves. On the project page the same ruler zooms into the 500 nm line: one tick per plate, the mint cursor follows the scroll and reads the plate code.

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

Only other chroma: the car's red interior inside the images.

## Typography
Geist 300 — name 17px, project title 26–36px (−0.035em). Geist Mono 400, 10.5px uppercase +0.09em — labels, ruler numerals (9px), cursor reading (11px).
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
- **Ruler**: fixed, right margin (28px inset), 150px wide box, height = plate height. Ticks every 10 nm (5px), 50 nm (9px), 100 nm (13px + numeral). Six slightly brighter 13px ticks = the six projects (436, 500, 546, 589, 656, 707 nm). Mint cursor 36px + reading `500 nm`.
- **Project ruler**: 13 ticks = 12 plates + comments, three minor ticks between; section names at section starts (`_Exterior` … `_Comments`); ticks are anchors.
- **Lock**: `SPECTRUM` in mint, name, underlined passcode field (mint text + caret, mint rule on focus). Any input + Enter opens. `#lock` or `Lock` shows it.
- **Comments**: fixed last section — a 520px column in the middle of an otherwise empty screen: mint label, `Comments`, a ruled slot, then `← Index / 02 MDEK →`.

## Motion
Cursor slide 0.9s (home) / 0.5s (project); plate cross-fade 0.8s. Reduced motion: instant.

## Mint + spectrum
Mint = the cursor, its reading, one label under the plate, plate codes, focus/hover. The spectrum is **never drawn in colour** — it exists only as a scale of numbers; mint is where the instrument is pointing (≈500 nm is literally the mint/cyan-green region).

## Do / Don't
- Do keep the ruler hair-thin and the same height as the plate.
- Do let the cursor be the only moving mark.
- Don't colour the ticks by wavelength (no rainbow, no colour per project).
- Don't add a second ruler or a legend.
- Don't let anything touch the plate edge-to-edge or sit in a bottom band.
