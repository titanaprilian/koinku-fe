import { Link } from '@tanstack/react-router';
import { LayoutDashboard, Users, ShieldAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r flex flex-col h-full transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b">
        <span className="text-lg font-bold">AppLogo</span>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground [&.active]:bg-accent [&.active]:text-accent-foreground"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
        <Link
          to="/users"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground [&.active]:bg-accent [&.active]:text-accent-foreground"
        >
          <Users className="w-4 h-4" />
          Users
        </Link>
        <Link
          to="/rbac/roles"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground [&.active]:bg-accent [&.active]:text-accent-foreground"
        >
          <ShieldAlert className="w-4 h-4" />
          RBAC
        </Link>
      </nav>
    </div>
  );
}
