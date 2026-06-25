# Site Map — Home2U Webinar Landing

**Figma File Key:** `zC2fj9ygaCKgnemwpd4Bln`
**Source URL:** `https://www.figma.com/design/zC2fj9ygaCKgnemwpd4Bln/Home2U-%7C-Web-Design?node-id=2856-182&m=dev`
**Container Max-Width:** `1440px`
**Page node:** `2856:182` (`course-web`)

## Page: Home (single page)

Sections top-to-bottom. Each is one Astro component in `src/components/`, composed in `src/pages/index.astro`.

| # | Section | Node ID | Component | Background | Notes |
|---|---------|---------|-----------|------------|-------|
| 1 | Hero (nav + hero + info bar) | `2856:184` | `Hero.astro` | light gradient | Nav bar, display headline "сделки за милиони", glass card CTA, 4 info cards (date/time/location/lecturer) |
| 2 | Target audience | `2856:251` | `TargetAudience.astro` | white + blurred shapes | "Webinar" eyebrow title + 6 info rows (icon + text) |
| 3 | Why join | `2856:291` | `WhyJoin.astro` | light card | Title + description + 6 bullets + chart/graph image w/ blurred shapes |
| 4 | What's included | `2856:349` | `WhatsIncluded.astro` | white | Title + description + grid of icon cards (program modules) + action CTA |
| 5 | Speaker | `2856:412` | `Speaker.astro` | white + shapes | "Коя е Ралица" photo + bio bullets |
| 6 | Benefits | `2856:439` | `Benefits.astro` | white | 4 stat/benefit columns with dividers |
| 7 | Pricing | `2856:469` | `Pricing.astro` | dark maroon + shapes | Individual €500 + Package €600 cards, promo, remaining tickets |
| 8 | FAQ | `2856:521` | `Faq.astro` | white | Accordion of Q&A |
| 9 | Final CTA | `2856:555` | `FinalCta.astro` | photo + gradient | Event details + remaining tickets + contact form |
| 10 | Footer | `2856:612` | `Footer.astro` | dark maroon | Logo, link columns, contact, legal links |

## Shared atoms / molecules

| Element | Where | Implementation |
|---------|-------|----------------|
| Primary gradient pill button | hero, what's-included, pricing, final CTA | `.btn .btn--primary` (global.css) |
| Outline pill button | nav | `.btn .btn--outline` |
| Accent line (40px crimson rule) | most section eyebrows | `.accent-line` |
| Info/icon cards | hero info bar, target audience, benefits | per-component |
| Decorative blurred shapes | sections 2,3,5,7 | inline SVG / absolutely-positioned ellipses |

## Assets

Downloaded to `public/assets/images/`. Tracked in `IMAGE_MANIFEST.md`. Icons exported as SVG; photos (speaker, CTA bg, chart) as PNG. Asset URLs are fetched per-section from `get_design_context` at build time (Figma URLs expire in 7 days).
