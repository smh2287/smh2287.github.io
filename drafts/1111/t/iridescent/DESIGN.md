# DESIGN.md — Iridescent

## Overview / mood
A quiet, neutral studio page — warm grey paper, light-weight grotesk set large, one wide image. The Spectrum taste appears the way it does on a real object: as thin-film interference on very small surfaces (a 1px edge, a 9px dot, a 38px seal). The colour shifts with the viewing angle (pointer x), so it is noticed rather than shown. Remove the film and the page is a complete monochrome layout.

## Colors
| Token | Hex | Role |
|---|---|---|
| `--bg` | `#F2F1EE` | Page background |
| `--paper` | `#FAF9F7` | Comment field |
| `--ink` | `#18181B` | Text |
| `--mute` | `#8B8A86` | Secondary text, mono labels |
| `--soft` | `#B9B7B2` | Non-active index titles while hovering |
| `--line` | `#DBD9D4` | Neutral hairlines |
| `--film` | `#5FC4E6 → #8498F2 → #C088EE → #F390B8 → #F6C27E → #9FE0AD` | Thin-film gradient, hairlines and seal only |

Film is never a fill behind text, never a button, never larger than 38px in its short dimension.

## Typography
- **Hanken Grotesk** 300 for display (H1 100px / .96 / -0.045em · H2 36px · index title 33px / 1.12 / -0.03em · intro 25px / 1.24), 400 for body 15px / 1.5, 500 only for the name and `Post`.
- **DM Mono** 400, 11px, uppercase, +0.04em — numbers, years, spec card.
- Display is always weight 300: the thinness of the type matches the thinness of the film.

## Spacing / grid
- 12 columns, 24px gutter, 40px margins.
- Home: frame col 1–8 (2.5:1), side col 9–12 (intro top, spec card + seal bottom); index rows below on the same grid — number col 1, title col 2–8, kind col 9–11, year col 12.
- Project: title col 1–8, spec col 9–12; section header label 1–2 / H2 3–7 / copy 9–12. Plates: flex rows by natural ratio, 12px gap, 36px between rows; sections 104px apart.

## Components
- **Index row**: 33px light title on a 1px neutral rule. Active row: rule becomes a 2px film line, a 7px film dot slides in before the number; other titles fall back to `--soft`. The row drives the frame image and the spec card.
- **Frame / image plate**: image with a 1px film edge (padding 1px over the gradient). No radius, no shadow. Project plates below the hero are plain, uncropped.
- **Seal**: 38px film disc with fine concentric rings and a paper centre, sitting at the corner of the spec card — the template's signature, like an authenticity mark.
- **Caption**: mono plate code + 13px label under the image.
- **Nav**: film dot + name left; Work / About / Contact / Lock right; 1px film rule under the header.
- **Lock**: 104px 1px film ring that rotates hue as characters are typed, name, one line, input on a film underline. Any input + Enter opens.
- **Comments**: fixed last section; paper field with neutral border, focus shows a double film ring.
- **Focus**: every focus-visible state is the same blue/pink double ring.

## Motion
- Film position follows pointer x (rAF-throttled, no easing loop, nothing moves on its own). Frame cross-fade .6s, row states .3s. `prefers-reduced-motion`: film is static, transitions off.

## Do / Don't
- Do keep film to edges, dots and the seal. Do keep display type at weight 300.
- Don't use the gradient as a background, on text, or on buttons. Don't animate it by time.
- Don't add a second seal per page, and don't tint images.

## Spectrum
Used as material, not as code: one continuous film gradient everywhere, same order, never mapped to sections or process stages. Its hue offset depends only on viewing angle.
