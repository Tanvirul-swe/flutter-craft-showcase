
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Users, Settings, Download } from 'lucide-react';
import { useBlog } from '@/hooks/useBlog';
import { toast } from 'sonner';

const QuickActions: React.FC = () => {
  const { blogs, subscribers } = useBlog();

  const exportData = () => {
    const data = {
      blogs,
      subscribers,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blog-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully!');
  };

  const actions = [
    {
      title: 'New Blog Post',
      description: 'Create a new blog post',
      icon: Plus,
      href: '/admin/blog/new',
      variant: 'default' as const
    },
    {
      title: 'Manage Posts',
      description: 'View all blog posts',
      icon: FileText,
      href: '#posts',
      variant: 'outline' as const
    },
    {
      title: 'Subscribers',
      description: 'Manage subscribers',
      icon: Users,
      href: '#subscribers',
      variant: 'outline' as const
    }
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant={action.variant}
              className="h-auto p-4 flex flex-col items-center text-center space-y-2"
              asChild
            >
              <Link to={action.href}>
                <action.icon className="h-6 w-6" />
                <div>
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Link>
            </Button>
          ))}
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center text-center space-y-2"
            onClick={exportData}
          >
            <Download className="h-6 w-6" />
            <div>
              <div className="font-medium">Export Data</div>
              <div className="text-xs text-muted-foreground">Download backup</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
