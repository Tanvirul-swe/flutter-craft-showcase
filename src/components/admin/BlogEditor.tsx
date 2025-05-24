
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBlog } from '@/hooks/useBlog';
import { generateSlug } from '@/utils/blogService';
import { Save, SendHorizonal, Eye, Code } from 'lucide-react';

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
  const [editorTab, setEditorTab] = useState<'edit' | 'preview'>('edit');
  
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
    if (slug) {
      const blog = getBlog(slug);
      if (blog) {
        form.reset({
          title: blog.title,
          content: blog.content,
          excerpt: blog.excerpt,
          coverImage: blog.coverImage || '',
          tags: blog.tags.join(', '),
        });
      }
    }
  }, [slug, getBlog, form]);

  const onSubmit = async (values: FormValues, publish: boolean = false) => {
    setIsSubmitting(true);
    try {
      const existingBlog = slug ? getBlog(slug) : undefined;
      
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
  
  const contentValue = form.watch('content');

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-border/40">
      <CardHeader className="bg-card/50">
        <CardTitle className="text-xl">{slug ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => onSubmit(values, false))} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Blog post title" className="border-input/60" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" className="border-input/60" {...field} />
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
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="flutter, mobile, development" className="border-input/60" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter tags separated by commas
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
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="A brief summary of your blog post (optional)" 
                      className="min-h-20 border-input/60"
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

            <div className="space-y-2">
              <FormLabel>Content</FormLabel>
              <Tabs value={editorTab} onValueChange={(value) => setEditorTab(value as 'edit' | 'preview')}>
                <TabsList className="mb-2">
                  <TabsTrigger value="edit" className="flex items-center gap-1">
                    <Code className="h-4 w-4" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="edit" className="mt-0">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your blog post content here using markdown formatting..." 
                            className="min-h-[300px] border-input/60 font-mono"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Use Markdown syntax for formatting: **bold**, *italic*, # Heading, - List items, etc.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="preview" className="mt-0">
                  <div className="border rounded-md p-4 min-h-[300px] bg-white dark:bg-black/20">
                    <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                      {contentValue ? (
                        <ReactMarkdown>{contentValue}</ReactMarkdown>
                      ) : (
                        <p className="text-muted-foreground">Nothing to preview yet. Start writing in the Edit tab.</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <Separator className="my-4" />

            <div className="flex justify-end gap-2">
              <Button type="submit" variant="outline" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button type="button" onClick={handlePublish} disabled={isSubmitting}>
                <SendHorizonal className="mr-2 h-4 w-4" />
                {slug ? 'Update & Publish' : 'Publish'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BlogEditor;
