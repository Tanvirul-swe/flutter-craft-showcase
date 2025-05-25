
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useBlog } from '@/hooks/useBlog';
import { generateSlug } from '@/utils/blogService';
import { Save, SendHorizonal, ArrowLeft, Eye } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { Link } from 'react-router-dom';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  content: z.string().min(50, { message: 'Content must be at least 50 characters.' }),
  excerpt: z.string().optional(),
  coverImage: z.string().url({ message: 'Must be a valid URL' }).optional().or(z.literal('')),
  tags: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const BlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { getBlog, upsertBlog } = useBlog();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const existingBlog = slug ? getBlog(slug) : undefined;
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      coverImage: '',
      tags: '',
    },
  });

  // Load existing blog if editing
  useEffect(() => {
    if (existingBlog) {
      form.reset({
        title: existingBlog.title,
        content: existingBlog.content,
        excerpt: existingBlog.excerpt,
        coverImage: existingBlog.coverImage || '',
        tags: existingBlog.tags.join(', '),
      });
    }
  }, [existingBlog, form]);

  const onSubmit = async (values: FormValues, publish: boolean = false) => {
    setIsSubmitting(true);
    try {
      const blogToSave = {
        id: existingBlog?.id,
        title: values.title,
        content: values.content,
        excerpt: values.excerpt || values.content.substring(0, 150) + '...',
        coverImage: values.coverImage || undefined,
        tags: values.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        slug: existingBlog?.slug || generateSlug(values.title),
        published: existingBlog?.published || publish,
        createdAt: existingBlog?.createdAt,
      };

      const savedBlog = await upsertBlog(blogToSave, publish);
      
      toast.success(publish ? 'Blog published successfully!' : 'Blog saved as draft!');
      if (!slug) {
        navigate(`/admin/blog/${savedBlog.slug}`);
      }
    } catch (error) {
      toast.error('Failed to save blog post');
      console.error('Blog save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = () => {
    form.handleSubmit((values) => onSubmit(values, true))();
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          {existingBlog && (
            <div className="flex items-center gap-2">
              <Badge variant={existingBlog.published ? "default" : "outline"}>
                {existingBlog.published ? "Published" : "Draft"}
              </Badge>
              {existingBlog.published && (
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/blog/${existingBlog.slug}`}>
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <Card className="shadow-lg border-border/40">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardTitle className="text-2xl flex items-center gap-2">
            {slug ? '✏️ Edit Blog Post' : '📝 Create New Blog Post'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => onSubmit(values, false))} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Title *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter an engaging blog title" 
                          className="h-12 text-lg" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Tags</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="flutter, mobile, development" 
                          className="h-12" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Enter tags separated by commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Cover Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        className="h-12" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a URL for the blog post cover image (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Excerpt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="A brief summary of your blog post (optional)" 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      If left blank, an excerpt will be generated from the content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Content *</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Write your blog post content here using markdown formatting..."
                      />
                    </FormControl>
                    <FormDescription>
                      Use the toolbar for formatting or write Markdown directly. Switch to preview to see how your content will look.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Separator className="my-6" />

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="submit" 
                  variant="outline" 
                  disabled={isSubmitting}
                  className="px-6"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </Button>
                <Button 
                  type="button" 
                  onClick={handlePublish} 
                  disabled={isSubmitting}
                  className="px-6"
                >
                  <SendHorizonal className="mr-2 h-4 w-4" />
                  {slug ? 'Update & Publish' : 'Publish'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogEditor;
