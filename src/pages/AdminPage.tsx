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
  FileJson,
  Database
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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/10">
        <div className="bg-background p-8 rounded-[2rem] shadow-xl border border-border/50 text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-10 h-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-display font-bold">Access Restricted</h1>
            <p className="text-muted-foreground">This area is reserved for Vanguard administrators. Unauthorized access is recorded.</p>
          </div>
          <Button onClick={() => navigate('/')} className="w-full h-12 rounded-xl font-bold">Return to Directory</Button>
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
      link.setAttribute('download', `vanguard-db-backup-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Export Successful', { description: `${data.length} records exported to JSON.` });
    } catch (err) {
      toast.error('Export Failed', { description: 'Could not generate backup file.' });
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
        const result = await api<{ count: number }>('/api/projects/import', {
          method: 'POST',
          body: JSON.stringify(json),
        });
        toast.success('Import Successful', { description: `Successfully processed ${result.count} records.` });
        setImportDialogOpen(false);
        refetch();
      } catch (err) {
        toast.error('Import Failed', { description: 'The file provided is not a valid Vanguard data structure.' });
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };
  const handleBulkDelete = async () => {
    if (!window.confirm(`Permanently remove ${selectedIds.size} records? This cannot be reversed.`)) return;
    try {
      const res = await api<{ count: number }>('/api/projects/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      toast.success('Batch Delete Successful', { description: `${res.count} records removed from the directory.` });
      setSelectedIds(new Set());
      refetch();
    } catch (err) {
      toast.error('Batch Delete Failed');
    }
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this project from the public directory?')) return;
    try {
      await api(`/api/projects/${id}`, { method: 'DELETE' });
      toast.success('Project Removed');
      refetch();
    } catch (err) {
      toast.error('Removal Failed');
    }
  };
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
              <Database className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">Database Directory</h1>
            <p className="text-muted-foreground">Global oversight, curation, and data portability.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-muted/40 rounded-xl p-1.5 border border-border/50">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 h-9 rounded-lg px-4"
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Export
              </Button>
              <div className="w-px h-5 bg-border mx-1.5" />
              <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 h-9 rounded-lg px-4">
                    <Upload className="w-4 h-4" />
                    Import
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-3xl">
                  <DialogHeader>
                    <DialogTitle>Import Records</DialogTitle>
                    <DialogDescription>
                      Restore a previous backup or migrate data using a Vanguard JSON file.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl bg-muted/20 border-border/60">
                    <FileJson className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImport}
                      accept=".json"
                      className="hidden"
                      id="import-file"
                    />
                    <label htmlFor="import-file">
                      <Button asChild variant="secondary" className="rounded-xl h-11 px-6 shadow-sm" disabled={isImporting}>
                        <span>
                          {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                          Select JSON File
                        </span>
                      </Button>
                    </label>
                  </div>
                  <DialogFooter className="sm:justify-center">
                    <p className="text-[10px] text-muted-foreground text-center uppercase tracking-wider font-semibold">
                      CAUTION: IMPORTING MAY OVERWRITE RECORDS WITH MATCHING IDS
                    </p>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {selectedIds.size > 0 && (
              <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="gap-2 h-10 px-5 rounded-xl shadow-lg shadow-destructive/10">
                <Trash2 className="w-4 h-4" /> Delete ({selectedIds.size})
              </Button>
            )}
            <Link to="/submit">
              <Button size="sm" className="gap-2 h-10 px-6 rounded-xl shadow-lg shadow-primary/10">
                <Plus className="w-4 h-4" /> Create Record
              </Button>
            </Link>
          </div>
        </div>
        <div className="mb-8 relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, tags, or owner..."
            className="pl-11 h-11 bg-muted/30 border-border/50 rounded-xl focus:bg-background transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="border rounded-[1.5rem] bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                <TableHead className="w-14 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSelectAll}
                    className="h-8 w-8 rounded-lg"
                  >
                    {selectedIds.size === filteredProjects.length && filteredProjects.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    ) : (
                      <Square className="w-4 h-4 text-muted-foreground/40" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="font-bold text-foreground py-5">Project Details</TableHead>
                <TableHead className="font-bold text-foreground py-5">Ownership</TableHead>
                <TableHead className="font-bold text-foreground py-5">Category Tags</TableHead>
                <TableHead className="font-bold text-foreground py-5">Registration</TableHead>
                <TableHead className="text-right font-bold text-foreground py-5 pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                      <p className="text-sm font-medium text-muted-foreground">Retrieving directory data...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-96 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                        <Search className="w-6 h-6 text-muted-foreground/30" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-foreground font-bold">No records matched</p>
                        <p className="text-sm text-muted-foreground">Adjust your search parameters and try again.</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((p) => (
                  <TableRow key={p.id} className={cn("transition-colors", selectedIds.has(p.id) ? "bg-primary/[0.03]" : "hover:bg-muted/10")}>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSelect(p.id)}
                        className="h-8 w-8 rounded-lg"
                      >
                        {selectedIds.has(p.id) ? (
                          <CheckSquare className="w-4 h-4 text-primary" />
                        ) : (
                          <Square className="w-4 h-4 text-muted-foreground/30" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl border bg-white p-1 flex-shrink-0 shadow-sm flex items-center justify-center overflow-hidden">
                          {p.logoUrl ? (
                            <img src={p.logoUrl} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-full h-full bg-muted rounded-md" />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-bold text-foreground block">{p.title}</span>
                          <span className="text-[10px] text-muted-foreground font-mono line-clamp-1 max-w-[150px]">{p.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground font-medium">
                      {p.ownerId}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {p.tags.slice(0, 2).map(t => (
                          <Badge key={t} variant="secondary" className="text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold bg-accent/50 text-accent-foreground">
                            {t}
                          </Badge>
                        ))}
                        {p.tags.length > 2 && (
                          <span className="text-[10px] text-muted-foreground font-bold">+{p.tags.length - 2}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-medium">
                      {new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5">
                          <DropdownMenuItem onClick={() => navigate(`/project/${p.id}`)} className="rounded-lg cursor-pointer">
                            <ExternalLink className="mr-2 h-4 w-4" /> View Public
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/submit/${p.id}`)} className="rounded-lg cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Modify Entry
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:bg-destructive/5 focus:text-destructive rounded-lg cursor-pointer"
                            onClick={() => handleDelete(p.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Record
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