import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Rocket, Plus } from 'lucide-react';
export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-lg bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
                <Rocket className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">Vanguard</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Browse
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle className="static" />
            <Link to="/submit">
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Submit Project</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}