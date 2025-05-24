
import React, { useState } from 'react';
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
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useBlog } from '@/hooks/useBlog';
import { Edit, Eye, Trash2, Plus, Calendar } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const BlogList: React.FC = () => {
  const { blogs, removeBlog } = useBlog();
  const [currentPage, setCurrentPage] = useState(1);
  const [blogToDelete, setBlogToDelete] = useState<{ id: string, title: string } | null>(null);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(blogs.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBlogs = blogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
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

  return (
    <div className="space-y-6">
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
        <div className="text-center py-10 bg-muted/20 rounded-lg border">
          <p className="text-muted-foreground mb-4">No blog posts found</p>
          <Button asChild>
            <Link to="/admin/blog/new">Create your first blog post</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Created
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Updated
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBlogs.map((blog) => (
                  <TableRow key={blog.id} className="hover:bg-muted/30">
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
                        <Button variant="outline" size="icon" asChild title="Edit">
                          <Link to={`/admin/blog/${blog.slug}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        {blog.published && (
                          <Button variant="outline" size="icon" asChild title="View">
                            <Link to={`/blog/${blog.slug}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setBlogToDelete({ id: blog.id, title: blog.title })}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {currentPage > 2 && (
                  <>
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
                    </PaginationItem>
                    {currentPage > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </>
                )}

                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationLink onClick={() => setCurrentPage(currentPage - 1)}>
                      {currentPage - 1}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationLink isActive>{currentPage}</PaginationLink>
                </PaginationItem>

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationLink onClick={() => setCurrentPage(currentPage + 1)}>
                      {currentPage + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}

                {currentPage < totalPages - 1 && (
                  <>
                    {currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
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
    </div>
  );
};

export default BlogList;
