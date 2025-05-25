
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminProtected from '@/components/admin/AdminProtected';
import BlogList from '@/components/admin/BlogList';
import SubscriberList from '@/components/admin/SubscriberList';
import AdminStats from '@/components/admin/AdminStats';
import QuickActions from '@/components/admin/QuickActions';
import RecentActivity from '@/components/admin/RecentActivity';
import ManagePosts from '@/components/admin/ManagePosts';

const AdminDashboard: React.FC = () => {
  return (
    <AdminProtected>
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your blog posts, subscribers, and monitor your content performance
            </p>
          </header>
          
          <AdminStats />
          
          <QuickActions />
          
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="posts">Blog Posts</TabsTrigger>
              <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ManagePosts />
                <RecentActivity />
              </div>
            </TabsContent>
            
            <TabsContent value="posts">
              <BlogList />
            </TabsContent>
            
            <TabsContent value="subscribers">
              <SubscriberList />
            </TabsContent>
          </Tabs>
        </div>
        
        <Outlet />
      </main>
    </AdminProtected>
  );
};

export default AdminDashboard;
