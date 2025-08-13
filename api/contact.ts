import { Resend } from 'resend';

export const config = {
  runtime: 'edge',
};

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set.");
}

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = 'contact@sproutcircle.ca';
const FROM_EMAIL = 'onboarding@resend.dev';

function getCorsHeaders() {
  const vercelUrl = process.env.VERCEL_URL;
  const allowedOrigin = process.env.NODE_ENV === 'production' && vercelUrl
    ? `https://${vercelUrl}`
    : '*';

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export default async function handler(req: Request) {
  const corsHeaders = getCorsHeaders();

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { name, email, reason, message } = await req.json();

    if (!name || !email || !reason || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await resend.emails.send({
      from: `Alira Contact Form <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      subject: `New Alira Contact: ${reason}`,
  reply_to: email,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send email.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Email sent successfully!', id: data?.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (err: any) {
    console.error('Handler Error:', err);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}