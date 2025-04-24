import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const VCITA_API_KEY = Deno.env.get('VCITA_API_KEY');
const VCITA_URL = Deno.env.get('VCITA_URL');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!VCITA_API_KEY || !VCITA_URL) {
      throw new Error('Missing required vCita configuration');
    }

    const { first_name, last_name, email, phone, address, message } = await req.json();

    // Validate required fields
    if (!first_name || !last_name || !email || !phone) {
      throw new Error('Missing required fields: first name, last name, email, and phone are required');
    }

    const payload = {
      first_name,
      last_name,
      email,
      phone,
      address,
      source: 'Website Form'
    };

    console.log('Sending request to vCita:', {
      url: `${VCITA_URL}/clients`,
      payload
    });

    // Create lead in vCita
    const vCitaResponse = await fetch(`${VCITA_URL}/clients`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VCITA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await vCitaResponse.json().catch(() => null);
    console.log('vCita API Response:', {
      status: vCitaResponse.status,
      statusText: vCitaResponse.statusText,
      data: responseData
    });

    if (!vCitaResponse.ok) {
      const errorMessage = responseData?.message || responseData?.error || 'Unknown error occurred';
      console.error('vCita API Error:', {
        status: vCitaResponse.status,
        message: errorMessage,
        data: responseData
      });
      throw new Error(`vCita API Error: ${errorMessage}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        data: responseData 
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});