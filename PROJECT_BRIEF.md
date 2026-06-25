# Project Brief — Home2U Webinar Landing Page

Auto-generated from Figma (Phase 0). Source of truth: Figma file `zC2fj9ygaCKgnemwpd4Bln`, frame `course-web` (node `2856:182`).

## Project

- **Name:** Home2U — Уебинар „Как да правим сделки за милиони от брокерство"
- **Type:** Single-page marketing / webinar registration landing page
- **Language:** Bulgarian (`bg`)
- **Lecturer:** Ралица Ценова
- **Frame width:** 1440px → `--size-container-ideal: 1440`, `--size-container-max: 1440px`
- **Side padding:** 80px → `--container-padding: 5em` (desktop)

## Brand Colors (Figma variables)

| Token | Hex | Use |
|-------|-----|-----|
| `--color-primary` / `--color-accent` | `#A90831` | Crimson — headings accents, CTAs, lines |
| `--color-primary-dark` | `#880425` | Gradient start / pressed |
| `--color-text-primary` | `#1C1C1C` | Headlines |
| `--color-text-secondary` | `#4F4F4F` | Body text |
| `--color-text-inactive` | `#909090` | Inactive |
| `--color-border` | `#E1E1E1` | Light grey borders |
| `--color-bg-white` | `#FFFFFF` | Default background |
| `--color-bg-light` | `#F9F9F9` | Neutrals/5 section bg |
| `--color-bg-card` | `#F4F4F4` | Info / icon cards |
| `--color-bg-dark` | `#1A0207` | Dark maroon sections (pricing/footer — refined per section) |
| CTA gradient | `linear-gradient(270deg,#A90931,#880425)` | Primary buttons |
| CTA shadow | `0 15px 15px rgba(169,8,49,0.19)` | Primary button glow |

## Typography

- **Brand font:** `Sharp Grotesk Cyr` — *Medium* (500) and *Book* (400). Commercial; not bundled.
- **Substitute (in use):** **Manrope** (Google Fonts, full Cyrillic). Font stack lists the brand font first so dropping licensed `woff2` files + an `@font-face` block into `public/assets/fonts/` activates it with no code change.
- Weights used: 400 (Book/body), 500 (Medium/headings, nav, labels), heavier display weights for hero.
- Common sizes (px → em @16): nav 14→0.875, body 18→1.125, labels 14→0.875, values 16→1, section titles ~40→2.5, hero display 80–88px.

## Border radius

- 12px (`--radius-sm`) info cards · 16px (`--radius-md`) · 25px (`--radius-lg`) hero glass card · 33px (`--radius-btn`) primary CTA · 48px (`--radius-pill`) nav pill.

## Special elements / patterns

- Short 40px crimson "eyebrow" rule above section titles (`.accent-line`).
- Glassmorphism card in hero (backdrop blur, white translucent gradient border).
- Decorative blurred ellipse "shapes" behind images (target-audience, why-join, speaker, pricing).
- FAQ accordion (expand/collapse — interaction implied by arrow icons).
- Pricing cards (Individual + Package) on dark maroon background.
- Contact form (name / phone / email / consent) over a photo background in the final CTA.

## Breakpoints (fluid scaling system)

Desktop 992px+ (ideal 1440) · Tablet ≤991px (ideal 834, pad 1.5em) · Mobile L ≤767px (ideal 550, pad 1em) · Mobile P ≤479px (ideal 390).

## Notes / decisions

- Form has UI only in Figma; submission handler is left as a clearly-marked TODO (no backend in scope).
- `astro.config.mjs` `site` is a placeholder (`https://www.home2u.bg`) — update before deploy.
