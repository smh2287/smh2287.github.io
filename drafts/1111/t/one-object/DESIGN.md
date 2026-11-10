# DESIGN.md — One Object

## Overview / mood
One product, one screen. Each project is a single 4:3 tile placed on a matte, slightly warm ground, with a three-line caption at the lower left and nothing else but four corner words (name, Index, Lock, counter). Scrolling moves to the next object and the ground drifts to a neighbouring tone. The feeling is a product placed on a table and looked at properly: calm, exact, a little dry. Sensory quality comes from the proportion of tile to margin, the caption's position, and the slow tonal shift.

## Colors
| Token | Hex | Role |
|---|---|---|
| `--ground` | `#DCDAD5` | Default ground (CLE). Animated per object. |
| ground 2 | `#D3D9DC` | Cool grey-blue ground |
| ground 3 | `#CDD2C5` | Grey-green ground |
| ground 4 | `#DFD0C4` | Warm clay ground |
| ground 5 | `#D2CED6` | Grey-lilac ground |
| ground 6 | `#DCD0CB` | Rose-grey ground |
| `--ink` | `#1B1B19` | Text and 1px underlines |
| `--mute` | `rgba(27,27,25,.5)` | Secondary text |
| `--hair` | `rgba(27,27,25,.16)` | Index-sheet rules |

All grounds share lightness (~84%) and very low chroma; only hue moves. There is no accent colour — the object's own colour is the accent.

## Typography
- **Instrument Sans** 400 / 500 only.
- Scale: one text size, 15px / 1.4, for everything on the object screens (500 for the title, 50% ink for the rest). Second size, 34px / 1.1 / -0.03em, only in the index sheet, the lock input and "Next".
- Sentence case, no uppercase labels, tabular numerals for counters and plate numbers.

## Spacing / grid
- Three columns: `19vw` side · object · `19vw` side. 28px page margin.
- Tile width = `min(100%, (100svh − 150px) × 4/3)` so the object always fits the screen with air above and below.
- Home sections are `100svh` with proximity scroll-snap.
- Project page: left column (19vw) holds the section number, title and paragraph; right column stacks plates full width with 28px gaps; pairs share height via `--r`.

## Components
- **Index row**: the "row" is a whole screen — tile + caption (title 500, discipline, year, underlined `View`). A full-screen index sheet (corner `Index`) lists all six at 34px with hairlines; hovering dims the other rows.
- **Image plate**: sharp-cornered, no border or shadow; hover scales the image 1.5% inside its frame.
- **Caption**: plate number + muted title on one line, 9px under the plate.
- **Stage**: one frame, four text buttons (Whole / Parts / UV / Rig); active = ink with 1px underline; one muted sentence below.
- **Nav**: four fixed corners — name (TL), Index (TR), Lock (BL), `1 / 6` (BR). No bar.
- **Lock**: ground-coloured full screen, aligned to the object column; two lines of text, a 34px passcode input with wide tracking on a hairline, `Enter` underlined. Any input + Enter opens.
- **Comments**: fixed last section in the same left-label / right-content layout; a quiet slot in a 5% ink tint, no outline.

## Motion
- Ground colour: .9s ease when the object in view changes. Tile hover 1.2s scale 1.015. Stage cross-fade .5s. Index sheet fade .25s.
- Nothing moves on load. `prefers-reduced-motion` removes transitions and scroll-snap.

## Do / Don't
- Do show exactly one thing per screen. Do keep text at one size.
- Do keep grounds matte and equal in lightness.
- Don't add a second image, a grid of thumbnails, a headline or an accent colour to the home screens.
- Don't use saturated grounds or gradients.

## Spectrum
Used in its quietest form: the six grounds are six low-chroma steps around the hue circle, so scrolling the home passes through a muted spectrum. Colour belongs to the *object in view*, not to process stages — inside a project the ground stays fixed.
