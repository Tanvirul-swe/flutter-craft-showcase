
import { BlogPost, BlogPostDB } from "@/types/blog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { notifySubscribers } from "./subscriberOperations";

// Map frontend blog to DB model
const mapBlogToDB = (blog: BlogPost): Partial<BlogPostDB> => {
  return {
    title: blog.title,
    content: blog.content,
    excerpt: blog.excerpt,
    cover_image: blog.coverImage,
    tags: blog.tags,
    slug: blog.slug,
    published: blog.published,
    updated_at: new Date().toISOString()
  };
};

// Save blog to Supabase
export const saveBlog = async (blog: BlogPost): Promise<void> => {
  try {
    const blogData = mapBlogToDB(blog);
    
    if (blog.id) {
      // Update existing blog
      const { error } = await supabase
        .from('blogs')
        .update(blogData)
        .eq('id', blog.id);
        
      if (error) throw error;
    } else {
      // Insert new blog
      const { error } = await supabase
        .from('blogs')
        .insert({
          ...blogData,
          created_at: new Date().toISOString()
        });
        
      if (error) throw error;
    }
  } catch (error) {
    console.error("Error saving blog:", error);
    toast.error("Failed to save blog post");
  }
};

// Delete blog
export const deleteBlog = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting blog:", error);
    toast.error("Failed to delete blog post");
    return false;
  }
};

// Export database to JSON file
export const exportDatabase = async (): Promise<{ blogs: BlogPost[], subscribers: any[] }> => {
  try {
    const { data: blogsData, error: blogsError } = await supabase
      .from('blogs')
      .select('*');
    
    if (blogsError) throw blogsError;
    
    const { data: subscribers, error: subsError } = await supabase
      .from('subscribers')
      .select('*');
    
    if (subsError) throw subsError;
    
    const blogs = (blogsData as BlogPostDB[]).map(blog => ({
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
    }));
    
    return {
      blogs: blogs,
      subscribers: subscribers || []
    };
  } catch (error) {
    console.error("Error exporting database:", error);
    return {
      blogs: [],
      subscribers: []
    };
  }
};

// Import database from JSON
export const importDatabase = async (data: { blogs?: BlogPost[], subscribers?: any[] }): Promise<boolean> => {
  try {
    let success = true;
    
    if (data.blogs && data.blogs.length > 0) {
      // Map blogs to DB format
      const blogsDB = data.blogs.map(blog => ({
        id: blog.id,
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        cover_image: blog.coverImage,
        tags: blog.tags,
        slug: blog.slug,
        published: blog.published,
        created_at: blog.createdAt,
        updated_at: blog.updatedAt
      }));
      
      // First clear existing blogs
      const { error: clearError } = await supabase
        .from('blogs')
        .delete()
        .neq('id', 'placeholder'); // Delete all
      
      if (clearError) {
        console.error("Error clearing blogs:", clearError);
        success = false;
      } else {
        // Insert new blogs
        const { error: insertError } = await supabase
          .from('blogs')
          .insert(blogsDB);
        
        if (insertError) {
          console.error("Error importing blogs:", insertError);
          success = false;
        }
      }
    }
    
    if (data.subscribers && data.subscribers.length > 0) {
      // Clear existing subscribers
      const { error: clearError } = await supabase
        .from('subscribers')
        .delete()
        .neq('id', 'placeholder'); // Delete all
      
      if (clearError) {
        console.error("Error clearing subscribers:", clearError);
        success = false;
      } else {
        // Insert new subscribers
        const { error: insertError } = await supabase
          .from('subscribers')
          .insert(data.subscribers);
        
        if (insertError) {
          console.error("Error importing subscribers:", insertError);
          success = false;
        }
      }
    }
    
    return success;
  } catch (error) {
    console.error("Error importing database:", error);
    toast.error("Failed to import database");
    return false;
  }
};
