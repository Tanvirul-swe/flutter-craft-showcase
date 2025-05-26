
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
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

    // Send EHLO command
    await conn.write(encoder.encode(`EHLO ${SMTP_CONFIG.hostname}\r\n`));
    await conn.read(buffer);

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
    const { name, email, subject, message }: ContactEmailRequest = await req.json();

    if (!name || !email || !subject || !message) {
      throw new Error('All fields are required');
    }

    console.log(`Processing contact form submission from: ${email}`);

    // Email content for you (notification)
    const notificationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
          New Contact Form Submission
        </h1>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #374151;">Contact Details</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #374151;">Message:</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            <strong>Reply to:</strong> ${email}
          </p>
        </div>
      </div>
    `;

    // Auto-reply email content for the sender
    const autoReplyHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb; text-align: center;">Thank You!</h1>
        
        <p>Hello ${name},</p>
        
        <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Your Message Summary:</h3>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}</p>
        </div>
        
        <p>We typically respond within 24-48 hours during business days.</p>
        
        <p>Best regards,<br>
        The FlutterDev Team</p>
      </div>
    `;

    // Send notification email to you
    await sendEmail(
      SMTP_CONFIG.username, 
      `Contact Form: ${subject}`, 
      notificationHtml
    );

    // Send auto-reply to the sender
    await sendEmail(
      email, 
      "Thank you for contacting us!", 
      autoReplyHtml
    );

    console.log("Contact emails sent successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Contact emails sent successfully" 
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
    console.error("Error in send-contact-email function:", error);
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
