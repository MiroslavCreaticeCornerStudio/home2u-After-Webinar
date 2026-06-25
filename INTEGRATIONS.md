# Form Integration — Skyguru CRM

The registration form (Final CTA section) sends leads to the **Skyguru CRM**, with
Facebook/UTM attribution. On success the visitor is sent to `/course/thank-you`.

> Brevo was removed — the CRM is now the only lead destination.

## Flow

```
FinalCta form ──POST JSON──▶ /api/register (server fn) ──▶ Skyguru CRM
 (name, phone, email,                                       (skyguru.ai/api/v1/public/leads)
  consent, + attribution)    success ──▶ redirect to /course/thank-you
```

- Endpoint: [`src/pages/api/register.ts`](src/pages/api/register.ts) — `export const prerender = false`
  (Vercel serverless function; the rest of the site stays static).
- CRM call: [`src/lib/skyguru.ts`](src/lib/skyguru.ts) — returns true on HTTP 2xx, false otherwise.
  The user's success/error response is **gated on the CRM result** (a failed CRM write returns an error so the user can retry).

## Fields sent to the CRM

| Field | Source |
|---|---|
| `name`, `first_name`, `last_name` | the name field (split on first space) |
| `email`, `phone`, `consent` | the form |
| `form`, `form_name` | `Как да правим сделки за милиони` (`FORM_NAME` in `src/lib/skyguru.ts`) — `form` feeds the CRM's native "Форма" field; `form_name` is a custom-field fallback |
| `source` | `home2u-after-webinar-ralica` |
| `webinar` | `Сделки за милиони` |
| `fbclid`, `fbc`, `fbp`, `utm_source/medium/campaign/term/content`, `landing_page`, `referrer`, `captured_at` | ad attribution (captured in `BaseLayout.astro` → `localStorage` key `h2u_attribution`) |

Empty values are dropped before sending.

## Environment variables

None required — the Skyguru public endpoint needs no auth. Optional overrides
(see [`.env.example`](.env.example)):

| Var | Notes |
|-----|-------|
| `CRM_ENDPOINT` | defaults to `https://skyguru.ai/api/v1/public/leads` |
| `SKYGURU_API_KEY` | bearer token, sent only if set |

## Behaviour notes

- **Diagnosing failures**: check the function logs (Vercel → Deployments → Functions, or the
  local `astro dev` console) for `Skyguru lead failed` lines.
- **No-JS fallback**: the endpoint also accepts form-encoded posts.
- Verified: a direct POST to the CRM returns `HTTP 201 {"success":true}`.
