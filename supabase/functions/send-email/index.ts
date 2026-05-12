// Deno type declarations for Supabase Edge Functions
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL"); // Your business email
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "noreply@livelylighting.com";

interface FormPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  message?: string;
  lead_source?: string;
  sales_code?: string;
  website?: string; // honeypot field
}

// Utility: Trim and fallback
const sanitize = (s?: string) => s?.trim() || "";

// Build HTML email template
const buildEmailHtml = (data: FormPayload): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px;">
        New Consultation Request
      </h2>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Name:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${sanitize(data.first_name)} ${sanitize(data.last_name)}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <a href="mailto:${sanitize(data.email)}">${sanitize(data.email)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <a href="tel:${sanitize(data.phone)}">${sanitize(data.phone)}</a>
          </td>
        </tr>
        ${data.address ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Address:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${sanitize(data.address)}</td>
        </tr>
        ` : ''}
        ${data.lead_source ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">How they heard about us:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${sanitize(data.lead_source)}</td>
        </tr>
        ` : ''}
        ${data.sales_code ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Sales Code:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <span style="display: inline-block; padding: 4px 10px; background: #fff7d6; border: 1px solid #f0c419; border-radius: 4px; font-family: monospace; font-weight: bold; letter-spacing: 1px; color: #8a6d00;">${sanitize(data.sales_code).toUpperCase()}</span>
          </td>
        </tr>
        ` : ''}
        ${data.message ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; vertical-align: top;">Message:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${sanitize(data.message)}</td>
        </tr>
        ` : ''}
      </table>

      <p style="margin-top: 30px; color: #666; font-size: 12px;">
        This consultation request was submitted via the Lively Lighting website.
      </p>
    </div>
  `;
};

// Build plain text version
const buildEmailText = (data: FormPayload): string => {
  let text = `New Consultation Request\n\n`;
  text += `Name: ${sanitize(data.first_name)} ${sanitize(data.last_name)}\n`;
  text += `Email: ${sanitize(data.email)}\n`;
  text += `Phone: ${sanitize(data.phone)}\n`;
  if (data.address) text += `Address: ${sanitize(data.address)}\n`;
  if (data.lead_source) text += `How they heard about us: ${sanitize(data.lead_source)}\n`;
  if (data.sales_code) text += `Sales Code: ${sanitize(data.sales_code).toUpperCase()}\n`;
  if (data.message) text += `\nMessage:\n${sanitize(data.message)}\n`;
  text += `\n---\nSubmitted via Lively Lighting website`;
  return text;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse JSON safely
    let payload: FormPayload;
    try {
      payload = await req.json() as FormPayload;
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

    if (!SENDGRID_API_KEY) {
      throw new Error("Missing SendGrid API key configuration");
    }

    if (!NOTIFICATION_EMAIL) {
      throw new Error("Missing notification email configuration");
    }

    // Build SendGrid payload
    const sendGridPayload = {
      personalizations: [
        {
          to: [{ email: NOTIFICATION_EMAIL }],
          subject: `New Consultation Request from ${sanitize(payload.first_name)} ${sanitize(payload.last_name)}`,
        },
      ],
      from: {
        email: FROM_EMAIL,
        name: "Lively Lighting Website",
      },
      reply_to: {
        email: sanitize(payload.email),
        name: `${sanitize(payload.first_name)} ${sanitize(payload.last_name)}`,
      },
      content: [
        {
          type: "text/plain",
          value: buildEmailText(payload),
        },
        {
          type: "text/html",
          value: buildEmailHtml(payload),
        },
      ],
    };

    console.log("Sending email via SendGrid to:", NOTIFICATION_EMAIL);

    // Send via SendGrid
    const sendGridResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendGridPayload),
    });

    console.log("SendGrid Response Status:", sendGridResponse.status);

    // SendGrid returns 202 Accepted on success (no body)
    if (sendGridResponse.status === 202) {
      return new Response(
        JSON.stringify({ success: true, message: "Email sent successfully" }),
        {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Handle errors
    const errorData = await sendGridResponse.json().catch(() => ({}));
    console.error("SendGrid API Error:", {
      status: sendGridResponse.status,
      data: errorData,
    });

    throw new Error(
      `SendGrid API Error: ${sendGridResponse.status} - ${JSON.stringify(errorData)}`
    );
  } catch (error: unknown) {
    console.error("Function error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
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
