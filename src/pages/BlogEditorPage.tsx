
import React from 'react';
import { useParams } from 'react-router-dom';
import BlogEditor from '@/components/admin/BlogEditor';
import AdminProtected from '@/components/admin/AdminProtected';

const BlogEditorPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <AdminProtected>
      <main className="container mx-auto px-4 py-12 md:py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">{slug ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
            <p className="text-muted-foreground mt-2">{slug ? 'Update your existing content' : 'Create and publish new content to share with the world'}</p>
          </header>
          <BlogEditor />
        </div>
      </main>
    </AdminProtected>
  );
};

export default BlogEditorPage;
