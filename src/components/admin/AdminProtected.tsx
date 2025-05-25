
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Lock, User, Key, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminProtectedProps {
  children: React.ReactNode;
}

const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = () => {
      const adminSession = localStorage.getItem('admin_session');
      if (adminSession) {
        try {
          const session = JSON.parse(adminSession);
          const now = new Date().getTime();
          // Check if session is still valid (24 hours)
          if (session.expires > now) {
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          } else {
            // Session expired, remove it
            localStorage.removeItem('admin_session');
          }
        } catch (error) {
          // Invalid session data, remove it
          localStorage.removeItem('admin_session');
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Check if the username and password match an admin user
      const { data: admins, error } = await supabase
        .from('admins')
        .select('username, password_hash')
        .eq('username', username)
        .single();
      
      if (error) {
        throw error;
      }
      
      // Simple password comparison (in a production app, you should use proper hashing)
      if (admins && admins.password_hash === password) {
        // Create session with 24-hour expiry
        const sessionData = {
          username: username,
          loginTime: new Date().getTime(),
          expires: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        localStorage.setItem('admin_session', JSON.stringify(sessionData));
        setIsAuthenticated(true);
        toast.success('Successfully logged in as admin');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('Invalid username or password');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    toast.success('Successfully logged out');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gradient-to-b from-background to-muted/20">
        <div className="w-full max-w-md px-4">
          <Card className="shadow-lg border-t-4 border-t-primary">
            <CardHeader className="space-y-4">
              <div className="mx-auto bg-primary/10 p-3 rounded-full">
                <ShieldCheck className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2 text-center">
                <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
                <CardDescription>
                  Please enter your credentials to access the admin dashboard
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      type="text" 
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      type="password" 
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  
                  {error && (
                    <div className="bg-destructive/10 text-destructive rounded p-2 text-sm text-center">
                      {error}
                    </div>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <Lock className="mr-2 h-4 w-4" />
                  {isLoading ? 'Authenticating...' : 'Login to Admin'}
                </Button>
              </form>
            </CardContent>
            <Separator />
            <CardFooter className="text-center text-xs text-muted-foreground pt-4">
              Secure admin area • {new Date().getFullYear()}
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Admin Header with Logout */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-semibold">Admin Panel</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default AdminProtected;
