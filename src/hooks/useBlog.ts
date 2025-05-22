
import { useState, useEffect } from "react";
import { BlogPost, Subscriber } from "@/types/blog";
import { 
  getBlogs, 
  getPublishedBlogs, 
  getBlogBySlug,
  saveBlog, 
  deleteBlog, 
  generateSlug,
  getSubscribers,
  addSubscriber,
  notifySubscribers
} from "@/utils/blogService";

export const useBlog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [publishedBlogs, setPublishedBlogs] = useState<BlogPost[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load blogs and subscribers
  useEffect(() => {
    loadBlogs();
    loadSubscribers();
  }, []);

  // Load blogs from storage
  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const allBlogs = await getBlogs();
      setBlogs(allBlogs);
      
      const publishedBlogsData = await getPublishedBlogs();
      setPublishedBlogs(publishedBlogsData);
    } catch (error) {
      console.error("Error loading blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load subscribers from storage
  const loadSubscribers = async () => {
    try {
      const subscribersData = await getSubscribers();
      setSubscribers(subscribersData);
    } catch (error) {
      console.error("Error loading subscribers:", error);
    }
  };

  // Create or update blog
  const upsertBlog = async (blog: Partial<BlogPost>, publish: boolean = false): Promise<BlogPost> => {
    setIsLoading(true);
    
    try {
      // Make sure we have required fields
      if (!blog.title) throw new Error("Blog title is required");
      if (!blog.content) throw new Error("Blog content is required");
      
      const slug = blog.slug || generateSlug(blog.title);
      const excerpt = blog.excerpt || blog.content.substring(0, 150) + '...';
      
      const newBlog: BlogPost = {
        id: blog.id || '',
        title: blog.title,
        content: blog.content,
        excerpt: excerpt,
        coverImage: blog.coverImage || '',
        tags: blog.tags || [],
        slug: slug,
        published: publish,
        createdAt: blog.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await saveBlog(newBlog);
      
      // If publishing and wasn't published before, notify subscribers
      if (publish && !blog.published) {
        await notifySubscribers(newBlog);
      }
      
      await loadBlogs();
      return newBlog;
    } catch (error) {
      console.error("Error upserting blog:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a blog
  const removeBlog = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteBlog(id);
      await loadBlogs();
    } catch (error) {
      console.error("Error removing blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get a blog by slug - now returns from cached blogs array rather than making a new request
  const getBlog = (slug: string): BlogPost | undefined => {
    return blogs.find(blog => blog.slug === slug);
  };

  // Subscribe to blog
  const subscribe = async (email: string): Promise<boolean> => {
    const success = await addSubscriber(email);
    if (success) {
      await loadSubscribers();
    }
    return success;
  };

  return {
    blogs,
    publishedBlogs,
    subscribers,
    isLoading,
    upsertBlog,
    removeBlog,
    getBlog,
    subscribe
  };
};
