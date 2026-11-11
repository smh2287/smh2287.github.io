# DESIGN.md — Profile Index

## Overview
A car is read first in side elevation. The home index is nothing but a vertical stack of very low, very wide strips — one per project, cropped like a side profile — each with a single mono row underneath. Strips rest in grey; the one under the cursor turns to full colour and shows its mint PDF label. The project page opens with the CLE's side profile as the same strip, then continues in 2.4 : 1 plates.

## Colors
| token | hex | role |
|---|---|---|
| `--bg` | `#1F2021` | ground (PDF charcoal) |
| `--deep` | `#171819` | strip / plate ground, comment slot |
| `--ink` | `#E8E8EA` | active title, headings |
| `--mid` | `#A9A9A9` | secondary text |
| `--mute` | `#60656E` | numbers, inactive rows, active row rule |
| `--hair` | `#34363A` | row rules, slot border |
| `--mint` | `#1FFFE0` | active number, PDF label, plate codes, section labels |

Resting strips are `grayscale(1) brightness(.5)`; the active strip is the only full-colour image (the CLE red interior is the only extra chroma).

## Typography
- Inter Tight 300/400 — titles (15px rows, 30px section heads, up to 78px project title).
- JetBrains Mono 400, 11px uppercase +0.06em — numbers, labels, captions.

## Spacing / grid / plate
- 28px margin (16px mobile). Rows separated by 10px.
- **Index strip 7 : 1** (4 : 1 on mobile), full content width. **Plates 12 : 5 (2.4 : 1)**.
- Project page: 3 / 9 column split — sticky section header left, plate column right.

## Components
- **Index row**: strip, then a 38px mono line `01 · Title · CLE CABRIOLET _EXTERIOR · 2025`. The mint label is hidden until hover/focus (always shown on touch).
- **Profile strip (project)**: first image of the project page, same 7 : 1 grammar, caption `0.00 CLE CABRIOLET _EXTERIOR`.
- **Plate + caption**: 2.4 : 1, then mono `3.02  CLE CABRIOLET _INTERIOR  Dashboard`, code in mint.
- **Section header**: mint `3 — Interior`, 30px heading, one line of text; sticky while its plates scroll.
- **Nav**: name left, `Mobility Digital Visualization Portfolio` centre in mute, `Index / Profile / Lock` right.
- **Lock**: a faint grey CLE profile strip across the middle of the screen behind the passcode field.
- **Comments**: last section, 2.4 : 1 bordered slot in the plate column, then back/next.

## Motion
0.5s filter fade grey → colour on the active strip; 0.3s slide-in of the mint label. Nothing moves position. Reduced motion: none.

## Mint + spectrum
Mint marks the active strip's number and label, plate codes and section labels — never a fill. Spectrum not used.

## Do / Don't
- Do keep index strips low (≥ 6 : 1) and full width.
- Do show only one coloured strip at a time.
- Don't put titles on the strips.
- Don't use square or 4:3 thumbnails anywhere.
