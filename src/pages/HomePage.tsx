import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProjectCard } from '@/components/ProjectCard';
import { Navbar } from '@/components/layout/Navbar';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Project } from '@shared/types';
export function HomePage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api<{ items: Project[] }>('/api/projects'),
  });
  const projects = data?.items ?? [];
  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Hero Section */}
          <div className="text-center space-y-8 mb-16">
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
              The next generation of <span className="text-primary">tech</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Discover and showcase the finest tools, apps, and platforms built by creators around the globe.
            </p>
            <div className="max-w-xl mx-auto relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input 
                placeholder="Search projects, tags, or tools..." 
                className="pl-11 h-12 bg-secondary/50 border-border/50 focus:bg-background transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {/* Grid Section */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground font-medium">Loading directory...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive font-medium">Failed to load projects. Please try again later.</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 space-y-3">
              <p className="text-xl font-medium">No projects found</p>
              <p className="text-muted-foreground">Try adjusting your search query.</p>
            </div>
          )}
        </div>
      </main>
      <footer className="border-t py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Vanguard Directory. Built for the modern web.</p>
        </div>
      </footer>
    </div>
  );
}