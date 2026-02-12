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
import { useQuery } from '@tanstack/react-query';
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
      const payload = {
        ...values,
        tags: values.tags.split(',').map(t => t.trim()).filter(Boolean),
        ownerId: user.id,
      };
      if (id) {
        await api(`/api/projects/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        toast.success('Project updated successfully!');
      } else {
        await api('/api/projects', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast.success('Project submitted successfully!');
      }
      navigate(id ? `/project/${id}` : '/');
    } catch (err) {
      toast.error('Submission failed', { description: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">{id ? 'Edit Project' : 'Submit a Project'}</CardTitle>
            <CardDescription>
              {id ? 'Refine your project details and media.' : 'Share your creation with the Vanguard community.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input id="title" placeholder="e.g. Vanguard" {...register('title')} />
                  {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">Project URL</Label>
                  <Input id="url" type="url" placeholder="https://..." {...register('url')} />
                  {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" placeholder="Brief one-liner about your project" {...register('tagline')} />
                {errors.tagline && <p className="text-xs text-destructive">{errors.tagline.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us more about what it does, why you built it, and the tech stack."
                  className="min-h-[120px] resize-none"
                  {...register('description')}
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" placeholder="SaaS, DevTools, Open Source..." {...register('tags')} />
                {errors.tags && <p className="text-xs text-destructive">{errors.tags.message}</p>}
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <Label>Logo (Max 100KB)</Label>
                  {logoPreview ? (
                    <div className="relative w-24 h-24 rounded-xl border p-2 bg-background group">
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => { setLogoPreview(null); setValue('logoUrl', ''); }}
                        className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
                    </label>
                  )}
                </div>
                <div className="space-y-3">
                  <Label>Screenshot (Max 100KB)</Label>
                  {screenPreview ? (
                    <div className="relative aspect-video rounded-xl border overflow-hidden bg-background">
                      <img src={screenPreview} alt="Screenshot" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setScreenPreview(null); setValue('screenshotUrl', ''); }}
                        className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-video w-full border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-2 text-center px-4">Click to upload preview</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'screenshot')} />
                    </label>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</> : (id ? 'Update Project' : 'Submit Project')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}