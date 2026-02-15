import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronUp } from 'lucide-react';
import type { Project } from '@shared/types';
interface ProjectCardProps {
  project: Project;
}
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link to={`/project/${project.id}`}>
      <Card className="group overflow-hidden border-border/50 bg-card hover:border-primary/50 hover:shadow-glow hover:-translate-y-1 transition-all duration-300 h-full flex flex-col relative">
        <div className="aspect-video w-full overflow-hidden bg-muted/50 relative">
          {project.screenshotUrl ? (
            <img
              src={project.screenshotUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-secondary">
              <span className="text-sm font-medium">No Preview</span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex items-start gap-2">
            {project.logoUrl && (
              <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md border border-border/10 overflow-hidden flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                <img src={project.logoUrl} alt="" className="w-full h-full object-contain" />
              </div>
            )}
          </div>
          <div className="absolute top-3 right-3">
             <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-border/20 shadow-sm flex items-center gap-1.5 text-xs font-bold transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:shadow-primary/20">
                <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                <span>{project.votes || 0}</span>
             </div>
          </div>
        </div>
        <CardContent className="p-5 flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {project.title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {project.tagline}
          </p>
        </CardContent>
        <CardFooter className="px-5 py-4 pt-0 flex flex-wrap gap-1.5 mt-auto">
          {project.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-accent/30 text-accent-foreground border-transparent hover:bg-accent/50 transition-colors">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs text-muted-foreground ml-1 font-medium">+{project.tags.length - 3}</span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}