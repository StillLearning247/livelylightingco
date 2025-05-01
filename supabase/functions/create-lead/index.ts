/// <reference no-default-lib="true" />

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const VCITA_API_KEY = Deno.env.get("VCITA_API_KEY");
const VCITA_URL = Deno.env.get("VCITA_URL");

interface LeadPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  message?: string;
  website?: string; // honeypot field
}

// Utility: Trim and fallback
const sanitize = (s?: string) => s?.trim() || "";

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
        "Missing required fields: first name, last name, email, and phone are required"
      );
    }

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
      }
    );
  }
});
