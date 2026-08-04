/// <reference no-default-lib="true" />

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const VCITA_API_KEY = Deno.env.get("VCITA_API_KEY");
const VCITA_URL = Deno.env.get("VCITA_URL");

// Trelli (our own CRM) — dual-write during the vCita → Trelli migration.
// Optional: if TRELLI_API_KEY is unset, the Trelli push is skipped silently so
// this code is safe to deploy before the key/secret exists in Supabase.
const TRELLI_API_KEY = Deno.env.get("TRELLI_API_KEY");
const TRELLI_API_URL =
  Deno.env.get("TRELLI_API_URL") || "https://trellicrm.com/api/v1/leads";

interface LeadPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  message?: string;
  lead_source?: string; // "How they heard about us"
  sales_code?: string;
  website?: string; // honeypot field
}

// Utility: Trim and fallback
const sanitize = (s?: string) => s?.trim() || "";

// Push a lead into Trelli via its public lead-intake API.
// Best-effort and fully non-fatal: any failure is logged but never thrown, so a
// Trelli outage can't break the vCita flow or the user-facing contact form.
const pushToTrelli = async (payload: LeadPayload): Promise<void> => {
  if (!TRELLI_API_KEY) {
    console.log("Trelli push skipped: TRELLI_API_KEY not configured");
    return;
  }

  // Trelli's lead endpoint only accepts firstName/lastName/email/phone/company/
  // position/source/notes — fold everything else (address, message, how-they-
  // heard, sales code) into notes so nothing is lost.
  const notes = [
    payload.address && `Address: ${sanitize(payload.address)}`,
    payload.lead_source &&
      `How they heard about us: ${sanitize(payload.lead_source)}`,
    payload.sales_code &&
      `Sales code: ${sanitize(payload.sales_code).toUpperCase()}`,
    payload.message && `Message: ${sanitize(payload.message)}`,
  ]
    .filter(Boolean)
    .join("\n");

  const trelliPayload = {
    firstName: sanitize(payload.first_name),
    lastName: sanitize(payload.last_name),
    email: sanitize(payload.email),
    phone: sanitize(payload.phone),
    source: "livelylightingco.com",
    notes: notes || undefined,
  };

  try {
    const res = await fetch(TRELLI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": TRELLI_API_KEY,
      },
      body: JSON.stringify(trelliPayload),
    });

    if (res.ok) {
      console.log("Trelli lead created:", res.status);
    } else if (res.status === 409) {
      // Contact with this email already exists in Trelli — expected on retries.
      console.log("Trelli lead already exists (409), skipping");
    } else {
      const body = await res.text().catch(() => "");
      console.error("Trelli push failed (non-fatal):", res.status, body);
    }
  } catch (err) {
    console.error("Trelli push error (non-fatal):", err);
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse JSON safely
    let payload: LeadPayload;
    try {
      payload = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // Honeypot check (spam protection)
    if (payload.website) {
      console.warn("Bot detected. Honeypot field filled:", payload.website);
      return new Response(JSON.stringify({ error: "Bot detected" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // Validate required fields
    if (
      !payload.first_name ||
      !payload.last_name ||
      !payload.email ||
      !payload.phone
    ) {
      throw new Error(
        "Missing required fields: first name, last name, email, and phone are required",
      );
    }

    // Dual-write to Trelli first, independent of vCita, so leads still land in
    // our CRM even if vCita is misconfigured or down. Non-fatal by design.
    await pushToTrelli(payload);

    if (!VCITA_API_KEY || !VCITA_URL) {
      throw new Error("Missing required vCita configuration");
    }

    // Cleaned payload
    const vCitaPayload = {
      first_name: sanitize(payload.first_name),
      last_name: sanitize(payload.last_name),
      email: sanitize(payload.email),
      phone: sanitize(payload.phone),
      address: sanitize(payload.address),
      source: "Website Form",
    };

    console.log("Sending request to vCita:", {
      url: `${VCITA_URL}/clients`,
      payload: vCitaPayload,
    });

    // Send to vCita
    const vCitaResponse = await fetch(`${VCITA_URL}/clients`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VCITA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vCitaPayload),
    });

    const responseData = (await vCitaResponse.json().catch(() => ({}))) as {
      message?: string;
      error?: string;
    };

    console.log("vCita API Response:", {
      status: vCitaResponse.status,
      statusText: vCitaResponse.statusText,
      data: responseData,
    });

    if (!vCitaResponse.ok) {
      const errorMessage =
        responseData.message || responseData?.error || "Unknown error occurred";
      console.error("vCita API Error:", {
        status: vCitaResponse.status,
        message: errorMessage,
        data: responseData,
      });
      throw new Error(`vCita API Error: ${errorMessage}`);
    }

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ error: error.message, details: error.stack }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  }
});
