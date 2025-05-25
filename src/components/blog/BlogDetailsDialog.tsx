
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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-2xl font-bold pr-8">{blog.title}</DialogTitle>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-3.5 w-3.5" />
              {formattedDate}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {blog.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          {blog.coverImage && (
            <div className="aspect-video w-full overflow-hidden rounded-md">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogDetailsDialog;
