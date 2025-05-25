
import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useBlog } from '@/hooks/useBlog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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
      <article className="max-w-4xl mx-auto">
        <Button variant="outline" asChild className="mb-8">
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
        
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="aspect-[21/9] w-full overflow-hidden rounded-lg mb-8 border shadow-sm">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {blog.title}
          </h1>
          
          {blog.excerpt && (
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {blog.excerpt}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map(tag => (
                  <Link to={`/blog?tag=${tag}`} key={tag}>
                    <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>
        
        <Separator className="my-8" />
        
        {/* Article Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:leading-relaxed prose-p:mb-6 prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-base prose-pre:bg-muted prose-pre:border prose-pre:p-6 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-lg prose-ul:my-6 prose-ol:my-6 prose-li:my-2 prose-table:border prose-table:border-collapse prose-table:my-6 prose-th:border prose-th:bg-muted prose-th:p-4 prose-th:text-left prose-th:font-semibold prose-td:border prose-td:p-4 prose-img:rounded-lg prose-img:border prose-img:shadow-md prose-img:my-6 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-em:italic">
          <ReactMarkdown
            components={{
              img: ({ node, ...props }) => (
                <img 
                  {...props} 
                  className="max-w-full h-auto rounded-lg border shadow-md my-6" 
                  loading="lazy"
                />
              ),
              code: ({ node, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                const isCodeBlock = match || className?.includes('language-');
                
                return isCodeBlock ? (
                  <code className="block bg-muted p-6 rounded-lg text-base font-mono overflow-x-auto" {...props}>
                    {children}
                  </code>
                ) : (
                  <code className="bg-muted px-2 py-1 rounded text-base font-mono" {...props}>
                    {children}
                  </code>
                );
              },
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-primary pl-6 italic my-6 text-lg text-muted-foreground" {...props} />
              ),
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-6 border rounded-lg">
                  <table className="w-full border-collapse" {...props} />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th className="border border-border bg-muted p-4 text-left font-semibold" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="border border-border p-4" {...props} />
              ),
              h1: ({ node, ...props }) => (
                <h1 className="text-3xl font-bold mt-8 mb-4 first:mt-0" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-bold mt-6 mb-3" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="leading-relaxed mb-6" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="my-6 space-y-2" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="my-6 space-y-2" {...props} />
              )
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
};

export default BlogDetailPage;
