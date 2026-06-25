// Skyguru CRM lead ingestion (Home2U).
// Public endpoint (no auth) — only `phone` is required; all other fields are
// accepted and optional. Best-effort: a failure here must NEVER block the Brevo
// lead capture or the user's success response. Never throws.
import { getSecret } from "astro:env/server";

const DEFAULT_SKYGURU_LEADS_URL = "https://skyguru.ai/api/v1/public/leads";

// Identifies this specific landing page / campaign inside the shared CRM + Brevo.
export const FORM_NAME = "Как да правим сделки за милиони";

export interface SkyguruLead {
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone: string;
  consent?: boolean;
  /** Raw ad-attribution / tracking object captured client-side (fbclid, utm_*, …). */
  attribution?: Record<string, unknown>;
}

const trim = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim() : undefined;

export async function sendSkyguruLead(lead: SkyguruLead): Promise<boolean> {
  const endpoint = getSecret("CRM_ENDPOINT")?.trim() || DEFAULT_SKYGURU_LEADS_URL;
  const apiKey = getSecret("SKYGURU_API_KEY")?.trim();
  const attr = lead.attribution ?? {};

  const payload: Record<string, unknown> = {
    name: lead.name,
    first_name: lead.firstName,
    last_name: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    consent: lead.consent,
    // `form` feeds Skyguru's native "Форма" field; `form_name` kept as a custom-field fallback.
    form: FORM_NAME,
    form_name: FORM_NAME,
    source: "home2u-after-webinar-ralica",
    webinar: "Сделки за милиони",
    // ad attribution / tracking
    fbclid: trim(attr.fbclid),
    fbc: trim(attr.fbc),
    fbp: trim(attr.fbp),
    utm_source: trim(attr.utm_source),
    utm_medium: trim(attr.utm_medium),
    utm_campaign: trim(attr.utm_campaign),
    utm_term: trim(attr.utm_term),
    utm_content: trim(attr.utm_content),
    landing_page: trim(attr.landing_page),
    referrer: trim(attr.referrer),
    captured_at: trim(attr.captured_at),
  };

  // Drop empty values so we don't send a wall of nulls.
  for (const key of Object.keys(payload)) {
    const value = payload[key];
    if (value === undefined || value === null || value === "") delete payload[key];
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("Skyguru lead failed", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("Skyguru lead threw", err);
    return false;
  }
}
