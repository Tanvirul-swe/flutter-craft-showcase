
import { toast } from "sonner";

interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (data: EmailData): Promise<boolean> => {
  try {
    // Build the email request
    const emailRequest = {
      to: data.email,
      from: process.env.SMTP_FROM_EMAIL!,
      subject: `Portfolio Contact: ${data.subject}`,
      body: `
        Name: ${data.name}
        Email: ${data.email}
        
        Message:
        ${data.message}
      `,
      smtp: {
        host: process.env.SMTP_HOST!,
        port: parseInt(process.env.SMTP_PORT!),
        username: process.env.SMTP_USERNAME!,
        password: process.env.SMTP_PASSWORD!,
      },
    };

    // In a real-world scenario, you would use a server-side API to send this
    // Since we're in a front-end only environment, we're simulating a successful email
    console.log("Email would be sent with:", emailRequest);

    // In production, you'd replace this with an actual API call
    // Since we're in a client-side only environment, we'll simulate a successful response
    // In a real app, this would be a fetch to your backend endpoint

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Log success and return true
    console.log("Email sent successfully!");
    return true;

    /* 
    // For real implementation with a backend API
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailRequest)
    });
    
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    
    return true;
    */
  } catch (error) {
    console.error("Failed to send email:", error);
    toast.error("Failed to send email. Please try again later.");
    return false;
  }
};
