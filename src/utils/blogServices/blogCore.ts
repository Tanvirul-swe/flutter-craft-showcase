
import { BlogPost, BlogPostDB } from "@/types/blog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Map DB blog to frontend model
const mapBlogFromDB = (blog: BlogPostDB): BlogPost => {
  return {
    id: blog.id,
    title: blog.title,
    content: blog.content,
    excerpt: blog.excerpt,
    coverImage: blog.cover_image,
    tags: blog.tags || [],
    slug: blog.slug,
    published: blog.published || false,
    createdAt: blog.created_at,
    updatedAt: blog.updated_at
  };
};

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
    
    return (data as BlogPostDB[]).map(mapBlogFromDB);
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
    
    return (data as BlogPostDB[]).map(mapBlogFromDB);
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
    
    return mapBlogFromDB(data as BlogPostDB);
  } catch (error) {
    console.error("Error retrieving blog by slug:", error);
    return undefined;
  }
};
