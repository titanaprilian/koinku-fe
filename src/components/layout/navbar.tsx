import { Link, useRouter } from '@tanstack/react-router';
import { User, LogOut } from 'lucide-react';
import { authService } from '@/features/auth/auth-service';
import { logoutApi } from '@/features/auth/api';
import { useMe } from '@/features/auth/hooks/use-me';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const router = useRouter();
  const { data } = useMe();
  const profile = data?.data;

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('[Navbar] logout failed:', error);
    } finally {
      authService.clearSession();
      await router.invalidate();
      router.navigate({
        to: '/login',
        search: { redirect: undefined },
      });
    }
  };

  const initials = profile?.name
    ? profile.name.substring(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="flex-1" /> {/* Spacer */}
      
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="relative h-8 w-8 rounded-full" />
            }
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{profile?.name || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {profile?.email || ''}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={
                <Link to="/profile" className="cursor-pointer w-full flex items-center" />
              }
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
