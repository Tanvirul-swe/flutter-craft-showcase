
import React from 'react';
import BlogEditor from '@/components/admin/BlogEditor';
import AdminProtected from '@/components/admin/AdminProtected';

const BlogWritePage: React.FC = () => {
  return (
    <AdminProtected>
      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Create New Blog Post</h1>
            <p className="text-muted-foreground mt-2">Write and publish your content to share with the world</p>
          </header>
          <BlogEditor />
        </div>
      </main>
    </AdminProtected>
  );
};

export default BlogWritePage;
