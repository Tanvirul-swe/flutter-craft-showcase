
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WelcomeEmailRequest {
  email: string;
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
    const emailContent = {
      to: email,
      from: "info@wavetechinfo.xyz",
      subject: "Welcome to FlutterDev Blog!",
      html: `
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
      `,
    };

    // In production, you would integrate with your SMTP service here
    // For now, we'll simulate the email sending
    console.log("Welcome email would be sent with config:", {
      smtp: {
        host: "mail.spacemail.com",
        port: 465,
        username: "info@wavetechinfo.xyz",
        // password would be from environment variables
      },
      ...emailContent
    });

    // Simulate successful email sending
    await new Promise(resolve => setTimeout(resolve, 500));

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
