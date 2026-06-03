import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import { useMe } from '@/features/auth/hooks/use-me';
export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const { data, isLoading, isError } = useMe();
  const profile = data?.data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            Account Details
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
            <div className="space-y-6">
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
    </div>
  );
}

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

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
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
