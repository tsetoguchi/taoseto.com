# HCI / Frontend Audit — Action List

Audited 2026-09-12 against source, local dev build, and live `taoseto.com`.
Checked at 1440×900 (desktop) and 390×844 (mobile).

**Baseline:** All text/background pairs pass WCAG AA contrast — the `--ink-1/2/3`
opacity system holds up. Type scale, spacing rhythm, and card layouts are
consistent. The gaps below are operability, not visual design.

---

## P0 — Production-breaking  ✅ shipped on branch `hci-audit`

- [x] **Add a catch-all `404` route.** `src/App.jsx` — `<Routes>` has no `path="*"`,
      so any unknown URL renders the navbar over a blank black page.
      Verified live at `taoseto.com/about`. A typo, a stale link on an old resume,
      or a mis-pasted URL reads as a dead site.
- [x] **Allow `data:` in the CSP `font-src` directive.** Current header is
      `font-src 'self'`; runtime-injected data-URI fonts are blocked, throwing
      2 console errors on every production page load. Fix in the CloudFront /
      S3 header config under `aws-deployment/`.
- [x] **Add `og:image` + switch to `twitter:card: summary_large_image`.**
      `index.html:16-26` has title/description/url but no image, so the site
      renders as a bare text stub when shared in Slack or LinkedIn.

## P1 — Keyboard & screen reader (WCAG Level A failures)

- [ ] **Make commission tier cards real buttons.**
      `src/components/Commissions/Commissions.jsx:148` — `<div onClick>` with
      `cursor: pointer`, no `tabIndex`, no `role`, no `aria-pressed`. Not in the
      tab order at all; keyboard users cannot select a service.
      → `<button type="button" aria-pressed={isSelected}>`.
- [ ] **Fix the contact email link.** `src/components/Contact/Contact.jsx:9-12` —
      the anchor wraps only the `aria-hidden` envelope icon, and the visible
      `tao@taoseto.com` text sits outside it. Screen readers announce an
      unlabeled link; sighted users click the address and nothing happens.
      → Wrap the text in the anchor. Also sizes the tap target correctly
      (currently 15×22.5px; WCAG 2.5.8 wants ≥24×24).
- [ ] **Restore the hamburger focus ring.**
      `src/components/Navbar/Navbar.module.css:90` — `outline: none !important`.
- [ ] **Restore the hero image link focus ring.**
      `src/components/Hero/Hero.module.css:106` — `display: contents` leaves no
      box for an outline to paint on. Confirmed `outline-style: none` on focus.
- [ ] **Add `aria-expanded` to the mobile menu toggle.**
      `src/components/Navbar/Navbar.jsx` — attribute is absent in production even
      with the menu open (`collapse show`, 324px tall). No open/closed state is
      announced. Also add Escape-to-close and focus return.
- [ ] **Stop wrapping whole Experience cards in one `<a>`.**
      `src/components/ExperienceV2/ExperienceV2.jsx` — measured accessible names:
      Konac 633 chars, Rhythmedia 820, State Street 673, Koh Gen Do 549.
      → Link the company *name* only (see P2 item on click-away).
- [ ] **Announce form results.** `src/components/Commissions/Commissions.jsx` —
      zero `aria-live` / `role="alert"` regions on the page; success and error
      text appears silently.
- [ ] **Add a `<main>` landmark and a skip link.** Neither exists on any page;
      7 nav stops precede content on every route.

## P2 — Hiring-manager journey

- [ ] **Decide on the resume button.**
      `src/components/ExperienceV2/ExperienceV2.module.css:53` sets
      `display: none`, but the PDF still ships at 130KB. Right now a hiring
      manager has no way to take anything away.
      → Either un-hide it, or drop the import from the build.
- [ ] **Stop Experience cards navigating away on any click.** The whole card
      links to the company homepage, so clicking to select a metric — or
      tapping to scroll on mobile — sends the visitor to statestreet.com.
- [ ] **Reduce inquiry-form friction.** `Commissions.jsx`:
  - [ ] Add `autocomplete="name"` / `autocomplete="email"` (no autofill today).
  - [ ] Native `required` fires before `validateForm()`, so the custom messages
        are unreachable — pick one validation path.
  - [ ] Move errors to field level with `aria-invalid`; focus the first bad field.
  - [ ] Drop the 5s auto-dismiss on messages (can vanish mid-read).
- [ ] **Restore scrollbars.** `src/index.css:5-9` hides them globally
      (`scrollbar-width: none` + `::-webkit-scrollbar { display: none }`).
      The Experience page is 1804px tall with no signal there's more below.

## P3 — Polish & performance

- [ ] **Drop Bootstrap.** 232KB of the 268KB CSS bundle (86%), carried for
      essentially one navbar collapse. Biggest perf win available.
- [ ] **Remove the unused Roboto font.** `src/main.jsx` imports
      `@fontsource/roboto` and 16 font files ship; `--font-roboto`
      (`src/vars.css:19`) is referenced nowhere.
- [ ] **Raise the secondary CTA border contrast.** Measured 1.71:1 against the
      background; WCAG 1.4.11 wants 3:1. "Experience" barely reads as a button
      beside the filled primary. `src/components/Hero/Hero.module.css`
- [ ] **Add `prefers-reduced-motion` handling.** None in own CSS — the 33 blocks
      present all come from Bootstrap. The hero logo floats infinitely.
- [ ] **Define `--space-5` or replace it.** Used at
      `src/components/Commissions/CommissionsPortfolio2.module.css:14`,
      never declared in `vars.css` — the margin silently computes to 0.
- [ ] **Resolve the "Selected work" affordance.** Cover art under an `/audio/`
      path with no playback sets an expectation the section doesn't meet.

---

## Note on the Experience page

Keep it. For a hiring-manager audience it's the most important page on the site —
Projects shows what gets built for fun; Experience carries NCS, Spotify editorial
numbers, a $4T custodian bank, and TikTok reach. The problem is the interaction,
not the page: its best content is trapped in link-wrapped cards that fire the
visitor to a third party on any click, and the resume that should be its takeaway
is `display: none`. Fixing those two makes it the strongest page.

## Suggested order

P0 items 1–2 and P1 items 1–2 are the ones that actively cost a visitor.
P0 item 3 and P2 item 1 are the cheapest wins for the hiring-manager audience.
The Bootstrap removal is the largest technical cleanup but affects nobody's
ability to use the site.
