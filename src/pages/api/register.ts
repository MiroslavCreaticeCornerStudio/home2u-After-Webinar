// On-demand endpoint (runs as a Vercel serverless function) — NOT prerendered.
// Captures the registration lead into Brevo (a contact list) and forwards it to
// the Skyguru CRM (best-effort). The rest of the site stays static.
export const prerender = false;

import type { APIRoute } from "astro";
// Adapter-agnostic runtime secrets (reads `.env` in dev, Vercel env vars in prod).
import { getSecret } from "astro:env/server";
import { sendSkyguruLead } from "../../lib/skyguru";

const BREVO_CONTACTS_URL = "https://api.brevo.com/v3/contacts";

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = getSecret("BREVO_API_KEY")?.trim();
  const listId = Number(getSecret("BREVO_LIST_ID") ?? 4);

  if (!apiKey) {
    console.error("BREVO_API_KEY is not set");
    return json({ ok: false, error: "Регистрацията е временно недостъпна." }, 500);
  }

  // Accept JSON or classic form-encoded submissions (no-JS fallback).
  let body: Record<string, any> = {};
  try {
    const ct = request.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      body = await request.json();
    } else {
      const fd = await request.formData();
      fd.forEach((v, k) => (body[k] = v));
    }
  } catch {
    return json({ ok: false, error: "Невалидна заявка." }, 400);
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const consent =
    body.consent === true || body.consent === "on" || body.consent === "true";

  if (!name || !phone || !isEmail(email) || !consent) {
    return json({ ok: false, error: "Моля, попълни всички задължителни полета." }, 422);
  }

  // Ad attribution (fbclid / fbc / fbp / UTMs) → Brevo contact attributes, for
  // Facebook offline conversion tracking. Mapped to attributes in this Brevo account.
  const attribution = (body.attribution ?? {}) as Record<string, unknown>;
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
  const trackingAttributes: Record<string, string> = {};
  for (const [src, dest] of Object.entries(ATTR_MAP)) {
    const value = attribution[src];
    if (typeof value === "string" && value.trim()) {
      trackingAttributes[dest] = value.trim().slice(0, 255);
    }
  }

  // Forward the full lead to the Skyguru CRM — best-effort, concurrent with Brevo,
  // never throws, success stays gated on Brevo (the primary capture).
  const nameParts = name.split(/\s+/).filter(Boolean);
  const skyguruDone = sendSkyguruLead({
    name,
    firstName: nameParts[0] ?? name,
    lastName: nameParts.slice(1).join(" ") || undefined,
    email,
    phone,
    consent,
    attribution,
  });

  const createContact = (attributes: Record<string, string>) =>
    fetch(BREVO_CONTACTS_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email,
        attributes,
        listIds: [listId],
        updateEnabled: true, // re-registration upserts the contact instead of erroring
      }),
    });

  const ok = (res: Response) => res.ok || res.status === 201 || res.status === 204;

  try {
    // Richest payload first; fall back so a missing attribute in this Brevo
    // account never costs us the lead.
    const base = { FIRSTNAME: name, TELEFON: phone };
    const attempts = [
      { ...base, ...trackingAttributes },
      { ...base },
      { FIRSTNAME: name },
    ];
    let res: Response | null = null;
    for (const attrs of attempts) {
      res = await createContact(attrs);
      if (ok(res)) {
        await skyguruDone; // ensure the CRM POST completes before the function freezes
        return json({ ok: true });
      }
      const errBody = (await res.clone().json().catch(() => ({}))) as Record<string, unknown>;
      if (errBody.code === "duplicate_parameter") {
        await skyguruDone;
        return json({ ok: true });
      }
    }
    await skyguruDone;
    console.error("Brevo error", res?.status, res ? await res.text() : "no response");
    return json({ ok: false, error: "Възникна грешка. Моля, опитай отново." }, 502);
  } catch (err) {
    await skyguruDone; // best-effort; never throws
    console.error("Brevo request failed", err);
    return json({ ok: false, error: "Възникна грешка при свързване. Опитай отново." }, 502);
  }
};

// Politely reject other methods.
export const GET: APIRoute = () => json({ ok: false, error: "method_not_allowed" }, 405);
