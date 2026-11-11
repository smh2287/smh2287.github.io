# DESIGN.md — PDF Native

## Overview
Minho's PDF page grammar, rebuilt as a web page. Each section is one 12:5 "page" on the PDF charcoal vignette, with the small white `MERCEDES BENZ` and mint `CLE CABRIOLET _EXTERIOR` label top-left and the mint `minho.song` / `digital visualization portfolio 2026` footer. Nothing is a pasted image of a page: labels, captions and footers are live text that scales with the page width, and on a phone the caption drops under the plate.

## Colors
| token | hex | role |
|---|---|---|
| `--bg` | `#121213` | gutter between pages, lock ground (PDF corner black) |
| `--page` | `#1F2021` | page charcoal (centre lifts to `#262729`, corners fall to `#121213`) |
| `--ink` | `#FFFFFF` | brand label, caption titles |
| `--mid` | `#A9A9A9` | caption body |
| `--mute` | `#60656E` | disabled notes |
| `--hair` | `#34363A` | comment slot border |
| `--mint` | `#1FFFE0` | model label, footer, cover title — exactly where the PDF uses it |

## Typography
- Montserrat 700 / 500 / 400 — brand label (700, white), model label (500 mint with the first word 700), captions, footer.
- Michroma — the single wide display word (`CABRIOLET`, section titles on text pages).
- Sizes are in `cqw` (container width units), so a page keeps PDF proportions at any width: label ≈ 0.92 / 1.12cqw, footer 0.72cqw, caption 0.86 / 1.3cqw, cover title 4.3cqw.

## Grid / plates
- **Page = 12 : 5 (2.4 : 1), full-bleed, 4px gutter.** Page margin 3.2cqw left/right, label at 2.6cqw from top, footer 1.9cqw from bottom — measured from the PDF.
- Home index strips are half-height pages (24 : 5) with the same grammar; the first project is a full cover page.
- A page holds one image or two cells side by side. Studio-backdrop images are inset (13% top / 9% bottom) and contained; interiors/close-ups bleed.

## Components
- **Label**: line 1 brand in white bold caps; line 2 mint `CLE` bold + `CABRIOLET _SECTION`.
- **Footer**: `minho.song` left, `digital visualization portfolio 2026` right, mint, tiny.
- **Caption**: bottom-left above the footer — white title + grey sentence on one baseline, as in the PDF ("Athletic Stance  to express…").
- **Index strip** (home): thumbnail cropped wide at 78% opacity → 100% on hover; `02 / 06 — 2022 →` top-right turns mint.
- **Cover page**: `MERCEDES BENZ` + Michroma `CABRIOLET` in mint + one-line descriptor; credits bottom-right.
- **Nav**: 48px charcoal bar. **Lock**: black screen, passcode underline, any input + Enter. **Comments**: last page, same label/footer, bordered slot.

## Motion
Only a 0.3s opacity on index strips. Disabled under `prefers-reduced-motion`.

## Mint + spectrum
Mint is used exactly as in the PDF: model label, footer, cover word. The word `SPECTRUM` appears once as the index label; no spectrum colours are drawn.

## Do / Don't
- Do keep label + footer on every page — they are the identity.
- Do keep type small; the image is the page.
- Don't paste exported PDF pages.
- Don't add page numbers, shadows or page-flip effects.
