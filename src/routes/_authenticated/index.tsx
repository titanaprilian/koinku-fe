import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Shield, Layers, AlertCircle } from 'lucide-react';
import { useMe } from '@/features/auth/hooks/use-me';
import { useDashboardStats } from '@/features/dashboard/hooks/use-dashboard-stats';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardIndex,
});

function DashboardIndex() {
  const { data: meData } = useMe();
  const profile = meData?.data;

  const { data: statsData, isLoading, isError, error } = useDashboardStats();
  const stats = statsData?.data;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.name || 'User'}! Here's an overview of your application.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <Skeleton className="h-6 w-36 mb-1" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.name || 'User'}! Here's an overview of your application.
          </p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Stats</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to fetch dashboard stats. Please try again later.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const activePercentage = stats && stats.totalUsers > 0
    ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.name || 'User'}! Here's an overview of your application.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{stats?.totalUsers ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.inactiveUsers ?? 0} inactive {((stats?.inactiveUsers ?? 0) === 1) ? 'user' : 'users'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{stats?.activeUsers ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {activePercentage}% of total users
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{stats?.totalRoles ?? 0}</div>
            <p className="text-xs text-muted-foreground">Security access roles</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Features</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{stats?.totalFeatures ?? 0}</div>
            <p className="text-xs text-muted-foreground">Application features</p>
          </CardContent>
        </Card>
      </div>

      {stats?.userDistribution && stats.userDistribution.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6 mt-6">
          <Card className="hover:shadow-md hover:border-primary/50 transition-all">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">User Distribution</CardTitle>
              <CardDescription>Breakdown of users by role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {stats.userDistribution.map((item) => {
                const percentage = stats.totalUsers > 0
                  ? Math.round((item.count / stats.totalUsers) * 100)
                  : 0;
                return (
                  <div key={item.roleName} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{item.roleName}</span>
                      <span className="text-sm font-mono text-muted-foreground">
                        {item.count} {item.count === 1 ? 'user' : 'users'} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

