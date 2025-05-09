
// This file now serves as a simple aggregator that re-exports functions
// from the separated blog service modules for backward compatibility
import { generateSlug, getBlogs, getPublishedBlogs, getBlogBySlug } from './blogServices/blogCore';
import { saveBlog, deleteBlog, exportDatabase, importDatabase } from './blogServices/blogOperations';
import { getSubscribers, addSubscriber, notifySubscribers } from './blogServices/subscriberOperations';

export {
  // Blog core functions
  generateSlug,
  getBlogs,
  getPublishedBlogs,
  getBlogBySlug,
  
  // Blog operations
  saveBlog,
  deleteBlog,
  exportDatabase,
  importDatabase,
  
  // Subscriber operations
  getSubscribers,
  addSubscriber,
  notifySubscribers
};
