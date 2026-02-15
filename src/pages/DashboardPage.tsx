import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/use-auth-store';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, ExternalLink, Loader2, ShieldCheck, Sparkles, LogIn } from 'lucide-react';
import type { Project, User } from '@shared/types';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
const MOCK_ADMIN_USER: User = {
  id: 'u1',
  name: 'Admin Demo',
  email: 'admin@vanguard.tech',
  role: 'admin',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
};
export function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Zustand Zero-Tolerance: Primitive selectors only
  const userId = useAuthStore(s => s.user?.id);
  const userRole = useAuthStore(s => s.user?.role);
  const login = useAuthStore(s => s.login);
  const { data, isLoading } = useQuery({
    queryKey: ['my-projects', userId],
    queryFn: () => api<{ items: Project[] }>(`/api/projects?ownerId=${userId}`),
    enabled: !!userId,
  });
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this project listing?')) return;
    try {
      await api(`/api/projects/${id}`, { method: 'DELETE' });
      toast.success('Project deleted from directory');
      // Invalidate both lists to ensure global consistency
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['my-projects', userId] }),
        queryClient.invalidateQueries({ queryKey: ['projects'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-projects'] })
      ]);
    } catch (err) {
      toast.error('Deletion failed', { description: 'The server could not process the request.' });
    }
  };
  const handleDemoLogin = () => {
    login(MOCK_ADMIN_USER);
    toast.success('Signed in', { description: 'Access granted to Creator Dashboard.' });
  };
  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-muted/20">
        <div className="bg-background p-10 rounded-[2.5rem] border shadow-2xl text-center space-y-6 max-w-sm w-full">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold">Access Required</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">Please sign in to manage your featured projects and view community feedback.</p>
          </div>
          <div className="space-y-3 pt-4">
            <Button onClick={handleDemoLogin} className="w-full h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
              <LogIn className="w-4 h-4" />
              Sign In (Demo Admin)
            </Button>
            <Button onClick={() => navigate('/')} variant="ghost" className="w-full h-12 rounded-xl font-medium">
              Return to Directory
            </Button>
          </div>
        </div>
      </div>
    );
  }
  const projects = data?.items ?? [];
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Creator Workspace</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">My Submissions</h1>
            <p className="text-muted-foreground text-lg">Manage, edit, and track the performance of your listings.</p>
          </div>
          <div className="flex items-center gap-4">
            {userRole === 'admin' && (
              <Link to="/admin-db">
                <Button variant="outline" className="gap-2 h-11 px-6 rounded-xl border-primary/20 hover:border-primary hover:bg-primary/5 text-primary transition-all">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Database</span>
                </Button>
              </Link>
            )}
            <Link to="/submit">
              <Button className="gap-2 h-11 px-6 rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-95">
                <Plus className="w-4 h-4" /> Submit Project
              </Button>
            </Link>
          </div>
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary/30" />
            <p className="text-sm font-medium text-muted-foreground">Refreshing workspace data...</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="border rounded-[2rem] overflow-hidden bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 border-b">
                  <tr>
                    <th className="px-8 py-6 font-bold text-foreground">Project Identity</th>
                    <th className="px-8 py-6 font-bold text-foreground">Status</th>
                    <th className="px-8 py-6 font-bold text-foreground">Launch Date</th>
                    <th className="px-8 py-6 font-bold text-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-border/50">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/10 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl border bg-white p-2 overflow-hidden flex-shrink-0 shadow-sm transition-transform group-hover:scale-105">
                            {p.logoUrl ? (
                              <img src={p.logoUrl} alt="" className="w-full h-full object-contain" />
                            ) : (
                              <div className="w-full h-full bg-muted rounded-md" />
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <div className="font-bold text-base text-foreground group-hover:text-primary transition-colors">{p.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1 max-w-[280px] font-medium">{p.tagline}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 border-emerald-200/50 bg-emerald-50 px-3 py-1 rounded-full">
                          Live & Public
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-muted-foreground font-semibold">
                        {new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link to={`/project/${p.id}`}>
                            <Button variant="ghost" size="icon" title="View Public Page" className="h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted">
                              <ExternalLink className="w-5 h-5" />
                            </Button>
                          </Link>
                          <Link to={`/submit/${p.id}`}>
                            <Button variant="ghost" size="icon" title="Edit Listing" className="h-10 w-10 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5">
                              <Edit className="w-5 h-5" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Remove Listing"
                            className="h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                            onClick={() => handleDelete(p.id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-32 border-2 border-dashed rounded-[3rem] bg-muted/10 px-6 max-w-3xl mx-auto space-y-8">
            <div className="space-y-3">
              <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-3xl font-display font-bold">No active projects</h3>
              <p className="text-muted-foreground text-lg max-w-sm mx-auto">Your dashboard is currently empty. Start your journey by showcasing your first creation.</p>
            </div>
            <Link to="/submit">
              <Button className="h-14 px-10 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-transform active:scale-95">
                Feature Your First Project
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}