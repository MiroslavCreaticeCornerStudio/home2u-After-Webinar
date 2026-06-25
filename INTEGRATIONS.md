# Form Integration — Brevo + Skyguru CRM

The registration form (Final CTA section) captures leads into **Brevo** (a contact
list) and forwards them to the **Skyguru CRM**, with Facebook/UTM attribution. On
success the visitor is sent to `/thank-you`.

This is a post-webinar **lead-capture** page — no Zoom registration (unlike the live
"Webinar - Ралица" project this was modelled on).

## Flow

```
FinalCta form ──POST JSON──▶ /api/register (server fn) ──▶ Brevo   (contact → list #4)
 (name, phone,                                          └──▶ Skyguru CRM (best-effort)
  email, consent,
  + attribution)        success ──▶ redirect to /thank-you
```

- Endpoint: [`src/pages/api/register.ts`](src/pages/api/register.ts) — `export const prerender = false`
  (Vercel serverless function; the rest of the site stays static via `@astrojs/vercel`).
- CRM forward: [`src/lib/skyguru.ts`](src/lib/skyguru.ts) — best-effort, never blocks the Brevo capture.
- Brevo write uses a tiered attribute fallback so a missing attribute never costs the lead.
- **Form name** (CRM `form`/`form_name`): `Как да правим сделки за милиони` (see `FORM_NAME` in `src/lib/skyguru.ts`).

## Environment variables

Set in `.env` locally (gitignored) and in the Vercel dashboard for production. See [`.env.example`](.env.example).

| Var | Required | Notes |
|-----|----------|-------|
| `BREVO_API_KEY` | yes | Brevo API key (Home2U account) |
| `BREVO_LIST_ID` | yes | Brevo list (default `4` — same as the live Ралица webinar; change to a dedicated list if you want these leads separated) |
| `CRM_ENDPOINT` | no | Defaults to `https://skyguru.ai/api/v1/public/leads` |
| `SKYGURU_API_KEY` | no | Bearer token for the CRM, only if it requires auth |

## Brevo contact fields written

| Brevo attribute | Source |
|---|---|
| `FIRSTNAME` | the name field |
| `TELEFON` | raw phone (text) |
| `FBCLID`, `FBC`, `FBP`, `UTM_SOURCE/MEDIUM/CAMPAIGN/TERM/CONTENT` | from the ad URL / Meta pixel cookies |
| `LANDING_PAGE`, `AD_TIMESTAMP` | landing URL + capture time |

Facebook/UTM params are captured on page load in `BaseLayout.astro` (→ `localStorage` key
`h2u_attribution`) and attached to the submission as `attribution`.

## Behaviour notes

- **Diagnosing failures**: check the function logs (Vercel → Deployments → Functions, or the
  local `astro dev` console) for `Brevo error` / `Skyguru lead failed` lines.
- **No-JS fallback**: the endpoint also accepts form-encoded posts.
- The success response is gated on **Brevo**; the Skyguru forward is best-effort.

## ⚠️ Security

`BREVO_API_KEY` is shared with the live Ралица webinar's Brevo account. Rotate it in Brevo
(SMTP & API → regenerate) and update `.env` + the Vercel env var if it has been exposed.
