import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProjectCard } from '@/components/ProjectCard';
import { Navbar } from '@/components/layout/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Plus, Sparkles, SlidersHorizontal, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api-client';
import type { Project } from '@shared/types';
import { cn } from '@/lib/utils';
const CATEGORIES = ['All', 'SaaS', 'DevTools', 'Web3', 'Design', 'Analytics', 'Productivity', 'Infrastructure'];
export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const searchInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cross-browser CMD+K / CTRL+K support
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const { data, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api<{ items: Project[] }>('/api/projects'),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
  const projects = data?.items ?? [];
  // Optimized filtering
  const filteredProjects = React.useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return projects.filter(p => {
      const matchesSearch = !query || 
        p.title.toLowerCase().includes(query) ||
        p.tagline.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query));
      const matchesCategory =
        selectedCategory === 'All' ||
        p.tags.some(t => t.toLowerCase() === selectedCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);
  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    searchInputRef.current?.focus();
  };
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 bg-tech-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="text-center space-y-8 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 relative py-12 px-4 rounded-[3rem] overflow-hidden">
              <div className="absolute inset-0 bg-grid-dot [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] -z-10" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                <Sparkles className="w-3 h-3" />
                <span>The Vanguard Ecosystem</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-balance">
                Discover the next <span className="text-primary italic">tech wave</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                A curated directory of the most promising software tools and creative platforms built by modern makers.
              </p>
              <div className="max-w-xl mx-auto relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search tools, tags, or builders..."
                  className="pl-12 h-14 bg-secondary/30 border-border/50 focus:bg-background focus:border-primary/50 focus:ring-primary/10 transition-all shadow-sm focus:shadow-md rounded-2xl text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5 px-2 py-1 rounded-md border bg-background/80 text-[10px] font-bold text-muted-foreground shadow-sm">
                  <span className="text-[12px] leading-none">⌘</span>
                  <span className="leading-none">K</span>
                </div>
              </div>
            </div>
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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-6">
                <Loader2 className="w-12 h-12 animate-spin text-primary/30" />
                <div className="text-center space-y-1">
                  <p className="text-foreground font-semibold">Scanning Database</p>
                  <p className="text-sm text-muted-foreground">Fetching the latest innovations...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-20 border rounded-3xl bg-destructive/5 border-destructive/10 max-w-2xl mx-auto">
                <p className="text-destructive font-semibold mb-2">Sync failure detected</p>
                <p className="text-muted-foreground mb-6">Could not establish connection to the storage provider.</p>
                <Button variant="outline" onClick={() => window.location.reload()}>Retry Connection</Button>
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
                  <h3 className="text-2xl font-display font-bold">No results found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We couldn't find anything matching your current filters. Try broadening your search or choosing a different category.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {(searchQuery || selectedCategory !== 'All') && (
                    <Button variant="outline" className="rounded-xl h-11 px-6" onClick={handleReset}>
                      Clear All Filters
                    </Button>
                  )}
                  <Link to="/submit">
                    <Button className="rounded-xl h-11 px-8 gap-2 shadow-primary">
                      <Plus className="w-4 h-4" /> Feature Your Project
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
              <p className="font-medium">© {new Date().getFullYear()} Vanguard Tech Directory</p>
            </div>
            <div className="flex items-center gap-8">
              <Link to="/submit" className="hover:text-foreground transition-colors font-medium">Add Project</Link>
              <Link to="/dashboard" className="hover:text-foreground transition-colors font-medium">Dashboard</Link>
              <a href="#" className="hover:text-foreground transition-colors font-medium">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}