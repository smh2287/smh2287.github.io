# DESIGN.md — Drawing Sheet

## Overview / mood
The portfolio as an issued drawing set. Every page is a framed sheet on a faint millimetre grid, with zone marks, a title block, view labels with balloon letters and a drawing list instead of a menu. Renders are treated as views (A, B, C…) and can carry real drawing annotations — dimension lines, centre marks, item balloons and a parts list — which a single toggle switches off to leave the clean images. Precise and quiet; the pleasure is in hairlines and lettering.

## Colors
| Token | Hex | Role |
|---|---|---|
| `--paper` | `#ECEEE9` | Drafting-film sheet |
| `--ink` | `#18212E` | Blue-black linework and lettering |
| `--dim` | `#2447E6` | Dimension blue: every annotation, active list row, toggle, links on hover |
| `--mute` | `#6C7480` | Field labels, secondary lettering |
| grid | `rgba(24,33,46,.055 / .11)` | 10px minor / 50px major grid |
| `--plate` | `#111214` | Image ground |

Rule: ink = the drawing, blue = everything that was *added to* the drawing. If the annotation toggle is off, no blue remains on the plates.

## Typography
- Lettering: **Barlow Condensed** 500, uppercase (DIN-like). Name 138px / .8, project title 150px, sheet number 72px, sheet title 44px, list titles 21px, title-block values 30px.
- Annotation/body: **DM Mono** 400, 11.5px / 1.5, +0.02em; field labels 8.5px uppercase +0.1em; dimensions 11px.
- Numbers are sheet codes: `01` (project) → `01.3` (section sheet) → `3.02` (plate) → `H` (view letter).

## Spacing / grid
- Sheet inset 20px from the viewport, 1.5px ink frame, 16px zone band (1–8 / A–E) on the home sheet.
- Inside a sheet: 36px padding, 12 columns, 20px gutter; view rows 34px apart.
- Home sheet: drawing field + 440px right column (drawing list → preview → title block), fits 1440×900 exactly.
- Each section of a project is its own sheet, closed by a one-row title strip (title / sheet x of y / rev).

## Components
- **Index row (drawing list)**: 41px rows — sheet no., condensed title, year, rev. Hover/focus fills the row dimension blue and swaps the preview view.
- **Image plate (view)**: dark plate, plate code top-left in mono, view label below: circled letter + title + scale, underlined.
- **Annotations** (`.an`): `.dim.h / .dim.v` dimension lines with dot terminators and paper-backed figures; `.cm` centre marks; `.bal` item balloons keyed to a parts-list table; `.tag` in-plate labels. All positioned in % so they track the image.
- **Caption**: the view label; no free prose captions. Section text sits in a `NOTE` field.
- **Nav**: top strip of the first sheet — Index / About / Contact / Annotations toggle / Lock.
- **Lock**: a small title block in the middle of the sheet ("controlled copy"), passcode field, status cells. Any input + Enter opens.
- **Comments**: fixed last sheet as a revision table (No. / Date / By / Comment).

## Motion
Annotation toggle fades `.an` in .2s; list/preview swap .2s opacity. No other motion; reduced motion removes transitions.

## Do / Don't
- Do keep every line 1px (frame 1.5px). Do letter in uppercase condensed, annotate in mono.
- Do only dimension true orthographic views (side/front/rear). Dimensions shown are nominal and need Minho's confirmation before publishing.
- Don't use blue for decoration, don't round corners (balloons and toggles excepted), don't fake blueprint-blue backgrounds.
- Don't annotate every image — one or two annotated views per sheet.

## Spectrum
Not used by default. Optional and literal only: Pl. 2.03 (UV layout) already contains the full spectrum inside the image; the template leaves it as the single colourful moment. Never colour-code sheets.
