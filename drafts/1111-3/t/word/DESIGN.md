# DESIGN.md — One Mint Word

## Overview / mood
One Car, and one word. Every letter on the site is grey — name, labels, counters — except a single mint word per screen. On the home the six projects are written as one quiet serif sentence above the plate: *CLE Cabriolet, MDEK, IAC 2022, IAC 2021, Vishow, Niva.* The project on the plate is the word that is lit. In the project each plate carries one short sentence, and one word of it is mint: *the open-top **line***, *Athletic **stance***, *Subtle **ambience***. Mint becomes the way the portfolio points.

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
| `--mint` | `#1FFFE0` | **the hero colour** — exactly one word (or name) per screen; caret and focus. Never two |
| spectrum | `#FFE14A → #FF3D6E → #8B5CFF` | only as the small "+" described below |

The only other chroma is the car's red interior inside the images.

## Typography
- Instrument Serif 400 — the sentence 22–33px, captions 19–24px, title 38–64px, name 22px. All grey (`--mid` / `--mute`).
- Geist Mono 400, 11px, uppercase, +0.09em, mute — codes, labels, footer.

## Spacing / plate
- Plate ratio **12 : 5 (2.4 : 1)**, always horizontal, one per view.
- Plate width = `min(72vw, (100svh − 260px) × 2.4)` → **72 % of the viewport width at 1440×900**, optically centred both ways (the stage is centred by grid; labels hang off it absolutely so they never push the plate).
- Side margins ≥ 14 % on desktop; mobile 16px margins.
- Page margin 32px for the name / Lock / footer line. Nothing sits in a bottom band: only one 11px mono line in the footer corners.
- Studio shots wider than 2.4 are contained and feathered into the charcoal (mask, no box); full-frame shots are covered with a per-image `object-position`.

## Components
- **Plate**: one image, 72vw × 12 : 5.
- **Index sentence**: sits 22px above the plate, left-aligned to it; words are links (click = show that car; click the lit word or the plate = open).
- **Caption (home)**: mono, mute, under the plate: `MERCEDES BENZ  CLE CABRIOLET _EXTERIOR` · `01 / 06`.
- **Caption (project)**: one serif sentence under the plate at the left with its one mint word; mute code + label at the right.
- **Title screen**: `Mercedes-Benz CLE Cabriolet` above the plate — only *CLE Cabriolet* is mint. Comments screen: the word `Comments`.
- **Nav**: `Minho Song` top-left, `Lock` top-right. No menu.
- **Lock**: centred name, `Mobility Digital Visualization Portfolio`, one underlined field with a mint caret and mint rule on focus; any input + Enter opens. `#lock` or Lock shows it.
- **Comments**: fixed last screen of the project — an empty 12 : 5 hairline frame the size of a plate (label, `Comments`, widget slot), then `← Index / 02 MDEK →` in the same tiny mono.

## Motion
Home: 0.8s cross-fade of the car; the mint moves to the next word over 0.6s and its underline draws in left-to-right over 0.8s. Wheel/keys/swipe are throttled to one car per gesture. `prefers-reduced-motion`: no transitions or animations, instant jumps.

## Mint + spectrum
Mint is used the way a designer uses a red pencil: once. The spectrum is the underline of the lit word on the home — a 1px rule that is mint for two thirds of the word and disperses into yellow, magenta and violet at its end. It exists only under the active item.

## Do
- Count the mint words on every new screen: the answer must be one.
- Choose the word that names what the plate shows (line, stance, light, stitching).
- Keep the serif at regular weight and modest size; it is a caption, not a headline.

## Don't
- Don't colour mono labels mint here.
- Don't underline anything but the active word.
- Don't set the sentence in caps or bold.
