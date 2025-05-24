
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from '@/types/blog';
import { Calendar } from 'lucide-react';

interface BlogCardProps {
  blog: BlogPost;
  onClick?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onClick }) => {
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md cursor-pointer" onClick={onClick}>
      <div className="flex flex-col flex-1">
        {blog.coverImage && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img 
              src={blog.coverImage} 
              alt={blog.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}
        <CardHeader className={blog.coverImage ? 'pt-3' : ''}>
          <CardTitle className="line-clamp-2 hover:text-flutter-blue transition-colors">
            {blog.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-muted-foreground line-clamp-3">{blog.excerpt}</p>
        </CardContent>
        <CardFooter className="flex justify-between pt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {blog.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {blog.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{blog.tags.length - 2}
              </Badge>
            )}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default BlogCard;
