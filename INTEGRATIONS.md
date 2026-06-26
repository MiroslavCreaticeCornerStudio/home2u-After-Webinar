# Form Integration — Skyguru CRM + Brevo

The registration form (Final CTA section) sends each lead to **two** destinations
concurrently — the **Skyguru CRM** (source of truth) and a **Brevo** email list —
with Facebook/UTM attribution. On success the visitor is sent to `/course/thank-you`.

## Flow

```
                              ┌─▶ Skyguru CRM (skyguru.ai/api/v1/public/leads)
FinalCta form ──POST JSON──▶ /api/register ─┤
 (name, phone, email,        (server fn)    └─▶ Brevo list #10 (api.brevo.com/v3/contacts)
  consent, + attribution)
                             success (≥1 destination ok) ──▶ redirect to /course/thank-you
```

- Endpoint: [`src/pages/api/register.ts`](src/pages/api/register.ts) — `export const prerender = false`
  (Vercel serverless function; the rest of the site stays static). Both calls run
  concurrently via `Promise.all`; neither lib throws.
- CRM call: [`src/lib/skyguru.ts`](src/lib/skyguru.ts) — returns true on HTTP 2xx.
- Brevo call: [`src/lib/brevo.ts`](src/lib/brevo.ts) — returns true on 2xx (or an
  already-existing contact; `updateEnabled` updates instead of erroring).
- **Success gating**: the user gets `{ ok: true }` if **at least one** destination
  accepted the lead. Partial failures (one ok, one not) are logged but don't block
  the visitor. Only a double failure returns an error so the user can retry.

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

## Fields sent to Brevo

Contact upserted to **list #10** (`Обучение "Как да правим сделки за милиони"`) with `updateEnabled: true`.

| Brevo attribute | Source |
|---|---|
| `FIRSTNAME` | the full name field |
| `TELEFON` | phone |
| `FBCLID`, `FBC`, `FBP`, `UTM_SOURCE/MEDIUM/CAMPAIGN/TERM/CONTENT`, `LANDING_PAGE`, `AD_TIMESTAMP` | ad attribution |

The custom attributes already exist in this Brevo account (shared with the live webinar project).

## Environment variables

See [`.env.example`](.env.example). On Vercel set these in Project → Settings → Environment Variables.

| Var | Required | Notes |
|-----|----------|-------|
| `BREVO_API_KEY` | **yes** (for the Brevo sync) | Brevo v3 API key. Set on Vercel (Production + Development). |
| `BREVO_LIST_ID` | no | defaults to `10` |
| `CRM_ENDPOINT` | no | defaults to `https://skyguru.ai/api/v1/public/leads` |
| `SKYGURU_API_KEY` | no | bearer token, sent only if set |

## Behaviour notes

- **Diagnosing failures**: check the function logs (Vercel → Deployments → Functions, or the
  local `astro dev` console) for `Skyguru lead failed`, `Brevo contact failed`, or the
  partial-failure lines (`Lead saved to … but … failed`).
- **No-JS fallback**: the endpoint also accepts form-encoded posts.
- Verified live: a POST to `/course/api/register` returns `{ ok: true }`, the contact
  lands in Brevo list #10 with the right attributes, and the CRM accepts the lead.
