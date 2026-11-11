# DESIGN.md — Slit

## Overview / mood
A spectrometer begins with a slit: light is only measurable once it has been made into one thin line. Here the home is One Car plus that slit — a single mint hairline, slightly taller than the plate, parked 16px outside its right edge with the next project's number beside it. To change the car, the slit crosses the plate; the next car is exposed behind it. Only while it moves does the line split chromatically (a 1px red fringe on one side, blue on the other) — at rest it is pure mint. On the project page each plate is opened once by the same slit as it scrolls into view, and the slit parks at the right edge of every plate like a margin rule.

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
| fringe | `#ff3d5e` / `#3d6bff` | 1px chromatic split on the slit, in motion only |

Only other chroma: the car's red interior inside the images.

## Typography
Instrument Serif 400 (+ italic) — name 21px, project title 34–50px, `Comments`. Geist Mono 400 — every label and sentence (10.5–12px).
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
- **Slit**: 1px mint, plate height + 22px above and below, 16px right of the plate. Fringes ±1.5px, `#ff3d5e` / `#3d6bff`, only during the sweep.
- **Next label**: `02 MDEK` at the foot of the slit, in the right margin.
- **Lock**: `SPECTRUM` in mint, name, underlined passcode field (mint text + caret, mint rule on focus). Any input + Enter opens. `#lock` or `Lock` shows it.
- **Comments**: fixed last section — a 520px column in the middle of an otherwise empty screen: mint label, `Comments`, a ruled slot, then `← Index / 02 MDEK →`.

## Motion
Sweep 1.05s (`cubic-bezier(.62,0,.18,1)`) — outgoing and incoming plates are clipped at the slit position, so the line is always the exact seam. Project plates open once (1.25s) on entering the viewport. Reduced motion: plain swap, slit stays parked.

## Mint + spectrum
Mint = the slit, the label, codes, focus. Spectrum = the red/blue chromatic fringe on the 1px slit **only while it travels** — dispersion as a by-product of motion, never a decoration at rest.

## Do / Don't
- Do keep exactly one slit per plate.
- Do keep the fringe 1px and temporary.
- Don't widen the slit into a bar or add glow.
- Don't run the sweep on scroll position (no scrubbing/parallax) — it is one discrete exposure.
- Don't let anything touch the plate edge-to-edge or sit in a bottom band.
