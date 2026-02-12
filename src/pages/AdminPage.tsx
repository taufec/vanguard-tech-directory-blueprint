import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/use-auth-store';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  ExternalLink,
  Loader2,
  ShieldAlert,
  Search,
  CheckSquare,
  Square,
  Edit,
  MoreVertical,
  Download,
  Upload,
  FileJson
} from 'lucide-react';
import type { Project } from '@shared/types';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
export function AdminPage() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [search, setSearch] = React.useState('');
  const [isExporting, setIsExporting] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const [importDialogOpen, setImportDialogOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => api<{ items: Project[] }>('/api/projects'),
    enabled: user?.role === 'admin',
  });
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
        <div className="bg-background p-8 rounded-2xl shadow-sm border text-center space-y-4 max-w-md">
          <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Access Restricted</h1>
          <p className="text-muted-foreground">Only system administrators can access the directory database.</p>
          <Button onClick={() => navigate('/')} className="w-full">Return Home</Button>
        </div>
      </div>
    );
  }
  const projects = data?.items ?? [];
  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.ownerId.toLowerCase().includes(search.toLowerCase())
  );
  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProjects.length && filteredProjects.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProjects.map(p => p.id)));
    }
  };
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await api<Project[]>('/api/projects/export');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vanguard-backup-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Database exported successfully');
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        await api('/api/projects/import', {
          method: 'POST',
          body: JSON.stringify(json),
        });
        toast.success('Import successful');
        setImportDialogOpen(false);
        refetch();
      } catch (err) {
        toast.error('Import failed', { description: 'Ensure the file is a valid Vanguard JSON export' });
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };
  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.size} projects? This cannot be undone.`)) return;
    try {
      await api('/api/projects/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      toast.success('Batch deletion successful');
      setSelectedIds(new Set());
      refetch();
    } catch (err) {
      toast.error('Failed to delete projects');
    }
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api(`/api/projects/${id}`, { method: 'DELETE' });
      toast.success('Project removed');
      refetch();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Database Admin</h1>
            <p className="text-muted-foreground">Global directory management and portability.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-muted/50 rounded-lg p-1 border">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 h-8" 
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                Export
              </Button>
              <div className="w-px h-4 bg-border mx-1" />
              <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 h-8">
                    <Upload className="w-3.5 h-3.5" />
                    Import
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Database</DialogTitle>
                    <DialogDescription>
                      Upload a Vanguard JSON backup file to restore or migrate project records.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-6 flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/30">
                    <FileJson className="w-12 h-12 text-muted-foreground mb-4 opacity-40" />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImport}
                      accept=".json"
                      className="hidden"
                      id="import-file"
                    />
                    <label htmlFor="import-file">
                      <Button asChild variant="secondary" disabled={isImporting}>
                        <span>
                          {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                          Choose JSON File
                        </span>
                      </Button>
                    </label>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <p className="text-[10px] text-muted-foreground">
                      Warning: Importing may overwrite existing entries with the same IDs.
                    </p>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {selectedIds.size > 0 && (
              <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="gap-2">
                <Trash2 className="w-4 h-4" /> Delete ({selectedIds.size})
              </Button>
            )}
            <Link to="/submit">
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Add Project
              </Button>
            </Link>
          </div>
        </div>
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or owner..."
            className="pl-10 max-w-md bg-secondary text-secondary-foreground"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-12">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSelectAll}
                    className="h-8 w-8"
                    aria-label={selectedIds.size === filteredProjects.length ? "Deselect all" : "Select all"}
                  >
                    {selectedIds.size === filteredProjects.length && filteredProjects.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    ) : (
                      <Square className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="font-semibold text-foreground">Project</TableHead>
                <TableHead className="font-semibold text-foreground">Owner ID</TableHead>
                <TableHead className="font-semibold text-foreground">Categories</TableHead>
                <TableHead className="font-semibold text-foreground">Created</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Search className="w-8 h-8 text-muted-foreground opacity-20" />
                      <p className="text-muted-foreground font-medium">No projects found</p>
                      <p className="text-xs text-muted-foreground/60">Try adjusting your search filters.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((p) => (
                  <TableRow key={p.id} className={selectedIds.has(p.id) ? "bg-accent/50" : "hover:bg-muted/30"}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSelect(p.id)}
                        className="h-8 w-8"
                        aria-label={selectedIds.has(p.id) ? "Deselect project" : "Select project"}
                      >
                        {selectedIds.has(p.id) ? (
                          <CheckSquare className="w-4 h-4 text-primary" />
                        ) : (
                          <Square className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded border bg-white p-0.5 flex-shrink-0">
                          {p.logoUrl ? (
                            <img src={p.logoUrl} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-full h-full bg-muted" />
                          )}
                        </div>
                        <span className="font-medium text-foreground">{p.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {p.ownerId}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {p.tags.slice(0, 2).map(t => (
                          <Badge key={t} variant="secondary" className="text-[9px] px-1.5 py-0 uppercase tracking-tighter">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/project/${p.id}`)}>
                            <ExternalLink className="mr-2 h-4 w-4" /> View Page
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/submit/${p.id}`)}>
                            <Edit className="mr-2 h-4 w-4" /> Quick Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:bg-destructive/5 focus:text-destructive"
                            onClick={() => handleDelete(p.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}