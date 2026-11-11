# DESIGN.md — Showroom Rail

## Overview
A horizontal walk. Home is a single rail of 21:9 plates on the PDF charcoal — you move along it sideways (wheel, drag, arrow keys, swipe) the way you walk along a showroom wall. The plate in front of you is lit; the next one waits dimmed at the edge. A thin mint ruler at the bottom shows where you are. That is the whole idea.

## Colors
| token | hex | role |
|---|---|---|
| `--bg` | `#1F2021` | ground (PDF charcoal) |
| `--pbg` | `#171819` | plate ground, comment slot |
| `--ink` | `#E8E8EA` | active title |
| `--mid` | `#A9A9A9` | inactive title, body |
| `--mute` | `#60656E` | ruler ticks, data |
| `--hair` | `#34363A` | ruler base line, rules |
| `--mint` | `#1FFFE0` | ruler marker, active number, plate codes |
| `--spec` | mint → `#3FA9FF` → `#8A6BFF` → `#FF4B5C` | 1px travelled line on the ruler only |

## Typography
- Manrope 300 — titles (34px on the rail, up to 76px on the project head).
- IBM Plex Mono 400, 11px uppercase — numbers, data, ruler.

## Grid / plates
- **Every plate is 21 : 9.** On the rail a plate is ~76vw wide (height-capped so plate + caption + ruler fit one screen); the next plate peeks in at the right.
- 28px gap between plates = 28px page margin. Scroll-snap to the plate's left edge.
- Project page is vertical, plates full-bleed 21:9, 2px apart; a plate may hold two cells side by side.

## Components
- **Rail item**: plate, then one line — mint number · title · discipline/year. Inactive plates sit at 42% opacity.
- **Ruler**: 1px hairline with 51 ticks (every 5th taller), a 9px mint marker at the scroll position, counter `01 / 06`. On the project page the same ruler is fixed at the bottom and tracks vertical progress.
- **Image plate + caption** (project): plate, mono line with mint code.
- **Nav**: 56px, name · three mono links · Lock.
- **Lock**: full-screen charcoal, passcode underline; any input + Enter opens; arrow keys/wheel are ignored while locked.
- **Comments**: fixed last section, bordered slot.

## Motion
Native scroll with snap; 0.4s opacity on the active plate. No parallax, no inertia library. `prefers-reduced-motion` removes smooth scrolling and transitions.

## Mint + spectrum
Mint is the position marker and the active number. The spectrum appears once, as the 1px line the marker leaves behind on the ruler: it starts mint and only reaches other hues at the far end of the wall — mint is the anchor, spectrum is the "+".

## Do / Don't
- Do keep exactly one row of plates; never wrap into a grid.
- Do keep the ruler 1px.
- Don't auto-advance, don't add arrows over the images.
- Don't dim below legibility — the next plate must read as "there is more wall".
