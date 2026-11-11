# DESIGN.md — One Car

## Overview
Round-1 "One Object", turned horizontal. The whole home is one car: a single 2.4 : 1 plate floating on the PDF charcoal, the name top-left and one mint label under the plate. Scroll, arrow keys or swipe swap the plate for the next project's — the frame never moves, only the car changes. The project page is the same idea in sequence: one plate per screen.

## Colors
| token | hex | role |
|---|---|---|
| `--bg` | `#1F2021` | ground (site + PDF charcoal) |
| `--deep` | `#121213` | vignette edge of the ground, lock |
| `--plate` | `#171819` | comment slot ground |
| `--ink` | `#E8E8EA` | name, titles |
| `--mid` | `#A9A9A9` | captions, mono labels |
| `--mute` | `#60656E` | counter, secondary |
| `--hair` | `#34363A` | input rule, comment border |
| `--mint` | `#1FFFE0` | the one label, plate codes, focus |

Only other chroma: the car's red interior inside the images.

## Typography
- Geist 300 — name 17px, project title up to 64px (−0.035em).
- Geist Mono 400, 11px, uppercase, +0.08em — label, counter, captions.

## Spacing / grid / plate
- Plate width = `min(100vw − 56px, (100svh − 220px) × 2.4)`; **ratio 12 : 5 (2.4 : 1)** always.
- 28px page margin (16px mobile). Label sits 18px under the plate, same width.
- Studio shots wider than 2.4 are *contained* and faded into the charcoal at the edges (mask, no box); full-frame shots are *covered* with a per-image `object-position`.

## Components
- **Home plate**: 6 stacked images, one visible; 0.8s opacity swap. Click opens the project.
- **Label**: mint `CLE CABRIOLET _EXTERIOR` left, grey `01 / 06` right. Nothing else on the page.
- **Project screen**: one plate per 100svh, caption = mint code / grey label / one sentence. First screen adds the title; arrow keys jump screen to screen (scroll-snap proximity).
- **Nav**: name left, `Lock` right. No menu.
- **Lock**: centred name, mint portfolio line, underlined field (mint on focus); any input + Enter opens. `#lock` or Lock shows it.
- **Comments**: final screen, a 2.4 : 1 bordered slot, then `← Index / 02 MDEK →`.

## Motion
Opacity cross-fade only; wheel is throttled (one car per gesture). Reduced motion: no transitions, instant jumps.

## Mint + spectrum
Mint = one label per screen + plate codes + focus. No fills, no glow. Spectrum not used — pure dark + mint.

## Do / Don't
- Do keep exactly one car on screen.
- Do keep every plate 2.4 : 1.
- Don't add an index list, thumbnails or a second accent.
- Don't put text on the car.
