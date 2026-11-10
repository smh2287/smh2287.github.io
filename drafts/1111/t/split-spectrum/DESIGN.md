# DESIGN.md — Split Spectrum

## Overview / mood
A monochrome page built around one measuring instrument. The index is a horizontal ruler graduated like a spectrometer scale (380–780 nm); the six projects are stops on it and a needle marks the current one. Above it, one condensed poster-size title and one greyscale plate. Colour is never applied to anything — it only appears where light is physically "split": a 3px slit of spectrum that travels with the needle, and the red/green/blue channels of an image drifting a few pixels apart. Structure and type are the design; the spectrum is evidence of an instrument at work.

## Colors
| Token | Hex | Role |
|---|---|---|
| `--paper` | `#F3F3F0` | Page background |
| `--ink` | `#0E0E0F` | Text, ruler, ticks, rules, needle |
| `--mute` | `#85857F` | Mono labels, scale numbers |
| `--soft` | `#B4B4AE` | Inactive stop titles, "next" |
| `--line` | `#D2D2CC` | Reserved hairline |
| `--plate` | `#000000` | Ground behind split images (required for screen blending) |
| `--spec` | `#7A4DFF → #2F7BFF → #19C3C8 → #3ED36B → #F2D634 → #FF8A2B → #F0383F` | The slit only (3px home, 2px project header) |

## Typography
- **Archivo** variable (width 62–125). Display at width 62 / weight 500: home title 138px / .86 / -0.022em · project H1 164px / .85 · next 56px. Sub-display at width 75 / 500: H2 40px, stop title 21px. Section numerals width 62 / weight 300 / 96px. Body width 100 / 400 / 15px (14px in section copy).
- **Spline Sans Mono** 400, 11px, uppercase, +0.06em — readouts, spec lines, captions; 9.5px for scale numbers.
- The width axis is the hierarchy: narrower = louder.

## Spacing / grid
- 12 columns, 24px gutter, 40px margins.
- Home (fits 1440×900): readout line + title in col 1–7 (bottom-aligned to the plate), plate col 8–12 at 5:4, one spec line, then the ruler across all 12 columns with stops every 16.25% (13 minor ticks).
- Ruler: minor tick each 1.25% (5 nm) 7px, mid 6.25% 14px, major 12.5% (50 nm) 22px, 1px baseline.
- Project: H1 col 1–8, spec col 9–12; section header = numeral col 1, H2 col 2–7, copy col 8–12, closed by a 1px ink rule; plates in flex rows by natural ratio, 12px gaps; sections 128px apart.

## Components
- **Index ruler / stop**: each project hangs from the ruler on a 1px ink stem — number, title (width 75), year/kind. Inactive titles are `--soft`; hover/focus/←→ makes a stop active: needle slides there, slit follows, readout (`01 / 06`, `λ 390 nm`), title and plate update.
- **Split plate**: three stacked copies of the image, each reduced to one channel by an SVG `feColorMatrix`, blended with `screen` on black. Rest offset 3px (R left, B right); moving across the plate drives the offset from −16 to +16px, zero under the centre; changing project gives one short 12px pulse. On the home the source is greyscale first (`.mono`), so only edges show colour. Project hero uses the same split in full colour; all other project plates are plain and uncropped.
- **Caption**: mono, plate code in ink + label in mute.
- **Nav**: name left, mono links + `Lock` right. On project pages the header becomes a sticky scroll ruler: needle = reading position, taller ticks = sections (0–5, C), readout `CLE · 3`.
- **Lock**: condensed name, one line, a short ruler whose needle advances one major tick per typed character, input beneath. Any input + Enter opens.
- **Comments**: fixed last section `C`, same header grammar; 1px ink textarea (col 2–10) and a mono `Post` button.

## Motion
- Needle and slit .5s ease-out; channel offsets .6s settle, immediate while the pointer is on the plate. Nothing moves without input; no scroll effects besides the header needle. `prefers-reduced-motion`: offsets fixed at 0, transitions off.

## Do / Don't
- Do keep every surface monochrome; let colour appear only from the slit and the channel split.
- Do keep the rest offset small (≤3px desktop, 1.5px mobile).
- Don't tint text, rules or backgrounds with spectrum colours. Don't assign a colour to a project or section — a stop's wavelength is a position on the ruler, shown as a number.
- Don't add glitch/noise/scanline effects; the split is optical, not digital damage.

## Spectrum
This is the template where Spectrum is the organising metaphor, but as geometry (a scale) rather than as a palette. One continuous gradient exists and is seen only through a ~220px window around the needle.
