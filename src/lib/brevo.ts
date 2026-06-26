// Brevo contact ingestion — adds/updates the registrant on a Brevo list so the
// lead also flows into email marketing (alongside the Skyguru CRM). Returns true
// on success (contact created/updated, or already exists), false otherwise;
// never throws. Reads BREVO_API_KEY / BREVO_LIST_ID at runtime via getSecret.
import { getSecret } from "astro:env/server";

const BREVO_CONTACTS_URL = "https://api.brevo.com/v3/contacts";
const DEFAULT_LIST_ID = 10; // "Обучение „Как да правим сделки за милиони“"

export interface BrevoContact {
  name: string;
  phone: string;
  email: string;
  /** Raw ad-attribution / tracking object captured client-side (fbclid, utm_*, …). */
  attribution?: Record<string, unknown>;
}

// Brevo custom attributes (already defined in this account, shared with the
// live webinar project). FIRSTNAME is standard; the rest are custom.
const ATTR_MAP: Record<string, string> = {
  fbclid: "FBCLID",
  fbc: "FBC",
  fbp: "FBP",
  utm_source: "UTM_SOURCE",
  utm_medium: "UTM_MEDIUM",
  utm_campaign: "UTM_CAMPAIGN",
  utm_term: "UTM_TERM",
  utm_content: "UTM_CONTENT",
  landing_page: "LANDING_PAGE",
  captured_at: "AD_TIMESTAMP",
};

export async function sendBrevoContact(contact: BrevoContact): Promise<boolean> {
  const apiKey = getSecret("BREVO_API_KEY")?.trim();
  if (!apiKey) {
    console.error("BREVO_API_KEY is not set");
    return false;
  }
  const listId = Number(getSecret("BREVO_LIST_ID") ?? DEFAULT_LIST_ID) || DEFAULT_LIST_ID;

  const attributes: Record<string, string> = {
    FIRSTNAME: contact.name,
    TELEFON: contact.phone,
  };
  const attr = contact.attribution ?? {};
  for (const [src, dest] of Object.entries(ATTR_MAP)) {
    const value = attr[src];
    if (typeof value === "string" && value.trim()) {
      attributes[dest] = value.trim().slice(0, 255);
    }
  }

  try {
    const res = await fetch(BREVO_CONTACTS_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email: contact.email,
        attributes,
        listIds: [listId],
        updateEnabled: true, // re-registration updates the contact instead of erroring
      }),
    });

    // 201 created / 204 updated → success
    if (res.ok) return true;

    const errBody = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    // Already-existing contacts are fine (updateEnabled handles them, but guard anyway)
    if (errBody.code === "duplicate_parameter") return true;

    console.error("Brevo contact failed", res.status, errBody);
    return false;
  } catch (err) {
    console.error("Brevo request threw", err);
    return false;
  }
}
