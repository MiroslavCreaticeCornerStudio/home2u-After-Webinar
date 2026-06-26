// On-demand endpoint (runs as a Vercel serverless function) — NOT prerendered.
// Sends the registration lead to BOTH the Skyguru CRM and a Brevo email list.
export const prerender = false;

import type { APIRoute } from "astro";
import { sendSkyguruLead } from "../../lib/skyguru";
import { sendBrevoContact } from "../../lib/brevo";

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

  const attribution = (body.attribution ?? {}) as Record<string, unknown>;
  const nameParts = name.split(/\s+/).filter(Boolean);

  // Forward the lead to both destinations concurrently. Neither lib throws.
  const [crmOk, brevoOk] = await Promise.all([
    // Skyguru CRM — the source of truth.
    sendSkyguruLead({
      name,
      firstName: nameParts[0] ?? name,
      lastName: nameParts.slice(1).join(" ") || undefined,
      email,
      phone,
      consent,
      attribution,
    }),
    // Brevo email list (#10) — for marketing follow-up.
    sendBrevoContact({ name, phone, email, attribution }),
  ]);

  // Succeed if the lead landed in at least one destination; log partial failures.
  if (crmOk || brevoOk) {
    if (!crmOk) console.error("Lead saved to Brevo but Skyguru CRM failed", email);
    if (!brevoOk) console.error("Lead saved to Skyguru CRM but Brevo failed", email);
    return json({ ok: true });
  }

  return json(
    { ok: false, error: "Възникна грешка при изпращането. Моля, опитай отново." },
    502,
  );
};

// Politely reject other methods.
export const GET: APIRoute = () => json({ ok: false, error: "method_not_allowed" }, 405);
