# taoseto.com — Design Review & Optimization Plan

> A plan to refine the site's overall design, measured against Apple's Human
> Interface Guidelines. **No code has been changed** — this is the proposal.

## How this review was done

- **Code audit** of every active route and its CSS: `Hero`, `Commissions`
  (+ `CommissionsPortfolio2`), `ExperienceV2`, `ProjectsV2`, `Navbar`,
  `Contact`, plus globals (`index.css`, `App.module.css`, `vars.css`).
- **Visual audit** via Playwright: full-page screenshots of all four routes at
  desktop (1440×900) and mobile (390×844, an iPhone-class size in the HIG
  spec table). Saved under `.design-review/`.
- **Apple HIG reference** rendered with Playwright (the HIG is a JS SPA that
  plain fetching can't read). Captured text for *Layout*, *Typography*,
  *Color*, *Materials*, *Dark Mode* under `.design-review/hig-*.txt`.

## The HIG lens (principles this plan applies)

1. **Legibility** — honor minimum text sizes and weights; thin custom fonts
   need *larger* sizes. (Typography)
2. **Clear hierarchy through size + weight + spacing**, not opacity alone.
   (Typography)
3. **Consistent margins, alignment, and an 8-pt spacing rhythm**; align
   components so the eye can scan. (Layout)
4. **Make essential information easy to find**; give it space; don't bury it.
   (Layout)
5. **Progressive disclosure that is discoverable** — and works on touch.
   (Layout)
6. **Color used consistently and meaningfully**; sufficient contrast in dark
   mode; one color shouldn't mean different things; don't rely on color alone.
   (Color)
7. **Scale artwork so important content stays visible** instead of being
   cropped away. (Layout)

---

## Headline finding

The site already has a confident, restrained, mostly-monochrome aesthetic that
works — the Hero and Commissions pages in particular feel close to an Apple
sensibility. **The goal is refinement, not redesign.** The biggest wins come
from (a) a real foundation of design tokens so spacing/type/color stop being
ad-hoc, and (b) fixing a handful of concrete legibility, consistency, and
touch-usability defects.

---

## Findings & recommendations

Priority key: **P0** = blocking — a correctness/usability defect *or* a
foundation the rest of the work depends on; **P1** = clear HIG gap; **P2** =
polish / maintainability.

### A. Foundations: design tokens (P0 — everything else builds on this)

**Observation.** `vars.css` defines brand colors (`--color-primary` cyan,
`--color-secondary` orange, `--color-tertiary` gold) that are essentially
**unused** on the live pages — every active page paints `--color-text` (off
white) over `--color-bg` (#0A0A0A) at hand-picked opacities. There is **no
spacing scale and no type scale**: values are scattered magic numbers
(`10%`, `80px`, `100px`, `56px`, `47px`, `padding-left: 60%`, `2.3%`, …) and
font sizes range across `4.5 / 2.4 / 1.3 / 1.25 / 1 / 0.95 / 0.85 / 0.75 /
0.72 / 0.7 / 0.68 / 0.65 / 0.62 / 0.6 rem` with no system.

**HIG.** Layout calls for consistent margins and a regular spacing rhythm;
Typography for a deliberate scale. This also matches the repo's own code-style
rules (no magic numbers; name constants).

**Recommendation.** Introduce tokens in `vars.css` and migrate components to
them:

- **Spacing (8-pt base):** `--space-1:4px --space-2:8px --space-3:12px
  --space-4:16px --space-6:24px --space-8:32px --space-12:48px
  --space-16:64px --space-20:80px --space-24:96px`.
- **Type scale (rem):** `--text-display:4.5rem --text-h1:2.4rem
  --text-h2:1.3rem --text-body:1.0625rem (17px) --text-small:0.9375rem (15px)
  --text-label:0.75rem (12px, the floor)`. Pair with weight tokens.
- **Radius:** `--radius-sm:4px --radius-md:8px --radius-lg:12px` — pick one
  for buttons and use it everywhere (today buttons are 2px, cards 3/4/10/12px).
- **Text-opacity ramp:** name the allowed steps, e.g.
  `--ink-1:0.92 (primary) --ink-2:0.72 (body) --ink-3:0.6 (muted, min for
  informational text)`. **Nothing informational below 0.6.**
- **Decision on brand color:** either *commit to monochrome* and delete the
  unused cyan/orange/gold tokens, or *reintroduce exactly one accent* used
  only for primary actions. Recommended: keep monochrome, add **one accent**
  for the primary CTA and links so HIG principle 6 ("reserve color for what
  truly benefits from emphasis") is satisfied. (See note in Hero.)

### B. Navbar (P0 bug + P1 consistency)

**Observation.**
- **Bug:** on the **home** route the social icons (GitHub/LinkedIn/Spotify)
  overflow off the right edge and are clipped (home uses `overflow:hidden`),
  while on every other route they render fine. Cause: `.menuItems` uses a
  hardcoded `padding-left: 60%` to push the nav right.
- The nav gutter (`margin-left: 2.3%`) happens to match the Contact footer's
  `2.3%`, but **none of the content pages** (Hero `10%`, Commissions `100px`,
  Experience/Projects `80px`), so the logo and the page content beneath it
  don't share a vertical line.
- The hamburger-icon recolor is duplicated **four times** in
  `Navbar.module.css` *and again* in `index.css`, all with `!important` — a
  maintenance smell.

**HIG.** Layout: consistent margins; align components; controls inset from
edges and not clipped.

**Recommendation.** Replace the `padding-left: 60%` hack with `margin-left:
auto` on the nav group (flexbox) so it can't overflow. Align the nav gutter to
a shared `--gutter` token used by every page. Collapse the hamburger overrides
to a single rule.

### C. Layout consistency across pages (P1)

**Observation.** Each page invents its own outer frame: Hero `margin: 0 10%`;
Commissions `padding: 100px` (top forced to 0); Projects `80px` gutter +
`min(1180px, …)` centered content; Experience `80px` gutter + `max-width:
960px` centered content; the nav and Contact footer both sit at `margin-left:
2.3%`. That's four distinct gutter values — the chrome (nav + footer) shares
one, the content pages use the others, and none align with each other.
Page-header treatments are *almost* identical (eyebrow label + light 2.4rem
title) on Commissions/Experience/Projects — a good pattern that isn't yet
formalized.

**HIG.** Layout: consistent, predictable margins and alignment make the
product feel cohesive.

**Recommendation.** Define one content frame (`--gutter` + a shared
`--content-max`, e.g. 1180px, centered) and apply to all routes. Extract the
eyebrow+title header into a single shared pattern/class so all section
headers are pixel-identical.

### D. Typography & legibility (P1)

**Observation.** Many informational elements are tiny *and* low-opacity:
uppercase tags at `0.6–0.62rem` (~9–10px) and labels/eyebrows at opacity
`0.35–0.5`. Over #0A0A0A, off-white at 0.4 opacity computes to ≈3.5:1 —
**below WCAG AA (4.5:1)** for normal text. The Outfit font is also rendered
thin (weight 300) in several spots.

**HIG.** Typography: respect minimum sizes (thin weights need to go *larger*);
Color: ensure sufficient contrast in dark mode; don't make text blend into the
background.

**Recommendation.** Floor informational text at **12px (`--text-label`)** and
opacity **0.6**; decorative-only uppercase eyebrows may stay small but should
rise to ≥0.55 opacity. Audit every `font-size < 0.75rem`. Keep the elegant
light display weights at large sizes only.

### E. Experience page — gradients vs. legibility (P1)

**Observation.** Cards wash a saturated brand gradient across the whole card at
`opacity: 0.25` (State Street blue `#2a5cdb`, Rhythmedia orange `#e05a3a`,
Koh Gen Do red `#cc2020`). Body bullets are `rgba(text,0.8)`. On the bright
half of each gradient, bullet contrast drops below comfortable reading, and
the heavy color fights the restrained monochrome used everywhere else on the
site (a visual-continuity break). The **"Resume ↗"** action is `opacity:0.4`
text with a `0.15` border — nearly invisible in the screenshot, despite being
one of the most important actions on the page.

**HIG.** Color: maintain legibility over colored backgrounds, prefer
monochromatic when content is dense, keep color use consistent; Layout: make
essential information (Resume) easy to find.

**Recommendation.** Keep the brand identity via the **logo tile**, but tone the
full-card gradient down (≈0.10–0.12) or convert it to a corner/edge glow, and
add a subtle dark scrim behind the text column so bullets always clear 4.5:1.
Promote **Resume** to a clearly visible secondary button (raise text/border
opacity, or make it the one accent action).

### F. Projects page — touch + artwork (P0 touch / P1 artwork)

**Observation.**
- **Descriptions are hover-only.** On touch devices the description overlay
  never appears, so mobile users see *only* the project title — the
  positioning text is unreachable.
- **Artwork is inconsistent and sometimes looks broken.** The cards are a
  fixed 280px tall with `object-fit:cover`; wide desktop screenshots (Lyrical
  Miracle) crop to a near-empty dark band, and the `airy` GIF renders as a
  large blank card. Important content gets cropped out.

**HIG.** Layout: progressive disclosure must be discoverable and not hide
essential info; scale artwork so important content stays visible.

**Recommendation.** Make title **and** a one-line description **always
visible** in a bottom gradient scrim (hover/focus can deepen it), so the
content works identically on touch and pointer. Standardize artwork: either a
consistent capture aspect ratio or a letterbox-with-padding treatment so no
card looks empty; give the `airy` GIF a framed/contained treatment.

### G. Contact / footer (P2)

**Observation.** `margin-left: 2.3%` magic alignment; dead CSS
(`justify-content: space-evenly` on a non-flex block does nothing); the
home-only fade-on-overlap behavior is a fragile JS scroll listener in
`App.jsx` that flips `#contact *` to `transparent`. Lots of mobile
`!important`.

**HIG.** Layout consistency; macOS guidance even warns against putting key
info at the very bottom edge.

**Recommendation.** Align the footer to the shared `--gutter`; delete dead
properties; reconsider whether the transparency-fade is worth its complexity
(a simple solid footer that participates in normal flow is more robust).

### H. Global housekeeping (P2)

**Observation.** `index.css` carries heavy `!important` and duplicated mobile
hacks; breakpoints are inconsistent across files (**480 / 760 / 852 / 900 /
1100** px); scrollbars are globally hidden (hurts the discoverability of
scrollable content); editor `.tmp` files and unused components
(`Projects` v1, `Experience` v1, `CommissionsPortfolio`,
`CommissionsPortfolio2` vs `Commissions`) sit in the source tree; the initial
`App` fade is a slow 2s.

**Recommendation.** Standardize a breakpoint set (e.g. **600 / 900 / 1200**)
as tokens; reduce `!important`; remove `.tmp` artifacts and dead components;
shorten the initial fade. Consider a slim, styled scrollbar rather than hiding
it entirely.

---

## Proposed tokens (concrete starting values)

```css
:root {
  /* spacing — 8pt rhythm */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px;
  --space-20: 80px; --space-24: 96px;

  /* layout frame */
  --gutter: clamp(24px, 6vw, 80px);
  --content-max: 1180px;

  /* type scale */
  --text-display: 4.5rem; --text-h1: 2.4rem; --text-h2: 1.3rem;
  --text-body: 1.0625rem; --text-small: 0.9375rem; --text-label: 0.75rem;

  /* weight */
  --weight-light: 300; --weight-regular: 400; --weight-medium: 500;

  /* ink (text opacity steps over --color-bg) */
  --ink-1: 0.92; --ink-2: 0.72; --ink-3: 0.6;   /* 0.6 = min informational */

  /* radius */
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;

  /* one accent (optional) — reserved for primary action + links */
  --accent: #3eb4d4;

  /* breakpoints (reference) — 600 / 900 / 1200 */
}
```

---

## Sequenced roadmap

1. **Foundations (A, H-tokens).** Add tokens; pick the monochrome-plus-one-
   accent decision. Nothing else can be made consistent until these exist.
2. **P0 defects (B-bug, F-touch).** Fix the navbar overflow on home; make
   Projects descriptions visible on touch.
3. **Consistency pass (B-gutter, C).** One frame + one shared section header
   across all routes.
4. **Legibility pass (D, E).** Raise small/low-contrast text to the floor;
   tone Experience gradients and promote Resume.
5. **Artwork + polish (F-artwork, G).** Normalize project artwork; tidy the
   footer.
6. **Housekeeping (H).** Standardize breakpoints, prune dead files/CSS, trim
   `!important`, shorten initial fade.

---

## Acceptance criteria (how we'll know it worked)

- No nav element clips on any route; logo and page content share one gutter
  line on desktop and mobile.
- Every informational text element ≥ 12px and ≥ 0.6 ink (0.6 ink computes to
  ≈6.5:1 on #0A0A0A, comfortably clearing WCAG AA).
- Project title **and** description are visible without hover on a 390px
  touch viewport.
- Experience bullets clear 4.5:1 over the brightest part of every gradient;
  Resume is obviously tappable.
- Spacing values on all pages resolve to the `--space-*` scale; radii resolve
  to the `--radius-*` scale.
- Re-run the Playwright screenshot pass at 1440 and 390 and confirm visually.

---

## Out of scope / guardrails

- This is a **visual/UX/CSS-architecture** refinement — no new pages or
  features, no copy rewrites, no framework changes.
- **Preserve the minimalist character.** Don't add ornament; the accent color,
  if adopted, stays on primary action + links only.
- The Experience gradients are a deliberate brand choice — the plan **tones**
  them for legibility rather than removing them.

## Review iterations (how this plan was sharpened)

- **Pass 1 — inventory:** raw catalog of every issue across the four routes and
  the global CSS.
- **Pass 2 — group + map + prioritize:** collapsed findings into themes A–H,
  tied each to a specific HIG principle, and assigned P0/P1/P2.
- **Pass 3 — scope + sequence + de-risk:** reframed the effort as *refinement,
  not redesign*; ordered the work so tokens come first; added concrete token
  values, acceptance criteria, and guardrails to protect the existing
  aesthetic.
