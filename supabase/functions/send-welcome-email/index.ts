
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WelcomeEmailRequest {
  email: string;
}

// SMTP configuration using your email server
const SMTP_CONFIG = {
  hostname: "mail.spacemail.com",
  port: 465,
  username: "info@wavetechinfo.xyz",
  password: "f746592c-e699-4Af0-97e1-57aCc091bb27",
};

async function sendEmail(to: string, subject: string, html: string) {
  try {
    // Create the email message
    const message = [
      `From: FlutterDev <${SMTP_CONFIG.username}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=UTF-8`,
      '',
      html
    ].join('\r\n');

    // Connect to SMTP server using TLS
    const conn = await Deno.connectTls({
      hostname: SMTP_CONFIG.hostname,
      port: SMTP_CONFIG.port,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Read server greeting
    const buffer = new Uint8Array(1024);
    await conn.read(buffer);
    console.log("Server greeting:", decoder.decode(buffer));

    // Send EHLO command
    await conn.write(encoder.encode(`EHLO ${SMTP_CONFIG.hostname}\r\n`));
    await conn.read(buffer);
    console.log("EHLO response:", decoder.decode(buffer));

    // Send AUTH LOGIN command
    await conn.write(encoder.encode("AUTH LOGIN\r\n"));
    await conn.read(buffer);

    // Send username (base64 encoded)
    const username = btoa(SMTP_CONFIG.username);
    await conn.write(encoder.encode(`${username}\r\n`));
    await conn.read(buffer);

    // Send password (base64 encoded)
    const password = btoa(SMTP_CONFIG.password);
    await conn.write(encoder.encode(`${password}\r\n`));
    await conn.read(buffer);

    // Send MAIL FROM command
    await conn.write(encoder.encode(`MAIL FROM:<${SMTP_CONFIG.username}>\r\n`));
    await conn.read(buffer);

    // Send RCPT TO command
    await conn.write(encoder.encode(`RCPT TO:<${to}>\r\n`));
    await conn.read(buffer);

    // Send DATA command
    await conn.write(encoder.encode("DATA\r\n"));
    await conn.read(buffer);

    // Send the email message
    await conn.write(encoder.encode(`${message}\r\n.\r\n`));
    await conn.read(buffer);

    // Send QUIT command
    await conn.write(encoder.encode("QUIT\r\n"));
    await conn.read(buffer);

    conn.close();
    return true;
  } catch (error) {
    console.error("SMTP Error:", error);
    throw error;
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: WelcomeEmailRequest = await req.json();

    if (!email) {
      throw new Error('Email is required');
    }

    console.log(`Sending welcome email to: ${email}`);

    // Email content for welcome message
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb; text-align: center;">Welcome to FlutterDev Blog!</h1>
        
        <p>Hello,</p>
        
        <p>Thank you for subscribing to our blog updates! We're excited to have you as part of our Flutter development community.</p>
        
        <p>You'll now receive notifications whenever we publish new blog posts about:</p>
        <ul>
          <li>Flutter development tips and tricks</li>
          <li>Latest Flutter updates and features</li>
          <li>Mobile app development best practices</li>
          <li>Code tutorials and examples</li>
        </ul>
        
        <p>Stay tuned for amazing content coming your way!</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #6b7280;">
            If you didn't subscribe to this newsletter, you can safely ignore this email.
          </p>
        </div>
        
        <p>Best regards,<br>
        The FlutterDev Team</p>
      </div>
    `;

    // Send the email
    await sendEmail(email, "Welcome to FlutterDev Blog!", htmlContent);

    console.log("Welcome email sent successfully to:", email);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Welcome email sent successfully" 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
