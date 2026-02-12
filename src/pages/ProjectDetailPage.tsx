import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
import { ExternalLink, ArrowLeft, Loader2, Calendar, User, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Project } from '@shared/types';
export function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => api<Project>(`/api/projects/${id}`),
    enabled: !!id,
  });
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api(`/api/projects/${id}`, { method: 'DELETE' });
      toast.success('Project deleted');
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-xl font-medium text-muted-foreground">Project not found</p>
          <Link to="/">
            <Button variant="outline">Back to Directory</Button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pb-20">
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Directory
          </Link>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white border p-3 shadow-sm flex-shrink-0">
              {project.logoUrl ? (
                <img src={project.logoUrl} alt="" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-muted rounded-2xl" />
              )}
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{project.title}</h1>
                <p className="text-xl text-muted-foreground max-w-2xl">{project.tagline}</p>
              </div>
              <div className="flex flex-wrap gap-4 items-center pt-2">
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <Button className="h-11 px-8 font-bold gap-2">
                    Visit Website <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
                <Button variant="outline" className="h-11 px-6 font-medium text-destructive hover:bg-destructive/5" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8 border-t">
            <div className="lg:col-span-2 space-y-8">
              {project.screenshotUrl && (
                <div className="rounded-2xl border overflow-hidden shadow-2xl bg-muted">
                  <img src={project.screenshotUrl} alt="Preview" className="w-full object-cover" />
                </div>
              )}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">About the project</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="px-3 py-1 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground gap-3">
                    <User className="w-4 h-4" />
                    <span>Owner: <span className="text-foreground font-medium">{project.ownerId}</span></span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground gap-3">
                    <Calendar className="w-4 h-4" />
                    <span>Launched: <span className="text-foreground font-medium">{new Date(project.createdAt).toLocaleDateString()}</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}