
import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useBlog } from '@/hooks/useBlog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar } from 'lucide-react';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getBlog } = useBlog();
  
  const blog = slug ? getBlog(slug) : undefined;
  
  // Redirect if blog not found or not published
  if (!blog || !blog.published) {
    return <Navigate to="/blog" replace />;
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="container mx-auto px-4 py-24">
      <article className="max-w-3xl mx-auto">
        <Button variant="outline" asChild className="mb-8">
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
        
        {blog.coverImage && (
          <div className="aspect-[21/9] w-full overflow-hidden rounded-lg mb-8">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map(tag => (
                  <Link to={`/blog?tag=${tag}`} key={tag}>
                    <Badge variant="outline">{tag}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>
        
        <Separator className="my-8" />
        
        <div className="prose prose-lg max-w-none">
          {/* Split content by newlines and render as paragraphs */}
          {blog.content.split('\n').map((paragraph, index) => (
            paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
          ))}
        </div>
      </article>
    </main>
  );
};

export default BlogDetailPage;
