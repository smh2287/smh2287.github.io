# Minho Song — Portfolio 2026 site — DESIGN.md

Built on the approved Janin-structure draft (2026-11-12, `research/portfolio-refs-2026-11-12/janin/`). Sections 1–5 and 8 are carried over unchanged; section 6 and 7 are updated for the full six-project build (2026-11-13), and section 9 is new.

One draft that takes the **layout, structure and interaction** of Stephane Janin's site (sjanindesign.com) and re-skins it with Minho Song's colours and content. All HTML/CSS/JS is hand-written; no image, text, logo or code of his is used. His screenshots in `_ref/` are for comparison only and must not be published.

## 1. Reference analysis (what the Janin site actually does)

Measured from 1440×900 captures (`_ref/`).

| Aspect | Janin | Notes |
|---|---|---|
| Site map | 3 levels only: home (= about/CV) → Projects (one list) → project page | No menu bar, no filters, no footer nav |
| Home | One very tall (≈1.9 screens) full-bleed, tightly cropped car close-up, almost monochrome. On it, at ≈42 % of the first screen: **bold name + light role on one baseline**, and one bold word `PROJECTS` far right. | The crop is so tight the car is abstract; type sits directly on the image |
| Home, below | A tiny CV list (≈11 px, 15 px leading) starting at ≈37 % from the left, i.e. *not* on the name's axis; a bold "click here…" link; an italic serif contact line back on the name's axis; a one-line copyright at the very bottom | Three different left edges, all very small type |
| Text axis | Every page hangs its text on one left axis at ≈15.4 % of the viewport (a 980 px column centred in 1440) | |
| Nav | Two tiny words (13 px) at the very top: `home page` left, `resume` right. The left one sits ≈5 % *outside* the text axis. Project pages have only `< back to projects` (15 px). | No logo, no sticky header |
| Projects header | The word **Projects** in ≈72 px bold, then a 5-line slash-separated list of disciplines (14 px), then ≈120 px of air | |
| Listing | One column of full-width image tiles stacked with a ≈7 px gap. No titles, no captions, no grid, no hover card. Tiles are ≈89 % of the viewport — **wider than the text column, overhanging it on both sides**. | The whole tile is the link |
| Project page | 20 px bold title `YEAR Brand : NAME` → a very narrow paragraph (≈260 px measure, 12.5/16) → a large gap (≈150 px) → small uppercase section label (16 px, regular) → wide plate → rows of three tiles with 5 px gaps → next label … → credits list in tiny type | Text is always narrow and left; images are always wide |
| Ratios | Mixed: natural-ratio wide plates, then rows of 3 at ≈4:3 / 3:2 | |
| Type | One grotesque (Helvetica/Arial family) in two weights; one italic serif only for the e-mail line. Scale: 72 / 27 / 20 / 16 / 14 / 12.5 / 11 | |
| Colour | Light: white pages, black type, grey home image | |
| Motion | Images fade in as they arrive; plain link hovers. Nothing else. | |

The signature is the **contrast of scale**: huge quiet images, minuscule type, and text that hangs on an inner axis while the plates overhang it.

## 2. What was carried over / what was changed

Carried over: the 3-level map; the home composition (tall cropped car, name + role on one baseline at 42.5 vh, lone `PROJECTS` at the right, CV list on its own inner edge, italic contact line, one-line copyright); the top nav of two tiny words with the left one stepped outside the text axis; the 72 px `Projects` word + slash list; the single stacked column with hairline gaps; the project-page rhythm (20 px title → 262 px paragraph → 150 px air → 16 px uppercase label → wide plate → rows of three, 5 px gaps → credits); the overhang of plates past the text axis; fade-in on arrival as the only motion; the type scale.

