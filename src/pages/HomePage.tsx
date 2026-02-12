import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProjectCard } from '@/components/ProjectCard';
import { Navbar } from '@/components/layout/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Plus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api-client';
import type { Project } from '@shared/types';
import { cn } from '@/lib/utils';
const CATEGORIES = ['All', 'SaaS', 'DevTools', 'Web3', 'Design', 'Analytics', 'Productivity', 'Infrastructure'];
export function HomePage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api<{ items: Project[] }>('/api/projects'),
  });
  const projects = data?.items ?? [];
  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = 
      selectedCategory === 'All' || 
      p.tags.some(t => t.toLowerCase() === selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Hero Section */}
          <div className="text-center space-y-8 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3 h-3" />
              <span>Curated Directory</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
              The next generation of <span className="text-primary">tech</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Discover and showcase the finest tools, apps, and platforms built by creators around the globe.
            </p>
            <div className="max-w-xl mx-auto relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                ref={searchInputRef}
                placeholder="Search projects, tags, or tools..."
                className="pl-11 h-12 bg-secondary/50 border-border/50 focus:bg-background transition-all shadow-sm focus:shadow-md rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {/* Category Tabs */}
          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full px-5 py-2 h-auto text-sm font-medium transition-all shrink-0",
                  selectedCategory === category ? "shadow-md scale-105" : "text-muted-foreground border-border/50 hover:bg-muted/50"
                )}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          {/* Grid Section */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
              <p className="text-muted-foreground font-medium animate-pulse">Scanning the ecosystem...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 border rounded-2xl bg-destructive/5 border-destructive/10">
              <p className="text-destructive font-medium">Failed to load projects. Please try refreshing the page.</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 space-y-6 border-2 border-dashed rounded-3xl bg-muted/20 max-w-2xl mx-auto">
              <div className="space-y-2">
                <p className="text-xl font-bold">No results found</p>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? `We couldn't find any projects matching "${searchQuery}" in ${selectedCategory}`
                    : `The ${selectedCategory} category is currently empty.`}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {(searchQuery || selectedCategory !== 'All') && (
                  <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                    Clear Filters
                  </Button>
                )}
                <Link to="/submit">
                  <Button className="gap-2 shadow-primary">
                    <Plus className="w-4 h-4" /> Be the first to submit
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="border-t py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Vanguard Directory. Built for the modern web.</p>
          <div className="flex items-center gap-6">
            <Link to="/submit" className="hover:text-foreground transition-colors">Submit</Link>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}