import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/use-auth-store';
import { Upload, X, Loader2, ArrowLeft } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Project } from '@shared/types';
const schema = z.object({
  title: z.string().min(2, 'Title is too short').max(50),
  tagline: z.string().min(10, 'Tagline is too short').max(100),
  url: z.string().url('Invalid URL'),
  description: z.string().min(50, 'Please provide a more detailed description'),
  tags: z.string().min(1, 'At least one tag is required'),
  logoUrl: z.string().optional(),
  screenshotUrl: z.string().optional(),
});
type FormInput = z.infer<typeof schema>;
export function SubmitPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore(s => s.user);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const [screenPreview, setScreenPreview] = React.useState<string | null>(null);
  const { data: project } = useQuery({
    queryKey: ['project', id],
    queryFn: () => api<Project>(`/api/projects/${id}`),
    enabled: !!id,
  });
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      tagline: '',
      url: '',
      description: '',
      tags: '',
      logoUrl: '',
      screenshotUrl: '',
    }
  });
  React.useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        tagline: project.tagline,
        url: project.url,
        description: project.description,
        tags: project.tags.join(', '),
        logoUrl: project.logoUrl,
        screenshotUrl: project.screenshotUrl,
      });
      if (project.logoUrl) setLogoPreview(project.logoUrl);
      if (project.screenshotUrl) setScreenPreview(project.screenshotUrl);
    }
  }, [project, reset]);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'screenshot') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024) {
      toast.error('File too large', { description: 'Max size is 100KB' });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (type === 'logo') {
        setLogoPreview(base64);
        setValue('logoUrl', base64);
      } else {
        setScreenPreview(base64);
        setValue('screenshotUrl', base64);
      }
    };
    reader.readAsDataURL(file);
  };
  const onSubmit = async (values: FormInput) => {
    if (!user) {
      toast.error('Please sign in to submit a project');
      return;
    }
    setIsSubmitting(true);
    try {
      // Graceful tag processing
      const processedTags = values.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);
      const payload = {
        ...values,
        tags: processedTags,
        ownerId: id ? undefined : user.id, // Backend protects ownerId on PUT anyway, but we omit it here for clarity
      };
      if (id) {
        await api(`/api/projects/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        toast.success('Changes saved', { description: 'Project updated successfully.' });
        await queryClient.invalidateQueries({ queryKey: ['project', id] });
      } else {
        const created = await api<Project>('/api/projects', {
          method: 'POST',
          body: JSON.stringify({ ...payload, ownerId: user.id }),
        });
        toast.success('Project launched!', { description: 'Your submission is now live.' });
        // After creation, navigate to the specific project page
        navigate(`/project/${created.id}`);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate(`/project/${id}`);
    } catch (err) {
      toast.error('Submission failed', { description: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 flex flex-col items-center">
          <div className="w-full max-w-3xl">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <Card className="border-border/50 shadow-sm overflow-hidden rounded-[2rem]">
              <CardHeader className="bg-background border-b px-8 py-8">
                <CardTitle className="text-3xl font-display font-bold">{id ? 'Edit Project' : 'Submit a Project'}</CardTitle>
                <CardDescription className="text-base">
                  {id ? 'Refine your project details and media assets.' : 'Share your creation with the Vanguard ecosystem.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="font-bold">Project Title</Label>
                      <Input id="title" className="h-12 rounded-xl" placeholder="e.g. Vanguard" {...register('title')} />
                      {errors.title && <p className="text-xs text-destructive font-medium">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="url" className="font-bold">Project URL</Label>
                      <Input id="url" type="url" className="h-12 rounded-xl" placeholder="https://..." {...register('url')} />
                      {errors.url && <p className="text-xs text-destructive font-medium">{errors.url.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline" className="font-bold">Tagline</Label>
                    <Input id="tagline" className="h-12 rounded-xl" placeholder="A brief one-liner summary" {...register('tagline')} />
                    {errors.tagline && <p className="text-xs text-destructive font-medium">{errors.tagline.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-bold">Detailed Description</Label>
                    <div className="relative">
                      <Textarea
                        id="description"
                        placeholder="What problem does it solve? What is the tech stack?"
                        className="min-h-[160px] resize-none rounded-xl p-4"
                        {...register('description')}
                      />
                    </div>
                    {errors.description && <p className="text-xs text-destructive font-medium">{errors.description.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="font-bold">Tags (comma separated)</Label>
                    <Input id="tags" className="h-12 rounded-xl" placeholder="SaaS, DevTools, AI..." {...register('tags')} />
                    {errors.tags && <p className="text-xs text-destructive font-medium">{errors.tags.message}</p>}
                  </div>
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div className="space-y-3">
                      <Label className="font-bold">Brand Logo</Label>
                      {logoPreview ? (
                        <div className="relative w-28 h-28 rounded-2xl border p-3 bg-background group shadow-sm">
                          <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => { setLogoPreview(null); setValue('logoUrl', ''); }}
                            className="absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-lg"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-muted/50 transition-all border-muted-foreground/20">
                          <Upload className="w-7 h-7 text-muted-foreground/50" />
                          <span className="text-[10px] font-bold text-muted-foreground mt-2 uppercase">Upload</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
                        </label>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label className="font-bold">Cover Screenshot</Label>
                      {screenPreview ? (
                        <div className="relative aspect-video rounded-2xl border overflow-hidden bg-background shadow-sm group">
                          <img src={screenPreview} alt="Screenshot" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => { setScreenPreview(null); setValue('screenshotUrl', ''); }}
                            className="absolute top-3 right-3 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-lg"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center aspect-video w-full border-2 border-dashed rounded-2xl cursor-pointer hover:bg-muted/50 transition-all border-muted-foreground/20">
                          <Upload className="w-8 h-8 text-muted-foreground/50" />
                          <span className="text-xs font-bold text-muted-foreground mt-2 uppercase">Upload Preview Image</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'screenshot')} />
                        </label>
                      )}
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/10 transition-all" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Finalizing Submission...</>
                    ) : (
                      id ? 'Update Project' : 'Launch Project'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}