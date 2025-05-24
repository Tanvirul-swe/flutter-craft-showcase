
import React, { useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  return <>{children}</>;
};

export default AdminProtected;
