
import { Subscriber } from "@/types/blog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Get subscribers
export const getSubscribers = async (): Promise<Subscriber[]> => {
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });
      
    if (error) {
      console.error("Error retrieving subscribers:", error);
      return [];
    }
    
    return data as Subscriber[];
  } catch (error) {
    console.error("Error retrieving subscribers:", error);
    return [];
  }
};

// Add subscriber
export const addSubscriber = async (email: string): Promise<boolean> => {
  try {
    // Check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingSubscriber) {
      toast.error("This email is already subscribed!");
      return false;
    }
    
    // Add new subscriber
    const { error } = await supabase
      .from('subscribers')
      .insert({ email });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error adding subscriber:", error);
    toast.error("Failed to add subscriber");
    return false;
  }
};

// Send email notification to subscribers about new blog post
export const notifySubscribers = async (blogPost: any): Promise<boolean> => {
  try {
    // Get all subscribers
    const subscribers = await getSubscribers();
    
    if (subscribers.length === 0) {
      return true; // No subscribers to notify
    }
    
    // Build email content
    const emailContent = {
      subject: `New Blog Post: ${blogPost.title}`,
      body: `
        Hello,
        
        A new blog post has been published on FlutterDev:
        
        "${blogPost.title}"
        
        ${blogPost.excerpt}
        
        Read the full post here: [Your website URL]/blog/${blogPost.slug}
        
        Best regards,
        FlutterDev Team
      `
    };
    
    console.log("Would notify subscribers about new post:", emailContent);
    // In a real implementation, we would send actual emails here
    
    return true;
  } catch (error) {
    console.error("Failed to notify subscribers:", error);
    toast.error("Failed to notify subscribers");
    return false;
  }
};
