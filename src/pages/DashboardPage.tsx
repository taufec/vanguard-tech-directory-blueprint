import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/use-auth-store';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, LayoutGrid, List, ExternalLink, Loader2, ShieldCheck } from 'lucide-react';
import type { Project } from '@shared/types';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
export function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-projects', user?.id],
    queryFn: () => api<{ items: Project[] }>(`/api/projects?ownerId=${user?.id}`),
    enabled: !!user,
  });
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api(`/api/projects/${id}`, { method: 'DELETE' });
      toast.success('Project deleted');
      refetch();
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-muted-foreground mb-4">Please sign in to access your dashboard.</p>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }
  const projects = data?.items ?? [];
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
            <p className="text-muted-foreground">Manage and monitor your submissions.</p>
          </div>
          {user.role === 'admin' && (
            <div className="flex-1 max-w-xs md:mx-6 bg-accent/50 border border-accent rounded-lg p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="font-medium">Administrator Access</span>
              </div>
              <Link to="/admin-db">
                <Button size="xs" variant="outline" className="text-[10px] h-7">Enter Admin DB</Button>
              </Link>
            </div>
          )}
          <Link to="/submit">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Submit New Project
            </Button>
          </Link>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : projects.length > 0 ? (
          <div className="border rounded-xl overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Project</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Launched</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg border bg-white p-1 overflow-hidden flex-shrink-0">
                            {p.logoUrl ? (
                              <img src={p.logoUrl} alt="" className="w-full h-full object-contain" />
                            ) : (
                              <div className="w-full h-full bg-muted" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{p.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{p.tagline}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold text-emerald-600 border-emerald-200 bg-emerald-50">
                          Active
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/project/${p.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link to={`/submit/${p.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(p.id)}
                          >
                            <Trash2 className="w-4 h-4" />
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
          <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/20">
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">Start by submitting your first tech creation.</p>
            <Link to="/submit">
              <Button>Submit Your First Project</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}