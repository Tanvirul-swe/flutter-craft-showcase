
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBlog } from '@/hooks/useBlog';
import { FileText, Users, Eye, Calendar } from 'lucide-react';

const AdminStats: React.FC = () => {
  const { blogs, publishedBlogs, subscribers } = useBlog();

  const stats = [
    {
      title: 'Total Posts',
      value: blogs.length,
      icon: FileText,
      description: 'All blog posts',
      color: 'text-blue-600'
    },
    {
      title: 'Published',
      value: publishedBlogs.length,
      icon: Eye,
      description: 'Live blog posts',
      color: 'text-green-600'
    },
    {
      title: 'Drafts',
      value: blogs.length - publishedBlogs.length,
      icon: Calendar,
      description: 'Unpublished posts',
      color: 'text-yellow-600'
    },
    {
      title: 'Subscribers',
      value: subscribers.length,
      icon: Users,
      description: 'Email subscribers',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
