# DESIGN.md — Instrument

## Overview / mood
The portfolio as a piece of hardware and its manual. The page is one panel divided by 1px ink rules into cells; every cell has a small mono label, like silkscreen on a device. Projects are "modules" with short unit codes (`CLE–25`, `MDEK–22`) set large. Nothing floats: everything sits in a cell, flush to a 12px inset. The sensory quality comes from tight mechanical alignment, the contrast of 10px mono against 34–196px grotesk, and a single orange LED that marks state. Utilitarian, friendly, exact.

## Colors
| Token | Hex | Role |
|---|---|---|
| `--panel` | `#E4E4DF` | Page / panel ground (cool putty grey) |
| `--face` | `#EDEDE8` | Raised faces: keys, hovered module, lock card |
| `--ink` | `#141413` | Text, all structural 1px rules |
| `--mute` | `#85857F` | Labels, secondary text |
| `--soft` | `#C9C9C3` | Secondary rules inside a cell (table rows) |
| `--acc` | `#FF4A00` | LED on, active tab underline, figure codes, arrow button on hover |
| `--screen` | `#1D1D20` | Image "screens" (letterbox ground behind renders) |

Orange is a state indicator, never a surface. At most one lit LED per cell.

## Typography
- **Archivo** 400/500 — names, codes, headings, body. Tight tracking (-0.04 to -0.06em) at display sizes.
- **DM Mono** 400, 10px, uppercase, +0.09em — every label, nav item, caption, table.
- Scale (1440): project code 196px / .8 · operator name 64px / .9 · module code & section heading 34px / 1 · sub-title 22px · readout 20px · body 14px / 1.45 · label 10px.
- Two voices only: mono label (machine) and grotesk (human). No italics, no third family.

## Spacing / grid
- 12 columns with no gutters — columns are divided by rules, not gaps. 8px unit; every cell has a 12px inset.
- Home: 3 columns "operator" cell + 9 columns of modules (3 × 2, filling exactly one 1440×900 viewport). Top bar 40px, footer 32px.
- Project: 2-column sticky contents rail + 10-column document. Section header splits 2 / 4 / 4 (number · heading · annotation).
- Image rows: flex with `--r` (aspect ratio) so neighbours share one height; 12px between plates.

## Components
- **Index row → module cell**: header strip (No. · discipline · LED), dark screen with corner crop marks, footer with 34px code, 13px full name and a 38px round arrow key. Hover lights the LED and turns the key orange.
- **Image plate**: sharp corners, dark screen ground, no shadow. Whole-car plates are never cropped.
- **Caption**: mono line under the plate — orange figure code (`FIG 3.02`) left, view type right.
- **Stage + keys**: one 2.35:1 screen with four physical keys (Whole / Parts / UV / Rig). Keys have a 2px hard bottom edge that collapses when pressed; a readout sentence explains the mode.
- **Nav**: sticky 40px bar of ruled cells; current cell has a 3px orange underline; cell hover inverts to ink. Last cell is `Lock` with a lit LED.
- **Lock**: small device card centred on the panel — header strip with LED, "Enter passcode", six ruled cells that fill with dots, pill `Enter →`. Any input + Enter opens.
- **Comments**: fixed last section, a dashed-outline "log" slot with ruled lines; hint to cite figure codes.
- **Footer**: ruler tick scale between copyright and privacy note.

## Motion
- Colour/opacity only: .12s on hover states, .25s cross-fade on the stage, 2px key press. No scroll effects, no entrance animation. `prefers-reduced-motion` removes all transitions.

## Do / Don't
- Do put every element in a ruled cell with a label. Do keep one accent and use it as a light, not paint.
- Do let codes be huge and labels tiny.
- Don't round image corners, add shadows or gradients, or use icons beyond the LED dot and arrow.
- Don't imitate a specific product's skeuomorphic knobs — the reference is the manual, not the device.

## Spectrum
Not used on surfaces. If wanted, the single LED may cycle hue once (orange → through the spectrum → orange) at the moment the lock opens; it must return to orange. Never one colour per section.
