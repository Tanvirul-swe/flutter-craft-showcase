
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  slug: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

// Database mapping interfaces - for internal use
export interface BlogPostDB {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  cover_image?: string;
  tags: string[];
  slug: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriberDB {
  id: string;
  email: string;
  subscribed_at: string;
}
