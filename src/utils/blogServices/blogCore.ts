
import { BlogPost } from "@/types/blog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// Get blogs from Supabase
export const getBlogs = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('updated_at', { ascending: false });
      
    if (error) {
      console.error("Error retrieving blogs:", error);
      return [];
    }
    
    return data as BlogPost[];
  } catch (error) {
    console.error("Error retrieving blogs:", error);
    return [];
  }
};

// Get published blogs
export const getPublishedBlogs = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('published', true)
      .order('updated_at', { ascending: false });
      
    if (error) {
      console.error("Error retrieving published blogs:", error);
      return [];
    }
    
    return data as BlogPost[];
  } catch (error) {
    console.error("Error retrieving published blogs:", error);
    return [];
  }
};

// Get blog by slug
export const getBlogBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (error) {
      console.error("Error retrieving blog by slug:", error);
      return undefined;
    }
    
    return data as BlogPost;
  } catch (error) {
    console.error("Error retrieving blog by slug:", error);
    return undefined;
  }
};
