import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, User, Mail, Shield, Calendar } from 'lucide-react';
import { authService } from '@/features/auth/auth-service';
import { logoutApi } from '@/features/auth/api';
import { useMe } from '@/features/auth/hooks/use-me';
import { useState } from 'react';

export const Route = createFileRoute('/_authenticated/')({
  component: AuthenticatedIndex,
});

function AuthenticatedIndex() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data, isLoading, isError } = useMe();
  const profile = data?.data;
  const user = authService.getUser();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutApi();
    } catch (error) {
      console.error('[AuthenticatedIndex] logout failed:', error);
    } finally {
      authService.clearSession();
      await router.invalidate();
      router.navigate({ to: '/login' });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Welcome header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-sm text-muted-foreground">
            Here's your account overview
          </p>
        </div>

        {/* Profile card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ProfileSkeleton />
            ) : isError ? (
              <p className="text-sm text-destructive">
                Unable to load profile. Please try refreshing the page.
              </p>
            ) : profile ? (
              <div className="space-y-4">
                <ProfileRow icon={User} label="Name" value={profile.name} />
                <ProfileRow icon={Mail} label="Email" value={profile.email} />
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Role</p>
                    <Badge variant="secondary">
                      <span className="text-xs font-medium">{profile.roleName}</span>
                    </Badge>
                  </div>
                </div>
                <ProfileRow
                  icon={Calendar}
                  label="Member since"
                  value={formatDate(profile.createdAt)}
                />
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Logout button */}
        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          variant="destructive"
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isLoggingOut ? 'Logging out...' : 'Log out'}
        </Button>
      </div>
    </div>
  );
}

/** Reusable row for displaying a label + value with an icon */
function ProfileRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <div className="space-y-0.5">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

/** Loading skeleton matching the profile card layout */
function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="w-4 h-4 rounded shrink-0" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
