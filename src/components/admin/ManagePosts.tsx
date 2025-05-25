
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useBlog } from '@/hooks/useBlog';
import { Edit, Eye, Trash2, Plus, Search, Calendar, FileText } from 'lucide-react';

const ManagePosts: React.FC = () => {
  const { blogs, removeBlog } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [blogToDelete, setBlogToDelete] = useState<{ id: string, title: string } | null>(null);

  // Filter blogs based on search term
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteConfirm = () => {
    if (blogToDelete) {
      removeBlog(blogToDelete.id);
      toast.success('Blog post deleted successfully');
      setBlogToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Show only the most recent 5 posts for dashboard
  const recentBlogs = filteredBlogs.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Manage Posts</CardTitle>
          </div>
          <Button asChild>
            <Link to="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts by title or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" asChild>
            <Link to="#posts">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentBlogs.length === 0 ? (
          <div className="text-center py-8">
            {searchTerm ? (
              <p className="text-muted-foreground">No posts found matching "{searchTerm}"</p>
            ) : (
              <>
                <p className="text-muted-foreground mb-4">No blog posts found</p>
                <Button asChild>
                  <Link to="/admin/blog/new">Create your first blog post</Link>
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {recentBlogs.map((blog) => (
              <div key={blog.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{blog.title}</h4>
                    <Badge variant={blog.published ? "default" : "outline"}>
                      {blog.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created {formatDate(blog.createdAt)}
                    </div>
                    {blog.tags.length > 0 && (
                      <div className="flex gap-1">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="bg-muted px-2 py-0.5 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="text-xs">+{blog.tags.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/blog/${blog.slug}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  {blog.published && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/blog/${blog.slug}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setBlogToDelete({ id: blog.id, title: blog.title })}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredBlogs.length > 5 && (
              <div className="text-center pt-4 border-t">
                <Button variant="outline" asChild>
                  <Link to="#posts">
                    View all {filteredBlogs.length} posts
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!blogToDelete} onOpenChange={(open) => !open && setBlogToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{blogToDelete?.title}" and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default ManagePosts;
