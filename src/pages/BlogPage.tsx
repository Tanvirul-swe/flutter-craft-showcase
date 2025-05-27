import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '@/hooks/useBlog';
import { BlogPost } from '@/types/blog'; // Added missing import
import BlogCard from '@/components/blog/BlogCard';
import BlogDetailsDialog from '@/components/blog/BlogDetailsDialog';
import SubscriptionForm from '@/components/blog/SubscriptionForm';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Filter, Search, X, Lock } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 6;

const BlogPage: React.FC = () => {
  const { publishedBlogs, isLoading } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Extract all unique tags from blogs
  const allTags = Array.from(
    new Set(publishedBlogs.flatMap(blog => blog.tags))
  ).sort();

  // Filter blogs based on search term and selected tags
  const filteredBlogs = publishedBlogs.filter(blog => {
    const matchesSearch = !searchTerm || 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => blog.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setCurrentPage(1);
  };

  const handleBlogClick = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setIsDialogOpen(true);
  };

  const handleAdminPortalClick = () => {
    // Get the current domain and construct the admin URL
    const currentDomain = window.location.origin;
    const adminUrl = `${currentDomain}/admin`;
    window.open(adminUrl, '_blank', 'noopener,noreferrer');
  };

  // Generate pagination numbers
  const getPaginationItems = () => {
    const items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          isActive={currentPage === 1}
          onClick={() => setCurrentPage(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last as they're handled separately
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Show last page if more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-48 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
        <Skeleton className="h-10 w-32 mx-auto" />
      </div>
      
      {/* Search and filters skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-16" />
          ))}
        </div>
      </div>
      
      {/* Blog cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <LoadingSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Insights, tutorials, and news about Flutter development
          </p>
          
          {/* Admin Portal Link */}
          <div className="flex justify-center mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAdminPortalClick}
              className="flex items-center gap-1.5"
            >
              <Lock size={14} />
              Admin Portal
            </Button>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search posts..." 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when search changes
                }}
                className="pl-10"
              />
            </div>
            {(searchTerm || selectedTags.length > 0) && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
          
          {allTags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge 
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Blog Posts */}
        {paginatedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedBlogs.map((blog) => (
              <BlogCard 
                key={blog.id} 
                blog={blog} 
                onClick={() => handleBlogClick(blog)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedTags.length > 0
                ? "Try changing your search criteria or clearing filters"
                : "Check back soon for new content"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredBlogs.length > ITEMS_PER_PAGE && (
          <Pagination className="my-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }} 
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {getPaginationItems()}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }} 
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        <Separator className="my-12" />
        
        {/* Subscription Form */}
        <SubscriptionForm />
      </div>
      
      {/* Blog Details Dialog */}
      <BlogDetailsDialog 
        blog={selectedBlog} 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </main>
  );
};

export default BlogPage;
