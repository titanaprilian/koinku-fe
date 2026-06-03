# Dashboard Redesign & Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a shell layout with a sidebar and navbar, redesign the dashboard to show actual dashboard content, and move the existing profile view to a dedicated page.

**Architecture:** 
1. We will install required shadcn components (`dropdown-menu`, `avatar`).
2. We will create placeholder routes for future features (`/users`, `/rbac`) and a new `/profile` route to avoid TanStack Router type errors.
3. We will build `Sidebar`, `Navbar`, and `AppLayout` components.
4. The `_authenticated.tsx` layout will be updated to wrap the `<Outlet />` in `AppLayout`.
5. We will move the profile logic from `index.tsx` to `profile.tsx` and turn `index.tsx` into a real dashboard.

**Tech Stack:** React, TanStack Router, Tailwind CSS, shadcn/ui, Lucide React

---

### Task 1: Install Required shadcn/ui Components

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install dropdown-menu and avatar components**

Run: `bunx shadcn@latest add dropdown-menu avatar`
Expected: Successfully installs the primitives into `src/components/ui/` and updates dependencies.

---

### Task 2: Create New Route Files

We need to create the route files so TanStack Router can generate the types for our navigation links.

**Files:**
- Create: `src/routes/_authenticated/users.tsx`
- Create: `src/routes/_authenticated/rbac.tsx`
- Create: `src/routes/_authenticated/profile.tsx`

- [ ] **Step 1: Create the Users placeholder route**

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/users')({
  component: UsersPage,
});

function UsersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Users Management</h1>
      <p className="text-muted-foreground">Future feature implementation goes here.</p>
    </div>
  );
}
```

- [ ] **Step 2: Create the RBAC placeholder route**

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/rbac')({
  component: RbacPage,
});

function RbacPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">RBAC Management</h1>
      <p className="text-muted-foreground">Future feature implementation goes here.</p>
    </div>
  );
}
```

- [ ] **Step 3: Create the empty Profile route**

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  return <div>Profile Page</div>;
}
```

- [ ] **Step 4: Start dev server to generate route tree**

Run: `bun run dev` (run it in the background or let it run for a few seconds to let `@tanstack/router-plugin/vite` regenerate `src/routeTree.gen.ts`, then you can stop it).
Expected: `src/routeTree.gen.ts` is updated with the new routes.

---

### Task 3: Create Layout Components

**Files:**
- Create: `src/components/layout/sidebar.tsx`
- Create: `src/components/layout/navbar.tsx`
- Create: `src/components/layout/app-layout.tsx`

- [ ] **Step 1: Create the Sidebar component**

```tsx
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
```

- [ ] **Step 2: Create the Navbar component**

```tsx
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
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.name || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {profile?.email || ''}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer w-full flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
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
```

- [ ] **Step 3: Create the AppLayout component**

```tsx
import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

### Task 4: Integrate Layout and Move Profile Logic

**Files:**
- Modify: `src/routes/_authenticated.tsx`
- Modify: `src/routes/_authenticated/profile.tsx`

- [ ] **Step 1: Wrap Outlet with AppLayout in `_authenticated.tsx`**

```tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppLayout } from '@/components/layout/app-layout';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname,
        },
      });
    }
  },
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});
```

- [ ] **Step 2: Implement the dedicated Profile page**

Replace the contents of `src/routes/_authenticated/profile.tsx` with the profile logic previously in the index route:

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import { useMe } from '@/features/auth/hooks/use-me';
import { authService } from '@/features/auth/auth-service';

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const { data, isLoading, isError } = useMe();
  const profile = data?.data;
  const user = authService.getUser();

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
```

---

### Task 5: Redesign the Dashboard Route

**Files:**
- Modify: `src/routes/_authenticated/index.tsx`

- [ ] **Step 1: Replace the contents of index.tsx to be a real dashboard**

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, CreditCard, DollarSign } from 'lucide-react';
import { useMe } from '@/features/auth/hooks/use-me';

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardIndex,
});

function DashboardIndex() {
  const { data } = useMe();
  const profile = data?.data;

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.name || 'User'}! Here's an overview of your application.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run a build check**

Run: `bun run build`
Expected: Build passes with no TypeScript errors and the changes are complete.
