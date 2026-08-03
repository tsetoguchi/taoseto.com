# Portfolio Website — Technical Overview

## Architecture

**Stack:** React 18 + Vite, CSS Modules, React Router v7, React Bootstrap, AWS (S3 + CloudFront + Lambda + API Gateway)

**Routing (App.jsx):**

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Hero | Landing page |
| `/commissions` | Commissions | Service tiers + contact form + audio portfolio |
| `/experience` | ExperienceV2 | Card-based work history |
| `/experience/v1` | Experience | Legacy timeline layout |
| `/projects` | ProjectsV2 | Stacked image cards |
| `/projects/v1` | Projects | Legacy 3-column grid |

App.jsx also manages a scroll-based footer fade effect — when page content overlaps the fixed Contact footer, a CSS class fades it out over 50px.

---

## Design System (vars.css + index.css)

- **Colors:** Dark theme (`#0A0A0A` bg, `#F5F5F5` text), with RGB variants for alpha transparency (e.g. `rgba(var(--color-text-rgb), 0.4)`)
- **Typography:** Outfit (primary), Roboto (secondary). Uppercase labels use wide letter-spacing (`0.1em–0.22em`)
- **Opacity scale:** Primary text at 1.0, secondary 0.8, tertiary 0.4–0.55, borders 0.06–0.15
- **Global resets:** Hidden scrollbars, smooth scroll, iOS 100dvh fix, custom Bootstrap hamburger icon override

---

## Components

### Navbar

**File:** `src/components/Navbar/`

- React Bootstrap `<Navbar>` with responsive collapse at 852px
- Left: "tao seto" brand link. Right: Commissions, Experience, Projects + GitHub/LinkedIn/Spotify icons (FontAwesome)
- Mobile: custom white SVG hamburger icon, dropdown with gradient background, `cubic-bezier` collapse animation
- Controlled `expanded` state — clicking any link closes the menu via `handleNavClick`

### Hero (Landing Page)

**File:** `src/components/Hero/`

- Two-column flexbox: text content (left) + animated hero image (right)
- **Eyebrow → Heading → Description → CTA buttons** layout pattern
- Hero image has two layered CSS animations:
  - `floating`: `translateY` oscillation over 5s (subtle vertical bob)
  - `glowPulse`: `drop-shadow` pulsing from 8px→22px blur (glow effect)
- Two absolute-positioned **blur orbs** in the background (`filter: blur(100px)`) create ambient lighting
- Image wraps in an `<a>` tag linking to kon.ac, opacity 0.7→1.0 on hover
- Mobile: stacks vertically (content on top, image centered below), image sized to 70%, vertically centered with `margin: auto`

### Commissions

**File:** `src/components/Commissions/`

Three sub-sections in a single page:

1. **CommissionsPortfolio2** — Gallery grid of audio work samples (5→4→3→2 columns as viewport shrinks). Static cards with cover art, title, artist, service badge.

2. **Service Tiers** — 2-column CSS Grid of clickable tier cards (Mixing, Mastering, Mixing & Mastering, Other). Each card has:
   - Left accent bar (2px `::before` pseudo-element) that highlights on selection
   - Hover: border lightens + faint background fill
   - Selected state syncs with the form's service dropdown

3. **Contact Form** — Minimalist field design (transparent inputs, bottom borders only, focus-within label highlight). Fields: name, email, service (synced dropdown), message. Client-side validation (email regex, required fields). Submits to `/api/contact`, shows success/error messages with 5s auto-dismiss.

**CommissionsPortfolio (v1)** — Interactive audio player with before/after toggle, custom scrubber bar with click-to-seek, time display, play/pause SVG controls. Uses `useRef` for `<audio>` elements and `requestAnimationFrame`-style updates.

### ExperienceV2 (Current)

**File:** `src/components/ExperienceV2/`

- Vertical stack of company cards, each with a **brand gradient overlay** (e.g. Rhythmedia: `#3d1510→#e05a3a` at 25% opacity)
- Card layout: logo (80x80 in rounded container) + period on left, company name + role + bullet points on right
- Each card is an `<a>` tag to the company website
- Logo imports use a `getLogo()` helper that dynamically imports from `assets/logos/`
- Hover: border and background lighten

