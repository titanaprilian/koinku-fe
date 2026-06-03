import { Link } from '@tanstack/react-router';
import { LayoutDashboard, Users, ShieldAlert } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-64 bg-card border-r flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b">
        <span className="text-lg font-bold">AppLogo</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground [&.active]:bg-accent [&.active]:text-accent-foreground"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
        <Link
          to="/users"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground [&.active]:bg-accent [&.active]:text-accent-foreground"
        >
          <Users className="w-4 h-4" />
          Users
        </Link>
        <Link
          to="/rbac"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground [&.active]:bg-accent [&.active]:text-accent-foreground"
        >
          <ShieldAlert className="w-4 h-4" />
          RBAC
        </Link>
      </nav>
    </div>
  );
}
