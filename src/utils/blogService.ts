
import { BlogPost, Subscriber } from "@/types/blog";
import { toast } from "sonner";

// Local storage keys
const BLOGS_STORAGE_KEY = 'flutter-dev-blogs';
const SUBSCRIBERS_STORAGE_KEY = 'flutter-dev-subscribers';

// Get blogs from local storage
export const getBlogs = (): BlogPost[] => {
  const blogsJson = localStorage.getItem(BLOGS_STORAGE_KEY);
  return blogsJson ? JSON.parse(blogsJson) : [];
};

// Get published blogs
export const getPublishedBlogs = (): BlogPost[] => {
  return getBlogs().filter(blog => blog.published);
};

// Get blog by slug
export const getBlogBySlug = (slug: string): BlogPost | undefined => {
  return getBlogs().find(blog => blog.slug === slug);
};

// Save blog to local storage
export const saveBlog = (blog: BlogPost): void => {
  const blogs = getBlogs();
  const existingBlogIndex = blogs.findIndex(b => b.id === blog.id);
  
  if (existingBlogIndex >= 0) {
    blogs[existingBlogIndex] = { ...blog, updatedAt: new Date().toISOString() };
  } else {
    blogs.push({
      ...blog,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(blogs));
};

// Delete blog
export const deleteBlog = (id: string): void => {
  const blogs = getBlogs();
  const filteredBlogs = blogs.filter(blog => blog.id !== id);
  localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(filteredBlogs));
};

// Generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// Get subscribers
export const getSubscribers = (): Subscriber[] => {
  const subscribersJson = localStorage.getItem(SUBSCRIBERS_STORAGE_KEY);
  return subscribersJson ? JSON.parse(subscribersJson) : [];
};

// Add subscriber
export const addSubscriber = (email: string): boolean => {
  const subscribers = getSubscribers();
  
  // Check if email already exists
  if (subscribers.some(sub => sub.email === email)) {
    toast.error("This email is already subscribed!");
    return false;
  }
  
  const newSubscriber: Subscriber = {
    id: crypto.randomUUID(),
    email,
    subscribedAt: new Date().toISOString()
  };
  
  subscribers.push(newSubscriber);
  localStorage.setItem(SUBSCRIBERS_STORAGE_KEY, JSON.stringify(subscribers));
  return true;
};

// Send email notification to subscribers about new blog post
export const notifySubscribers = async (blogPost: BlogPost): Promise<boolean> => {
  const subscribers = getSubscribers();
  
  if (subscribers.length === 0) {
    return true; // No subscribers to notify
  }
  
  try {
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
