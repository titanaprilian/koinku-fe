# Fetch Dashboard Stats Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the GET `/dashboard/` endpoint integration to fetch and display real statistics on the dashboard.

**Architecture:** 
1. Define the types for the dashboard response in `src/features/dashboard/types.ts`.
2. Create the API client call in `src/features/dashboard/api.ts`.
3. Create a TanStack Query hook in `src/features/dashboard/hooks/use-dashboard-stats.ts` to manage data fetching and caching.
4. Update the `src/routes/_authenticated/index.tsx` view to consume the hook and render the real data, replacing the previous placeholder cards.

**Tech Stack:** React, TanStack Query, Axios, Tailwind CSS, shadcn/ui, Lucide React

---

### Task 1: Define Dashboard Types

**Files:**
- Create: `src/features/dashboard/types.ts`

- [ ] **Step 1: Define the API response interfaces**

```typescript
export interface UserDistribution {
  roleName: string;
  count: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalRoles: number;
  totalFeatures: number;
  userDistribution: UserDistribution[];
}

export interface DashboardResponse {
  error: boolean;
  code: number;
  message: string;
  data: DashboardStats;
}
```

---

### Task 2: Create API Function

**Files:**
- Create: `src/features/dashboard/api.ts`

- [ ] **Step 1: Implement the GET /dashboard/ API call**

```typescript
import { api } from '@/api/client';
import type { DashboardResponse } from './types';

export async function getDashboardStats(): Promise<DashboardResponse> {
  const response = await api.get<DashboardResponse>('/dashboard/');
  return response.data;
}
```

---

### Task 3: Create TanStack Query Hook

**Files:**
- Create: `src/features/dashboard/hooks/use-dashboard-stats.ts`

- [ ] **Step 1: Create the custom hook for fetching dashboard stats**

```typescript
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../api';
import type { DashboardResponse } from '../types';

export function useDashboardStats() {
  return useQuery<DashboardResponse>({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
  });
}
```

---

### Task 4: Update Dashboard View

**Files:**
- Modify: `src/routes/_authenticated/index.tsx`

- [ ] **Step 1: Replace the contents of the dashboard page to use the real data**

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserCheck, Shield, Layout } from 'lucide-react';
import { useMe } from '@/features/auth/hooks/use-me';
import { useDashboardStats } from '@/features/dashboard/hooks/use-dashboard-stats';

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardIndex,
});

function DashboardIndex() {
  const { data: meData } = useMe();
  const profile = meData?.data;

  const { data, isLoading, isError } = useDashboardStats();
  const stats = data?.data;

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.name || 'User'}! Here's an overview of the system.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      ) : isError ? (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          Failed to load dashboard statistics. Please try again later.
        </div>
      ) : stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.inactiveUsers} inactive users
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                Currently active accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRoles}</div>
              <p className="text-xs text-muted-foreground">
                Configured access roles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Features</CardTitle>
              <Layout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFeatures}</div>
              <p className="text-xs text-muted-foreground">
                Managed features in system
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}
      
      {/* Optional: User Distribution Table could go here */}
      {stats?.userDistribution && stats.userDistribution.length > 0 && (
        <Card className="mt-6 w-full lg:w-1/2">
          <CardHeader>
            <CardTitle className="text-lg">User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.userDistribution.map((dist) => (
                <div key={dist.roleName} className="flex items-center justify-between">
                  <div className="text-sm font-medium">{dist.roleName}</div>
                  <div className="text-sm text-muted-foreground">{dist.count} users</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Check build compiles**

Run: `bun run build`
Expected: Build passes with no TypeScript or linting errors.
