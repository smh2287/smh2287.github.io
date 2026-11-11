# DESIGN.md — Horizon

## Overview
One idea: a single 1px horizon line at 64% of the viewport height, on every page and on the lock screen. Everything stands on it — car plates sit with their bottom edge on the line like a car on a ground plane — and every word hangs underneath it. The work moves sideways along the line; the line never moves. Very calm.

## Colors
| token | hex | role |
|---|---|---|
| `--bg` | `#1F2021` | sky / ground above the line (PDF charcoal) |
| `--deep` | `#171819` | the floor below the line darkens to this |
| `--ink` | `#E8E8EA` | titles |
| `--mid` | `#A9A9A9` | captions, mono data |
| `--mute` | `#60656E` | counter, labels |
| `--line` | `#404047` | the horizon, comment slot border |
| `--mint` | `#1FFFE0` | the ground segment under the active car, index numbers, plate codes |

Only other chroma: the red interior inside the images.

## Typography
- Manrope 300 — titles (30px home row, up to 72px project title, −0.025/−0.04em).
- IBM Plex Mono 400, 11px uppercase +0.08em — numbers, labels, captions, nav.

## Spacing / grid / plate
- Horizon `--hy: 64svh` (58svh mobile). Same value on index, project and lock.
- **Plate 12 : 5 (2.4 : 1)**, width `min(60vw, (hy − 150px) × 2.4)`, bottom edge exactly on the line. Gap between plates 9vw.
- Text block starts 22px under the line, left-aligned to the plate.
- Wider-than-2.4 studio shots are bottom-aligned and faded upward into the charcoal, so the car rests on the line.

## Components
- **Index**: horizontal track of six plates; centre one at full opacity, neighbours at 32%. Under the line: mint `01`, title, mono `With · Discipline · Year`.
- **Plate + caption**: `1.03  1 — EXTERIOR  Fluid elegance` hanging under the line.
- **Project title**: big light title standing on the line, spec list hanging under it.
- **Nav**: name left; mono links right (`Work / Profile / Lock`). Counter `05 / 13` bottom-right.
- **Lock**: the same line; name and passcode field stand on it, `Passcode / Enter` hangs under it. Any input + Enter opens.
- **Comments**: last stop on the track — `Comments` stands on the line, the bordered widget slot and `← Index / 02 MDEK →` hang below.

## Motion
Wheel / arrows / swipe move one plate along the line (smooth scroll, scroll-snap). The active plate's segment of the horizon draws in mint (0.7s scaleX). Reduced motion: instant jumps, no draw.

## Mint + spectrum
Mint is only the ground under the current car plus small numbers/codes. No fills, no glow. Spectrum not used.

## Do / Don't
- Do keep the line at exactly the same height everywhere.
- Do keep everything above the line an image and everything below it text.
- Don't stack plates vertically or add a second line.
- Don't put text over images.
