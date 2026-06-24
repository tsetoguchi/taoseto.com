# Is taoseto.com "vibe-coded"? — A self-audit

Reference: **JCarterJohnson/vibecoded-design-tells** (findings distilled from ~3.2M
Reddit posts across 47 AI/SaaS subreddits). The repo catalogs the visual, prose,
and code "tells" that make a site recognizable-on-sight as AI-generated. Below I
check this portfolio against each tell, with file/line evidence.

> The Reddit thread itself was unreachable (network-security block on every route:
> browser, `.json`, WebFetch). Audit is based on the GitHub catalog the user
> supplied instead, plus Playwright screenshots of the running site (home,
> /projects, /experience).

**Verdict: mostly clean and clearly de-slopped on purpose — but guilty of a few.**
The palette is dark monochrome with a single restrained accent, hero text is solid
(not gradient), icons are real SVGs (not emoji), and there's no shadcn/Tailwind
default look. The site dodges the biggest tells. What it *is* guilty of is below.

---

## ⚠️ Guilty — visual design tells

### 1. Unprompted neon glow (ranked #4 in the catalog)
The hero image pulses a white drop-shadow glow on a loop, purely decorative.
- `src/components/Hero/Hero.module.css` — `@keyframes glowPulse` ramps
  `drop-shadow(0 0 8px rgba(255,255,255,.15))` → `0 0 22px rgba(255,255,255,.55)`
  and back, applied via `animation: floating 5s …, glowPulse 5s …` on `.heroImg`.
- This is exactly the "glow effect applied without a functional purpose" tell.
  The combined float + pulse is the kind of motion that reads as generated.

### 2. Aurora/mesh/blob background — present in CSS (now vestigial)
The classic blurred-orb background is fully defined:
- `Hero.module.css` `.topBlur` / `.bottomBlur`: 50–70vw radial blobs,
  `filter: blur(100px)`, `border-radius: 764px`, parked behind the hero.
- Caveat: `Hero.jsx` no longer renders these divs, so they're currently **dead
  CSS**. So it counts twice — the blob aesthetic was reached for (a listed tell),
  and the leftover rules are now boilerplate accumulation (a code tell, below).

### 3. Per-card diagonal gradients on the Experience page
Each experience card gets `linear-gradient(135deg, …)` tint.
- `ExperienceV2.jsx`: every entry carries a `gradient: [colorA, colorB]` pair
  injected as `background: linear-gradient(135deg, …)`.
- Not "AI purple" (the colors are brand-ish per company, which is defensible),
  but `135deg` two-stop gradients on a stack of cards is squarely in
  gradient-decoration territory and adds to the "all look the same" feeling.

### Partial / borderline
- **Centered-hero-plus-three-cards (catalog #6):** dodged on desktop — the hero is
  a left-aligned split layout — but it *collapses to centered* on mobile
  (`Hero.module.css` `@media (max-width: 900px)` → `align-items: center`). The
  "card stack of everything" pattern still drives /projects and /experience, which
  is the broader version of this cliché.

---

## ⚠️ Guilty — copywriting tells

### 4. "leverage" diction (a flagged vocabulary tell)
- `ExperienceV2.jsx`, Konac bullet: "…**leveraging** connections to create
  engaging content…". This is on the catalog's overused-vocabulary list.
- Resume-speak throughout leans on the same register: "garnered," "reflecting
  significant audience engagement and reach," "engaging content." Legit for a
  résumé, but it's the cadence the prose scanner flags.

### 5. Em dash as connector (a flagged punctuation tell)
- Hero eyebrow: `Tokyo — Music & Technology` (`Hero.jsx`).
- Meta descriptions: "Tao Seto **—** Tokyo-based audio engineer and CS graduate"
  (`Hero.jsx` Helmet). Mild, and arguably correct typography — but it is the
  single most-cited prose tell, so worth knowing it's there.

### Cleared (prose)
No "it's not just X, it's Y" cadence, no "delve," no "in conclusion" wrap-ups, no
sycophantic openers, no leftover assistant boilerplate. Copy is human and specific.

---

## ⚠️ Guilty — code tells

### 6. Narrating comments (describing the obvious)
- `src/App.jsx`: `// Add scroll listener` above `addEventListener("scroll", …)`,
  `// Cleanup function` above the `return`, `// Check initial state when page
  loads` above `handleScroll()`. These narrate what the next line plainly says —
  the catalog's "narrating comments" tell.

### 7. Boilerplate / dead-code accumulation
- **Versioned duplicates left in the tree:** `Experience` *and* `ExperienceV2`,
  `Projects` *and* `ProjectsV2`, plus `Commissions`, `CommissionsPortfolio`,
  `CommissionsPortfolio2`. Old versions are still routed (`/experience/v1`,
  `/projects/v1` in `App.jsx`) rather than deleted.
- **Editor temp files committed/lying around:** many
  `*.module.css.tmp.28748.*` / `*.jsx.tmp.*` files under `src/components/**`
  (Commissions, Experience, Hero, Navbar, Projects). These are exactly the
  "leftover artifacts" smell.
- **Dead CSS:** the `.topBlur` / `.bottomBlur` rules noted above.
- Minor: `import React from "react"` in `Hero.jsx` / `Contact.jsx` / `Navbar.jsx`
  is unnecessary under React 18 + the JSX transform — boilerplate carry-over.

### Cleared (code)
No emoji in code, no swallowed/empty `catch` blocks, no obvious hallucinated APIs,
no chat-artifact comments, no generic `data`/`temp`/`foo` placeholder variables.

---

## Cleared — the big visual tells the site avoids

| Catalog tell | Status | Why |
|---|---|---|
| shadcn/Tailwind default look (#1) | ✅ avoided | Bootstrap + hand-written CSS-module design tokens (`vars.css`), not a default component kit |
| "AI purple" gradient (#2) | ✅ avoided | Palette is `#0A0A0A` bg + `#D4B483` tan accent; zero purple |
| Gradient hero text (#3) | ✅ avoided | Hero `h1` is solid `--color-text`, light weight |
| Emoji-as-icons (#5) | ✅ avoided | FontAwesome SVGs (GitHub/LinkedIn/Spotify/envelope) |
| Bento grid / glassmorphism | ✅ avoided | Neither used |
| Cream-serif-sage "tasteful default" | ✅ avoided | Dark, sans (Outfit), not the new pastel default |

---

## Suggested cleanup (highest signal first)
1. **Delete the editor `*.tmp.*` files** under `src/components/**` and stop
   committing them (add to `.gitignore`).
2. **Remove the dead `.topBlur` / `.bottomBlur` CSS** in `Hero.module.css`, or
   commit to rendering them intentionally.
3. **Retire the V1 components and `/v1` routes** once V2 is settled — keep one
   version per page.
4. **Tone down or remove `glowPulse`** on the hero image (the float alone is
   plenty; the pulsing white halo is the most "generated"-looking element).
5. **Strip the narrating comments** in `App.jsx` and the unneeded
   `import React` lines.
6. Optional prose nit: swap "leveraging connections" for plainer wording.

*Net: this is a deliberately restrained, de-slopped site. The remaining tells are
a decorative glow, some gradient card tinting, and housekeeping debt — not the
load-bearing AI-look. Clean up the leftovers and it reads fully hand-made.*
