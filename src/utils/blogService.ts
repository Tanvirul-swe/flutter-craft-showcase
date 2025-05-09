
import { BlogPost, Subscriber } from "@/types/blog";
import { toast } from "sonner";

// Local storage keys
const BLOGS_STORAGE_KEY = 'flutter-dev-blogs';
const SUBSCRIBERS_STORAGE_KEY = 'flutter-dev-subscribers';

// Initialize database if it doesn't exist
const initializeDatabase = () => {
  try {
    // Check if blogs exist in localStorage
    if (!localStorage.getItem(BLOGS_STORAGE_KEY)) {
      localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify([]));
    }
    
    // Check if subscribers exist in localStorage
    if (!localStorage.getItem(SUBSCRIBERS_STORAGE_KEY)) {
      localStorage.setItem(SUBSCRIBERS_STORAGE_KEY, JSON.stringify([]));
    }
    
    return true;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    return false;
  }
};

// Initialize database on load
initializeDatabase();

// Get blogs from local storage
export const getBlogs = (): BlogPost[] => {
  try {
    const blogsJson = localStorage.getItem(BLOGS_STORAGE_KEY);
    return blogsJson ? JSON.parse(blogsJson) : [];
  } catch (error) {
    console.error("Error retrieving blogs:", error);
    return [];
  }
};

// Get published blogs
export const getPublishedBlogs = (): BlogPost[] => {
  try {
    return getBlogs().filter(blog => blog.published);
  } catch (error) {
    console.error("Error retrieving published blogs:", error);
    return [];
  }
};

// Get blog by slug
export const getBlogBySlug = (slug: string): BlogPost | undefined => {
  try {
    return getBlogs().find(blog => blog.slug === slug);
  } catch (error) {
    console.error("Error retrieving blog by slug:", error);
    return undefined;
  }
};

// Save blog to local storage
export const saveBlog = (blog: BlogPost): void => {
  try {
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
  } catch (error) {
    console.error("Error saving blog:", error);
    toast.error("Failed to save blog post");
  }
};

// Delete blog
export const deleteBlog = (id: string): boolean => {
  try {
    const blogs = getBlogs();
    const filteredBlogs = blogs.filter(blog => blog.id !== id);
    localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(filteredBlogs));
    return true;
  } catch (error) {
    console.error("Error deleting blog:", error);
    toast.error("Failed to delete blog post");
    return false;
  }
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
  try {
    const subscribersJson = localStorage.getItem(SUBSCRIBERS_STORAGE_KEY);
    return subscribersJson ? JSON.parse(subscribersJson) : [];
  } catch (error) {
    console.error("Error retrieving subscribers:", error);
    return [];
  }
};

// Add subscriber
export const addSubscriber = (email: string): boolean => {
  try {
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
  } catch (error) {
    console.error("Error adding subscriber:", error);
    toast.error("Failed to add subscriber");
    return false;
  }
};

// Export database to JSON file
export const exportDatabase = (): { blogs: BlogPost[], subscribers: Subscriber[] } => {
  return {
    blogs: getBlogs(),
    subscribers: getSubscribers()
  };
};

// Import database from JSON
export const importDatabase = (data: { blogs?: BlogPost[], subscribers?: Subscriber[] }): boolean => {
  try {
    if (data.blogs) {
      localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(data.blogs));
    }
    
    if (data.subscribers) {
      localStorage.setItem(SUBSCRIBERS_STORAGE_KEY, JSON.stringify(data.subscribers));
    }
    
    return true;
  } catch (error) {
    console.error("Error importing database:", error);
    toast.error("Failed to import database");
    return false;
  }
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
