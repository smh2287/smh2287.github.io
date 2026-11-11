# DESIGN.md — Cinemascope

## Overview
Film grammar. A car is a wide object, so every image is shown the way wide pictures are shown: a 2.39:1 frame between two thin black bars. The bars carry slate data in mono — shot number, section, a timecode-like counter in mint. Home is one frame plus a reel index; a project is a sequence of shots.

## Colors
| token | hex | role |
|---|---|---|
| `--bg` | `#1F2021` | page ground (PDF charcoal) |
| `--bar` | `#0B0B0C` | letterbox bars, comment slot |
| `--pbg` | `#121213` | picture ground behind contained images |
| `--ink` | `#E8E8EA` | titles, subtitles, active row |
| `--mid` | `#A9A9A9` | body, secondary |
| `--mute` | `#60656E` | bar data, inactive rows |
| `--hair` | `#34363A` | 1px rules |
| `--mint` | `#1FFFE0` | shot/scene number and timecode of the active item only |

## Typography
- Archivo (width 112) 500 — titles, set in spaced capitals like a title card; 400 for subtitles.
- JetBrains Mono 400, 11px uppercase — all slate data.

## Grid / plates
- **Every plate is 2.39 : 1, full-bleed**, with a 26px black bar above and below (22px mobile).
- A plate may be split into two cells side by side (a wide shot + a detail), never stacked, never square.
- 28px between frames; 28px page margin for text.

## Components
- **Frame**: top bar (`Shot 07 / 15` mint · `_EXTERIOR` · timecode), picture, bottom bar (project · ratio).
- **Subtitle caption**: one centred line low in the picture, like a film subtitle. On mobile it drops into the bar below.
- **Reel index row** (home): 30px mono row — `SC 01` · timecode · title · with · discipline · year. Hover/focus swaps the frame; the active row's scene number and timecode turn mint.
- **Scene header** (project): `Scene 03 — Exterior`, centred heading, one annotation.
- **Nav / Lock / Comments**: same quiet pattern as the family — 48px bar; full-screen passcode (any input + Enter); comments are the fixed last section in a black slot.

## Motion
0.5s opacity cross-fade on the home frame. No scrolling effects. Disabled under `prefers-reduced-motion`.

## Mint + spectrum
Mint marks "now": the current scene/shot number and its counter. Spectrum is not used.

## Do / Don't
- Do keep bars thin and pure near-black; they are the frame, not decoration.
- Do keep one subtitle line per shot.
- Don't add film-grain, flicker, sprocket holes or any retro effect.
- Don't letterbox with anything but 2.39:1.
