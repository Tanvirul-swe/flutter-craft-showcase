
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
  const loadBlogs = () => {
    setIsLoading(true);
    setBlogs(getBlogs());
    setPublishedBlogs(getPublishedBlogs());
    setIsLoading(false);
  };

  // Load subscribers from storage
  const loadSubscribers = () => {
    setSubscribers(getSubscribers());
  };

  // Create or update blog
  const upsertBlog = async (blog: Partial<BlogPost>, publish: boolean = false): Promise<BlogPost> => {
    setIsLoading(true);
    
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
    
    saveBlog(newBlog);
    
    // If publishing and wasn't published before, notify subscribers
    if (publish && !blog.published) {
      await notifySubscribers(newBlog);
    }
    
    loadBlogs();
    setIsLoading(false);
    return newBlog;
  };

  // Delete a blog
  const removeBlog = (id: string) => {
    setIsLoading(true);
    deleteBlog(id);
    loadBlogs();
    setIsLoading(false);
  };

  // Get a blog by slug
  const getBlog = (slug: string): BlogPost | undefined => {
    return getBlogBySlug(slug);
  };

  // Subscribe to blog
  const subscribe = (email: string): boolean => {
    const success = addSubscriber(email);
    if (success) {
      loadSubscribers();
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
