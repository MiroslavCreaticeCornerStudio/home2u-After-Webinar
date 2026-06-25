# Image Manifest — Home2U Webinar Landing

All assets downloaded from Figma (`zC2fj9ygaCKgnemwpd4Bln`) to `public/assets/images/`, served at `/assets/images/<file>`. 56 files, all download status **OK**, no failures, no placeholders. Raster photos verified >5KB.

## Raster photos
| File | Type | Size | Used in | Description |
|------|------|------|---------|-------------|
| `finalcta-background.png` | PNG 1920×1083 | 2.2 MB ⚠ | Final CTA | Background photo behind the registration form. ⚠ Large — optimize to JPG/WebP for production. |
| `speaker-ralica-tsenova.png` | PNG 683×1024 | 333 KB | Speaker | Portrait of Ралица Ценова (object-fit cover, cropped to 626×602 block). |
| `whyjoin-chart.png` | PNG 531×453 | 55 KB | Why join | Home2U analytics chart mockup (bar chart + crimson trend line + logo). |

## Logos
| File | Type | Size | Used in |
|------|------|------|---------|
| `logo-home2u-text.svg` / `logo-home2u-icon.svg` | SVG | 3.4K / 2.6K | Hero nav |
| `footer-logo-text.svg` / `footer-logo-icon.svg` | SVG | 3.5K / 2.6K | Footer |

## Icons (SVG, crimson `#A90831` fills baked in)
| File | Section |
|------|---------|
| `icon-calendar.svg`, `icon-clock.svg`, `icon-mappin.svg`, `icon-user.svg` | Hero info bar (date/time/location/lecturer) |
| `icon-chart-line-up.svg`, `icon-user-check.svg`, `icon-trend-up.svg`, `icon-user-circle.svg`, `icon-list-checks.svg`, `icon-users-three.svg` | Target audience (6 rows) |
| `icon-why-system.svg`, `icon-why-confidence.svg`, `icon-why-market.svg`, `icon-why-longterm.svg`, `icon-why-foundation.svg`, `icon-why-trust.svg` | Why join (6 bullets) |
| `icon-included-psychology/principles/stages/flow/seller/buyer/trust/admin/retention.svg` (9) | What's included (program cards) |
| `benefits-icon-broker/trophy/certificate/handshake.svg` | Benefits (4 columns) |
| `icon-timer.svg` | Pricing (remaining tickets) |
| `icon-finalcta-date.svg`, `icon-finalcta-time.svg`, `icon-finalcta-location.svg` | Final CTA details |
| `icon-phone.svg`, `icon-email.svg` | Footer contacts |
| `faq-arrow.svg` | FAQ chevron (also inlined in component) |

## Decorative shapes / lines (SVG)
| File | Section | Notes |
|------|---------|-------|
| `targetaudience-bg-blur.svg` | Target audience | Blurred ellipse/grid behind content (clipped by `overflow:hidden`) |
| `whyjoin-shapes.svg` | Why join | Blurred grid behind chart |
| `speaker-shape-grid.svg`, `speaker-shape-ellipse-1.svg`, `speaker-shape-ellipse-2.svg` | Speaker | Decorative shapes behind portrait |
| `pricing-shape-left.svg`, `pricing-shape-right.svg` | Pricing | Decorative grid graphics |
| `pricing-arrow-curve.svg`, `pricing-tag-tip.svg`, `pricing-tag-tip-small.svg` | Pricing | "Ранно записване" price-tag shapes |
| `benefits-divider.svg` | Benefits | Available, but dividers rendered via CSS |
| `included-accent-line.svg`, `pricing-accent-line.svg` | — | Available; accent lines rendered via `.accent-line` utility |
