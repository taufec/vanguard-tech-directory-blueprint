import React from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Rocket, Plus, LayoutDashboard, LogOut, User as UserIcon, ChevronDown, Database } from 'lucide-react';
import { useAuthStore } from '@/store/use-auth-store';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const isHome = location.pathname === "/";
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-lg bg-primary text-primary-foreground group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-primary/25">
                <Rocket className="w-5 h-5" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight">Vanguard</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className={cn(
                  "text-sm font-medium transition-colors relative py-1",
                  isHome 
                    ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Browse
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle className="static" />
            <Link to="/submit">
              <Button size="sm" className="gap-2 shadow-sm hover:shadow-primary/20 transition-all">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Submit Project</span>
              </Button>
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative flex items-center gap-2 pl-2 pr-1 hover:bg-accent/50">
                    <Avatar className="h-7 w-7 border">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="text-[10px] uppercase bg-muted">{user.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">{user.role} Account</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin-db')} className="cursor-pointer text-primary focus:text-primary">
                      <Database className="mr-2 h-4 w-4" />
                      <span>Database (Admin)</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:bg-destructive/5 focus:text-destructive cursor-pointer" 
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => navigate('/dashboard')}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}