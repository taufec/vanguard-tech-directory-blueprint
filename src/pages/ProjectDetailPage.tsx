import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
import { ExternalLink, ArrowLeft, Loader2, Calendar, User, Trash2, Edit, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore, checkProjectAccess } from '@/store/use-auth-store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import type { Project } from '@shared/types';
export function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore(s => s.user);
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => api<Project>(`/api/projects/${id}`),
    enabled: !!id,
  });
  const voteMutation = useMutation({
    mutationFn: () => api<Project>(`/api/projects/${id}/vote`, { method: 'POST' }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['project', id] });
      const previousProject = queryClient.getQueryData<Project>(['project', id]);
      if (previousProject) {
        queryClient.setQueryData(['project', id], {
          ...previousProject,
          votes: (previousProject.votes || 0) + 1,
        });
      }
      return { previousProject };
    },
    onError: (err, _, context) => {
      if (context?.previousProject) {
        queryClient.setQueryData(['project', id], context.previousProject);
      }
      toast.error('Failed to register vote');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onSuccess: () => {
      toast.success('Thanks for voting!');
    }
  });
  const canManage = React.useMemo(() =>
    project ? checkProjectAccess(currentUser, project.ownerId) : false
  , [project, currentUser]);
  const handleDelete = async () => {
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
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-12">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Directory
          </Link>
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-3xl bg-white border border-border/50 p-4 shadow-xl flex-shrink-0 flex items-center justify-center">
              {project.logoUrl ? (
                <img src={project.logoUrl} alt="" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-muted rounded-2xl" />
              )}
            </div>
            <div className="flex-1 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">{project.title}</h1>
                  {canManage && (
                    <Badge variant="outline" className="uppercase text-[10px] text-primary border-primary font-bold">Owner</Badge>
                  )}
                </div>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">{project.tagline}</p>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <Button className="h-12 px-10 font-bold gap-2 text-lg shadow-primary">
                    Visit Website <ExternalLink className="w-5 h-5" />
                  </Button>
                </a>
                <Button 
                  onClick={() => voteMutation.mutate()}
                  disabled={voteMutation.isPending}
                  variant="outline" 
                  className="h-12 px-6 font-bold border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all gap-2"
                >
                  <ChevronUp className="w-6 h-6 text-primary" />
                  <span className="text-lg">{project.votes || 0}</span>
                </Button>
                {canManage && (
                  <div className="flex items-center gap-3">
                    <Link to={`/submit/${project.id}`}>
                      <Button variant="outline" className="h-12 px-6 font-semibold">
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="h-12 px-6 font-semibold text-destructive hover:bg-destructive/5 hover:text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your project
                            listing from our directory.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete Project
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 pt-12 border-t border-border/50">
            <div className="lg:col-span-2 space-y-12">
              {project.screenshotUrl && (
                <div className="rounded-3xl border border-border/50 overflow-hidden shadow-2xl bg-muted/30">
                  <img src={project.screenshotUrl} alt="Preview" className="w-full object-cover aspect-[16/10]" />
                </div>
              )}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">About the project</h2>
                <div className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap max-w-none prose prose-neutral dark:prose-invert">
                  {project.description}
                </div>
              </div>
            </div>
            <div className="space-y-10">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/80">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="px-4 py-1.5 text-xs font-semibold bg-primary/5 hover:bg-primary/10 transition-colors">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/80">Details</h3>
                <div className="space-y-5">
                  <div className="flex items-center text-sm text-muted-foreground gap-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span>Owner: <span className="text-foreground font-semibold ml-1">{project.ownerId}</span></span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground gap-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span>Launched: <span className="text-foreground font-semibold ml-1">{new Date(project.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span></span>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-primary/[0.02] border border-primary/10 space-y-4">
                <h4 className="font-bold">Support this project</h4>
                <p className="text-sm text-muted-foreground">Sharing this project helps the creator grow their reach. Use the link below to share.</p>
                <Button variant="outline" className="w-full" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }}>
                  Copy Project Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}