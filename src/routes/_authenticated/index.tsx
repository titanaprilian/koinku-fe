import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { authService } from '@/features/auth/auth-service';
import { logoutApi } from '@/features/auth/api';
import { useState } from 'react';

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
});

function Index() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const user = authService.getUser();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutApi();
    } catch (error) {
      console.error('[Index] logout failed:', error);
    } finally {
      authService.clearSession();
      await router.invalidate();
      router.navigate({ to: '/login' });
    }
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-screen gap-6 bg-background text-foreground text-center">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          You are logged in as <span className="font-semibold text-foreground">{user?.email}</span>.
        </p>
      </div>

      <Button
        onClick={handleLogout}
        disabled={isLoggingOut}
        variant="destructive"
      >
        <LogOut className="w-4 h-4 mr-2" />
        {isLoggingOut ? 'Logging out...' : 'Log out'}
      </Button>
    </div>
  );
}
