# DESIGN.md — Light Table

## Overview / mood
A photo editor's desk at night. The room is near-black; the only bright thing is one sheet of lit opal glass, and the work lies on it as transparencies. Home = six 35mm slide mounts on the glass beside a quiet text index. Project page = strips of film on the same glass, each frame carrying its code and caption in the black rebate. Sensory quality comes from material honesty (warm glass, card mounts, amber rebate type) and from the single contrast of dark room / lit surface — not from animation.

## Colors
| Token | Hex | Role |
|---|---|---|
| `--room` | `#0B0B0C` | Page background (the dark room) |
| `--line` | `#252526` | Hairlines in the room |
| `--ink` | `#EBE8E0` | Text in the room |
| `--mute` | `#7C7A74` | Secondary text, mono labels |
| `--glass` | `#F7F5ED` | Lit table surface (centre `#FDFCF7`, edge `#E9E5D8`) |
| `--mount` | `#E3E0D6` | Slide mount card; type on it `#2A2925` |
| `--rebate` | `#060606` | Film border around every project image |
| `--amber` | `#DFA23C` | Rebate edge print only (frame code, caption), input caret |

Light is warm (5000 K). There is no accent colour in the interface; amber exists only as "printed on film".

## Typography
- **Schibsted Grotesk** 400/500 — everything that is read. H1 80px / .98 / -0.035em · intro 21px / 1.32 · H2 26px / 1.15 · index title 17px · body 15px / 1.5.
- **Courier Prime** 400 — everything that is labelled: 11px, uppercase, +0.08em (nav, numbers, years, mount stamps); 9.5px +0.14em in the film rebate.
- Two voices only: grotesk speaks, typewriter stamps.

## Spacing / grid
- 40px page margins. Home: fixed text column (≤372px) + table, 64px gap.
- Table: 3 × 2 slides, 34/38px gaps, 42–50px glass margin; glass has a 9px dark bezel and faint quarter lines.
- Project: 12 columns / 24px gutter for text (label col 1–2, title 3–7, copy 8–12). Film sheet: 20px glass margin, 12px between frames; rows are flex with each frame's natural ratio, so no image is cropped.
- Section spacing 84px.

## Components
- **Index row**: number (mono) · title 17px + mono discipline line · year. Inactive rows sit at 62% opacity; the active row is full white with a warm-white number. Rows and slides are linked both ways.
- **Slide mount** (home thumbnail): square card, 7px radius, 3:2 window, stamps `MS—01 / 2025` above and title below; each sits rotated ≤1° and straightens on hover. Non-active slides dim to 42%.
- **Loupe**: 168px round lens, × 2.4, follows the pointer over a slide; when idle it is parked on the first slide like an object left on the table. Hidden on touch.
- **Image plate** (project): the image inside a black rebate; top edge prints `code — MS 5063 — CLE`, bottom edge prints the caption, both in amber mono. The rebate *is* the caption.
- **Nav**: name left, mono links right, plus `Lamp` (switches the table off/on) and `Lock`.
- **Lock**: a single blank slide mount in the dark. Typing warms the window from black to lit; Enter opens. Any input works.
- **Comments**: fixed last section, dashed slot on the 12-col grid, refers to frames by code.

## Motion
- Slide straighten .45s, opacity dims .25–.35s, lamp .4s. Loupe follows the pointer with no easing. No scroll effects, no intro. `prefers-reduced-motion` removes all transitions.

## Do / Don't
- Do keep exactly one lit surface per view. Do let the rebate carry code and caption.
- Do keep images uncropped on the project sheet.
- Don't add coloured UI accents, glows on text, or film-grain overlays.
- Don't rotate slides more than 1°, and don't animate them on load.

## Spectrum
One hairline only: light leaking through the bevelled edge of the glass shows as a 1px spectrum under the table, plus a faint red/blue fringe on the inside of the loupe rim (chromatic aberration of a real lens). Both disappear when the lamp is off. Never used for sections or stages.