### Experience v1 (Legacy)

**File:** `src/components/Experience/`

- Timeline layout using CSS Grid: 24px marker column (dot + vertical line) + content column
- Dots are 7px circles; lines are 1px dividers filling remaining height
- Resume PDF download link at the bottom

### ProjectsV2 (Current)

**File:** `src/components/ProjectsV2/`

- Full-width stacked cards (280px height, 220px on mobile)
- Image fills card via `position: absolute; inset: 0; object-fit: cover`
- **Default state:** gradient label at bottom with project name (fades out on hover)
- **Hover state:** image darkens (`brightness(0.35)`) and scales to 1.03x, overlay with title + description fades in
- Smooth 0.3s opacity + 0.4s transform transitions
- Projects: airy (oscilloscope plugin), Currently VST (timecode plugin), Valolytics (VALORANT dashboard), The Slushie Machine (audio processor)

### Projects v1 (Legacy)

**File:** `src/components/Projects/`

- 3-column responsive grid with 16:9 aspect ratio images
- Card hover: `translateY(-4px)` lift + border highlight + box-shadow

### Contact (Footer)

**File:** `src/components/Contact/`

- Fixed-position footer with email link (tao@taoseto.com) + FontAwesome envelope icon
- App.jsx applies a `.is-faded` class based on scroll overlap, which transitions color to transparent
- Mobile: fixed bottom, full-width, centered text

---

## Backend

### Lambda Functions (`lambda_functions/`)

**resend_backend.cjs** exports three handlers:

| Handler | Endpoint | Purpose |
|---------|----------|---------|
| `handler` | `POST /api/contact` | Validates form data, sends HTML email via Resend API (from `noreply@taoseto.com` to `commissions@taoseto.com`, reply-to set to client email) |
| `healthHandler` | `GET /api/health` | Returns status + whether Resend API key is configured |
| `testEmailHandler` | `GET /api/test` | Sends a test email to verify Resend integration |

All responses include CORS headers (`Access-Control-Allow-Origin: *`).

### Local Server (`server.cjs`)

Express.js wrapper that adapts the Lambda handlers for local development. Loads `.env` via dotenv, runs on port 5000. Handles CORS preflight.

### API Config (`src/config.js`)

Resolves endpoints dynamically: checks `window.API_CONFIG` (injected by deploy script) first, falls back to `localhost:5000` in development.

---

## AWS Deployment

**Infrastructure (CloudFormation):**

```
User → CloudFront (CDN + HTTPS + security headers)
         ├── S3 Bucket (static React build)
         └── API Gateway
               ├── POST /api/contact → Lambda (contact form → Resend email)
               └── GET  /api/health  → Lambda (health check)
```

**Deploy script (`aws-deployment/deploy.sh`):**
1. Validates AWS CLI + auth
2. Loads Resend API key from `config.env`
3. `npm run build` (Vite production build)
4. Deploys/updates CloudFormation stack
5. Syncs `dist/` to S3 (HTML with no-cache, assets with 1-year cache)
6. Packages and deploys Lambda functions (uses PowerShell `Compress-Archive` on Windows)
7. Generates `api-config.js` with production API Gateway URLs
8. Outputs CloudFront domain + API endpoints

---

## Key Patterns

- **CSS Modules** for component-scoped styles — no class name collisions
- **CSS Variables** for theming — all colors/fonts defined in `vars.css`, referenced everywhere via `var()`
- **Responsive design** with primary breakpoint at 852px, secondary at 760px/900px/480px
- **Controlled components** for form state in Commissions (tier selection syncs with dropdown)
- **React Helmet Async** for per-page `<title>` and Open Graph meta tags (SEO)
- **Dynamic imports** for company logos via helper function
- **Animations** via CSS `@keyframes` (floating, glowPulse, fadeIn) — no JS animation libraries
- **Serverless architecture** — no persistent server in production; Lambda handles API requests on demand
