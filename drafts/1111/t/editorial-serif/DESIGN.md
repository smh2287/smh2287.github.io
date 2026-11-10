# DESIGN.md — Editorial Serif

## Overview / mood
A printed monograph, not a website. Warm uncoated paper, a light optical-size serif used very large, italics for titles, and a small tracked sans only for folios and labels. The home page is a contents page ("Selected Works, Vol. I"); each project is an article with a standfirst, numbered chapters, pull quotes and full-bleed spreads. Captions never sit on the images — they run underneath as numbered footnotes behind a short rule.

## Colors
| Token | Hex | Role |
|---|---|---|
| `--paper` | `#F2EDE3` | Page |
| `--ink` | `#1D1A16` | Text, hairlines |
| `--ox` | `#8C2F1B` | Oxblood: footnote numbers, chapter numerals, current/hover title |
| `--mute` | `#7D7568` | Secondary text |
| `--hair` | `#CFC6B6` | Secondary rules |
| `--plate` | `#141312` | Image ground |

Oxblood echoes the car's red interior at a much lower chroma; it is used only at footnote-number scale or for one numeral per chapter.

## Typography
- Display & text: **Newsreader** (optical size axis on), weights 300/400, true italics. Old-style proportional figures.
- Labels/folios: **Instrument Sans** 500, 10.5px, uppercase, +0.14em.
- Scale (1440): cover title 196px / .82 / -0.035em (roman + italic line, the italic indented) · article H1 168px · chapter H2 72px / .96 · pull quote 52px italic · standfirst 31px italic · contents title 25px italic · body 21px / 1.42 with a 3-line drop cap · footnote 14.5px / 1.38.
- First line of the home standfirst in small caps.

## Spacing / grid
- 12 columns, 24px gutter, 48px margins. Text measure is narrow (cols 4–8); images are either full-bleed (edge to edge), full measure, or an asymmetric pair.
- Chapter spacing 150px; plate spacing 72px. Footnote: 14px below plate, 96px rule, 12px, text.
- Rhythm rule per chapter: bleed → pair (image + quote, or image + image) → wide → bleed. Never two identical layouts in a row.

## Components
- **Index (contents) row**: six columns on one line; folio + year in sans labels, title in 25px italic, kind in mute. Hover/focus turns the title and top hairline oxblood and swaps the cover plate; the footnote under the plate rewrites itself.
- **Image plate**: no frame; bleed plates touch both viewport edges.
- **Caption = footnote**: superscript sans number in oxblood, sentence-case text, behind a 96px ink rule. Numbers run continuously through the article (1–18) so comments can cite "note 9".
- **Pull quote**: 52px light italic beside a portrait or 3:2 plate, with a sans attribution label.
- **Nav / masthead**: italic name left, issue line centred, sans nav right, 1px ink rule below.
- **Lock**: a half-title page — italic name, two lines of text, one underlined input, centred. Any input + Enter opens.
- **Comments**: "Letters" — fixed last section between two hairlines on the text measure.

## Motion
Opacity cross-fade on the cover plate (.35s) and colour change on hover (.15s). Nothing else moves. Reduced motion removes both.

## Do / Don't
- Do use italics for every work title. Do keep labels tiny and sans.
- Do let the title be the hero; the cover image is deliberately the smaller element.
- Don't put text on images. Don't use bold. Don't add a second accent or any rounded UI.
- Don't centre body text; only the lock page and masthead issue line are centred.

## Spectrum
Not used on the surface. Paper and ink only. If wanted, Spectrum may appear once as a physical-print metaphor (e.g. a thin colour bar like a printer's control strip in the colophon), never as section coding.
