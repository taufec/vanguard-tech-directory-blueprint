import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProjectCard } from '@/components/ProjectCard';
import { Navbar } from '@/components/layout/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Plus, Sparkles, SlidersHorizontal } from 'lucide-react';
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            {/* Hero Section */}
            <div className="text-center space-y-8 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                <Sparkles className="w-3 h-3" />
                <span>Curated Directory</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-balance">
                The next generation of <span className="text-primary italic">tech</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Discover and showcase the finest tools, apps, and platforms built by creators around the globe.
              </p>
              <div className="max-w-xl mx-auto relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search projects, tags, or tools..."
                  className="pl-12 h-14 bg-secondary/30 border-border/50 focus:bg-background focus:border-primary focus:ring-primary/10 transition-all shadow-sm focus:shadow-md rounded-2xl text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            {/* Category Tabs */}
            <div className="flex items-center justify-between mb-10 gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth flex-1">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "rounded-full px-5 py-2 h-9 text-sm font-medium transition-all shrink-0",
                      selectedCategory === category 
                        ? "shadow-md scale-105" 
                        : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    )}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <div className="hidden sm:flex items-center gap-2 text-muted-foreground/60">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
            </div>
            {/* Grid Section */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-6">
                <Loader2 className="w-12 h-12 animate-spin text-primary/30" />
                <div className="text-center space-y-1">
                  <p className="text-foreground font-semibold">Scanning the ecosystem</p>
                  <p className="text-sm text-muted-foreground">Finding the best tech for you...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-20 border rounded-3xl bg-destructive/5 border-destructive/10 max-w-2xl mx-auto">
                <p className="text-destructive font-semibold mb-2">Sync Error</p>
                <p className="text-muted-foreground mb-6">We couldn't reach the database. Please try refreshing.</p>
                <Button variant="outline" onClick={() => window.location.reload()}>Refresh Page</Button>
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 space-y-8 border-2 border-dashed rounded-[2.5rem] bg-muted/10 max-w-3xl mx-auto px-6">
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-2xl font-display font-bold">No projects found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {searchQuery
                      ? `We couldn't find any projects matching "${searchQuery}" in ${selectedCategory}`
                      : `The ${selectedCategory} category is currently waiting for its first submission.`}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {(searchQuery || selectedCategory !== 'All') && (
                    <Button variant="outline" className="rounded-xl h-11 px-6" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                      Reset Filters
                    </Button>
                  )}
                  <Link to="/submit">
                    <Button className="rounded-xl h-11 px-8 gap-2 shadow-primary">
                      <Plus className="w-4 h-4" /> Submit Your Project
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="border-t py-12 bg-muted/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-muted">
                <Rocket className="w-4 h-4" />
              </div>
              <p className="font-medium">© {new Date().getFullYear()} Vanguard Directory</p>
            </div>
            <div className="flex items-center gap-8">
              <Link to="/submit" className="hover:text-foreground transition-colors font-medium">Submit</Link>
              <Link to="/dashboard" className="hover:text-foreground transition-colors font-medium">Dashboard</Link>
              <a href="#" className="hover:text-foreground transition-colors font-medium">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}