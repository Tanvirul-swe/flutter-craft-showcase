
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X, Calendar } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import ReactMarkdown from 'react-markdown';
import { Separator } from '@/components/ui/separator';

interface BlogDetailsDialogProps {
  blog: BlogPost | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const BlogDetailsDialog: React.FC<BlogDetailsDialogProps> = ({ blog, isOpen, onOpenChange }) => {
  if (!blog) return null;

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-20 bg-background/80 backdrop-blur-sm p-1">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        {/* Header Section */}
        <div className="flex-shrink-0 p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-bold pr-8 mb-3">
              {blog.title}
            </DialogTitle>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1.5 h-4 w-4" />
                {formattedDate}
              </span>
              {blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {blog.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </DialogHeader>
          
          {blog.excerpt && (
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              {blog.excerpt}
            </p>
          )}
        </div>

        <Separator />
        
        {/* Content Section */}
        <div className="flex-1 overflow-y-auto">
          {/* Cover Image */}
          {blog.coverImage && (
            <div className="px-6 pt-4">
              <div className="aspect-video w-full overflow-hidden rounded-lg border">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          )}
          
          {/* Article Content */}
          <div className="p-6">
            <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-p:mb-4 prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-muted prose-pre:border prose-pre:p-4 prose-pre:rounded-lg prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-ul:my-4 prose-ol:my-4 prose-li:my-1 prose-table:border prose-table:border-collapse prose-th:border prose-th:bg-muted prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-td:border prose-td:p-3 prose-img:rounded-lg prose-img:border prose-img:shadow-sm prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold">
              <ReactMarkdown
                components={{
                  img: ({ node, ...props }) => (
                    <img 
                      {...props} 
                      className="max-w-full h-auto rounded-lg border shadow-sm my-4" 
                      loading="lazy"
                    />
                  ),
                  code: ({ node, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const isCodeBlock = match || className?.includes('language-');
                    
                    return isCodeBlock ? (
                      <code className="block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground" {...props} />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="w-full border-collapse border border-border" {...props} />
                    </div>
                  ),
                  th: ({ node, ...props }) => (
                    <th className="border border-border bg-muted p-3 text-left font-semibold" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="border border-border p-3" {...props} />
                  )
                }}
              >
                {blog.content}
              </ReactMarkdown>
            </article>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogDetailsDialog;
