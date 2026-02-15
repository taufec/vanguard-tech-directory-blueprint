import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/use-auth-store';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, ExternalLink, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import type { Project } from '@shared/types';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
export function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-projects', user?.id],
    queryFn: () => api<{ items: Project[] }>(`/api/projects?ownerId=${user?.id}`),
    enabled: !!user,
  });
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    try {
      await api(`/api/projects/${id}`, { method: 'DELETE' });
      toast.success('Project Deleted');
      refetch();
    } catch (err) {
      toast.error('Failed to Delete Project');
    }
  };
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-muted/20">
        <div className="bg-background p-10 rounded-[2rem] border shadow-xl text-center space-y-6 max-w-sm">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">Please sign in to access your creator dashboard.</p>
          <Button onClick={() => navigate('/')} className="w-full h-12 rounded-xl">Return to Directory</Button>
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
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">Creator Dashboard</h1>
            <p className="text-muted-foreground text-lg">Manage and monitor your tech submissions.</p>
          </div>
          <div className="flex items-center gap-4">
            {user.role === 'admin' && (
              <Link to="/admin-db">
                <Button variant="outline" className="gap-2 h-11 px-6 rounded-xl border-primary/20 hover:border-primary hover:bg-primary/5 text-primary transition-all">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Database</span>
                </Button>
              </Link>
            )}
            <Link to="/submit">
              <Button className="gap-2 h-11 px-6 rounded-xl shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" /> Submit Project
              </Button>
            </Link>
          </div>
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary/30" />
            <p className="text-sm font-medium text-muted-foreground">Loading your workspace...</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="border rounded-[2rem] overflow-hidden bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 border-b">
                  <tr>
                    <th className="px-8 py-5 font-bold text-foreground">Project Name</th>
                    <th className="px-8 py-5 font-bold text-foreground">Visibility</th>
                    <th className="px-8 py-5 font-bold text-foreground">Launch Date</th>
                    <th className="px-8 py-5 font-bold text-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-border/50">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/10 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl border bg-white p-1.5 overflow-hidden flex-shrink-0 shadow-sm transition-transform group-hover:scale-105">
                            {p.logoUrl ? (
                              <img src={p.logoUrl} alt="" className="w-full h-full object-contain" />
                            ) : (
                              <div className="w-full h-full bg-muted rounded-md" />
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <div className="font-bold text-base text-foreground group-hover:text-primary transition-colors">{p.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1 max-w-[250px]">{p.tagline}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 border-emerald-200/50 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Live & Public
                        </Badge>
                      </td>
                      <td className="px-8 py-5 text-muted-foreground font-medium">
                        {new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link to={`/project/${p.id}`}>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted">
                              <ExternalLink className="w-4.5 h-4.5" />
                            </Button>
                          </Link>
                          <Link to={`/submit/${p.id}`}>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5">
                              <Edit className="w-4.5 h-4.5" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                            onClick={() => handleDelete(p.id)}
                          >
                            <Trash2 className="w-4.5 h-4.5" />
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
          <div className="text-center py-32 border-2 border-dashed rounded-[2.5rem] bg-muted/10 px-6 max-w-3xl mx-auto space-y-8">
            <div className="space-y-3">
              <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-display font-bold">No active projects</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">You haven't submitted any projects yet. Share your creation and start building your presence.</p>
            </div>
            <Link to="/submit">
              <Button className="h-12 px-10 rounded-xl font-bold text-lg shadow-lg shadow-primary/20">
                Launch Your First Project
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}