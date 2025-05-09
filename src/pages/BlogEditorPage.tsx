
import React from 'react';
import BlogEditor from '@/components/admin/BlogEditor';
import AdminProtected from '@/components/admin/AdminProtected';

const BlogEditorPage: React.FC = () => {
  return (
    <AdminProtected>
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <BlogEditor />
        </div>
      </main>
    </AdminProtected>
  );
};

export default BlogEditorPage;