Changed, and why:
- **Dark ground instead of white** — Minho's palette. Proportions kept.
- **Plates are 78 vw, not ≈89 vw** — Minho's rule: never edge to edge, 62–78 % of the viewport with ≥ 11 % side margins. The overhang is kept in reduced form: plate edge 11 % / nav 12.9 % / text axis 16 %.
- **Listing tiles are cropped to 2.4 : 1** (his are taller) — Minho's plate ratio; the car stays whole.
- **A tiny label in the left gutter** (index, title, year; plate code on project pages). Janin shows no titles at all; here six projects need names and the comment thread needs plate codes. It sits in the margin beside the plate, never in a band under it.
- **Click a plate → lightbox** showing that plate alone, centred at ≤ 78 vw × 76 vh. Not in the reference; added so every image can be seen in the middle of the screen with air.
- **Lock and comments** added (required). Both reuse his existing shapes: the lock is the home line (`MINHO SONG  passcode ____`), the comments are a narrow column on the text axis.
- **Mint** replaces his black as the one emphasis (he has none).

## 3. Colours

| Token | Hex | Role |
|---|---|---|
| `--g` | `#1F2021` | Main ground (all pages, lock) |
| `--g0` | `#171819` | Home image base, lightbox ground |
| `--g2` | `#212121` | Plate placeholder before the image loads |
| `--g3` | `#2B2B2B` | Hairlines (input underline) |
| `--t` | `#E8E8EA` | Headings, primary text |
| `--gr` | `#A9A9A9` | Body text, nav, captions |
| `--mu` | `#60656E` | Index numerals, notes, copyright |
| `--mint` | `#1FFFE0` | The single accent: `PROJECTS` on home, the label suffix (`_EXTERIOR`, `/ 2025`), link hover, focus ring, plate codes in comments, caret, selection |

Spectrum: one 34 × 1 px prism hairline in front of the contact line on the home page. Nowhere else.

## 4. Typography

- One family: `"Helvetica Neue", Helvetica, Arial, "Liberation Sans"` + Korean fallbacks. Weights 700 / 400 / 300. No web font is loaded.
- Second face: Georgia italic, 15 px, for the contact line only.
- Scale: 72/86 bold (`Projects`) · 27/32 bold (name, `PROJECTS`) · 25/32 light (role) · 20/24 bold (project title) · 16/21 regular uppercase (section label) · 14/17 (discipline list) · 13/20 (nav) · 12.5/16 (body) · 11/14 (captions, credits).
- Label grammar from the PDF: `MERCEDES BENZ / 2025`, `CLE CABRIOLET _EXTERIOR` (_BRAND STUDY, _MODEL, _CLOSEUP, _INTERIOR, _SCENE, _REVIEW); first part text colour, suffix mint.

## 5. Spacing and grid

- Text column `--col`: `max(980px, 68vw)`, centred → text axis ≈ 16 % at 1440.
- Plate width `--pw`: **78 vw** (1123 px at 1440), centred, ≥ 11 % side margins. Listing tiles 12 : 5 (2.4 : 1). Project plates keep their natural ratio at 78 vw; rows of three are 12:5, 3:2 or 4:3 with 5 px gaps.
- Listing gap 8 px; plate-to-plate 5 px.
- Vertical rhythm on project pages: 150 px above each label, 30 px below, 120 px above credits.
- Home: name line at 42.5 vh; CV list at 92 vh; total height 188 vh.
- ≤ 1280 px: gutter labels fold into one small line above the plate. ≤ 760 px: 16 px margins, plates full width, rows of three become a single column at natural ratio, home stacks.

## 6. Components

