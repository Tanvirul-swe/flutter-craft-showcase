
import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBlog } from '@/hooks/useBlog';
import { Edit, Eye, Trash2, Plus } from 'lucide-react';

const BlogList: React.FC = () => {
  const { blogs, removeBlog } = useBlog();
  
  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      removeBlog(id);
      toast.success('Blog post deleted successfully');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <Button asChild>
          <Link to="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>
      
      {blogs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">No blog posts found</p>
          <Button asChild>
            <Link to="/admin/blog/new">Create your first blog post</Link>
          </Button>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {blog.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant={blog.published ? "default" : "outline"}>
                      {blog.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(blog.createdAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(blog.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link to={`/admin/blog/${blog.slug}`} title="Edit">
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      {blog.published && (
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/blog/${blog.slug}`} title="View">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDelete(blog.id, blog.title)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BlogList;
