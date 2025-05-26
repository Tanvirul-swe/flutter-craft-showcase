
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
      `From: TanvirDev <${SMTP_CONFIG.username}>`,
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

    // Email content using your custom HTML template
    const htmlContent = `<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0;">
<head>
  <meta charset="UTF-8">
  <title>Welcome to Tanvir's Blog</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media (max-width: 600px) {
      .container {
        width: 90% !important;
        padding: 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8; padding: 40px 0;">
    <tr>
      <td align="center">
        <table class="container" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <img src="https://tanvirdev.com/assets/logo.png" alt="TanvirDev Logo" width="80" style="margin-bottom: 20px;" onerror="this.style.display='none'">
              <h1 style="font-size: 24px; color: #1d1d1d; margin: 0;">Welcome to Tanvir's Blog 👋</h1>
            </td>
          </tr>
          <tr>
            <td style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
              <p style="margin: 0 0 20px;">
                Hi there,
              </p>
              <p style="margin: 0 0 20px;">
                Thanks for subscribing to my blog! You've just joined a community where I regularly share insights on <strong>software development, projects, career tips</strong>, and more.
              </p>
              <p style="margin: 0 0 20px;">
                As a full-stack developer passionate about crafting real-world solutions, I'm excited to share what I've learned, built, and discovered with you.
              </p>
              <p style="margin: 0 0 20px;">
                You'll now receive emails whenever a new blog is published.
              </p>
              <p style="margin: 0 0 30px;">
                Let's build and grow together 🚀
              </p>
              <p style="margin: 0 0 30px;">
                Best regards,<br>
                <strong>MD. TANVIRUL ISLAM</strong><br>
                <a href="https://tanvirdev.com" style="color: #007BFF; text-decoration: none;">tanvirdev.com</a>
              </p>
              <a href="https://tanvirdev.com/blog" style="background-color: #007BFF; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; font-weight: 500;">Explore Latest Blogs</a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top: 40px; font-size: 12px; color: #999999;">
              You're receiving this email because you subscribed on <a href="https://tanvirdev.com" style="color: #999999; text-decoration: underline;">tanvirdev.com</a>.
              <br>
              <a href="https://tanvirdev.com/unsubscribe" style="color: #999999; text-decoration: underline;">Unsubscribe</a> if you no longer wish to receive updates.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

    // Send the email
    await sendEmail(email, "Welcome to Tanvir's Blog!", htmlContent);

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