- **Nav** — two words, 13 px, grey → mint on hover. Not sticky. Repeated once at the page end.
- **Home line** — `h1` bold + role light on one baseline; `PROJECTS` absolutely placed at the right.
- **CV list** — year in grey, entry in text colour; each line links to the project.
- **Stack tile** — `<li>` with gutter label + linked 2.4 : 1 image; hover lifts brightness .9 → 1.04 and turns the index mint.
- **Section label** — 16 px uppercase, see grammar.
- **Text block** — max 262 px wide; first paragraph in text colour, the rest grey.
- **Plate / row** — links with `zoom-in` cursor; open the lightbox.
- **Viewer (Janin image zoom, re-coded)** — measured on sjanindesign.com project pages: click any image → fixed overlay over the dimmed page (here `rgba(18,19,20,.96)`; solid `#171819` on phones), body scroll locked; the image alone, contained in a box ≈84 vw × 80 vh, centred; a thin 18 px X at top-right (50 px in); thin 17×30 chevrons 50 px from each edge; the left and right thirds of the screen are click zones for prev/next; the image fades (.5 s) on open and on every change; ← / → change image, Esc closes, click on the empty ground closes; swipe on touch; navigation stays inside the page's image group and wraps; the URL gains `?lightbox=<image>` so a single image can be linked (works on locked pages after unlock); focus is trapped in the viewer and returned to the tile on close. Additions over Janin: a tiny plate code + caption at top-left (mint code), so comments can refer to `3.02`; next image preloaded.
- **Sub-work header** (KIA 2022, Hyundai 2022, KIA 2021) — 20 px bold work title, one-line tagline, tiny credit list; a numbered table of contents under the intro links to each sub-work.
- **Film** — a dimmed still of the same work as cover, `press to play` + the film title centred; on click a youtube-nocookie iframe replaces it with `autoplay=1&rel=0&modestbranding=1`. Nothing loads from YouTube before the click.
- **Credits** — 11 px list, `Key - value`.
- **Comments** (fixed last section, inline) — the existing backend `https://s-home.catfish-teeth.ts.net` (unchanged); one id per project `pf2026-<project>`; sign-in via the existing provider popup; note, thread as `name | text` rows, underline-only inputs, bold text button; plate codes in comments turn mint.
- **Lock** (KIA 2022, Hyundai 2022, KIA 2021 only) — the Janin home line as a one-line form: `passcode ____` at 42.5 vh. The page body is AES-GCM encrypted at build time (key = PBKDF2-SHA256 of the old site's passcode, 200 000 rounds); the HTML holds only ciphertext, so no text or image URL exists or loads before unlock. Correct passcode → body decrypted and inserted, derived key kept in sessionStorage (one unlock covers all three projects for the tab). The list tile of a locked project shows only a 36 px blurred grey preview until unlocked; its entry carries a tiny mint `locked`. This is a courtesy gate on a static site, not access control.

## 7. Motion

- Plates fade in (opacity, .7 s) as they enter the viewport. Colour hovers .2 s, tile brightness .35 s.
- No parallax, no page transitions, no intro.
- `prefers-reduced-motion`: all transitions off, plates visible immediately.

## 8. Do / Don't

Do: keep type tiny and images large; keep three left edges (plate / nav / text); keep text blocks narrow; let images carry the page; use mint once per view.

Don't: add a header bar, logo, grid of cards, filters, or captions under plates; let plates touch the viewport edge on desktop; add a second accent or a spectrum fill; copy any asset or wording from the reference; publish `_ref/`.

## 9. Content and media (2026-11-13)

- Projects (list order): Mercedes-Benz CLE Cabriolet (open) · KIA × K'arts IAC 2022 (locked; MOCAMPER, MOVILLA, EGONEST, lineup/logo/environment/XR) · HYUNDAI × K'arts IAC 2022 (locked) · KIA × K'arts IAC 2021 (locked) · VISHOW (open) · NIVA (open).
- Every image is one render/still (never a whole PDF page); where no original was found the single picture was cropped from the V4 PDF or a page export. Each image carries an evidence level in `manifest.json`: visual match / name match / pdf crop / page-export crop / unconfirmed.
- Images live on the NAS, not in the repo: `https://songfamhome.synology.me/portfolio2026/<project>[/<sub>]/<NN>-<name>.webp` (long edge ≤ 2560) and `…@1280.webp`; WebP q82, never upscaled. Pages use `srcset` (1280w / full), `loading="lazy"` and width/height.
- Pages are generated by `_work/build.py` from `_work/resolved/<project>.json`; do not hand-edit `p/*.html`.
