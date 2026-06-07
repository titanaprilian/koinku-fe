# Dynamic RBAC Sidebar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the `/rbac/roles/me` endpoint, create a provider to track allowed features, and dynamically render sidebar items based on `canRead` permissions.

**Architecture:** We will define the new endpoint and types in the `roles` feature. Then, we will create an `RbacProvider` that fetches the user's role data using `@tanstack/react-query` and exposes a `useRbac` hook. The `_authenticated.tsx` route will wrap the `AppLayout` with this provider. Finally, the `Sidebar` component will consume the `useRbac` hook to conditionally render the "Users" (`user_management` feature) and "RBAC" (`RBAC_management` feature) links.

**Tech Stack:** React, TanStack Query, TanStack Router, Tailwind CSS, shadcn/ui

---

### Task 1: Add API Types and Endpoint for `/rbac/roles/me`

**Files:**
- Modify: `src/features/roles/types.ts`
- Modify: `src/features/roles/api.ts`

- [ ] **Step 1: Add types to `types.ts`**
Add the new response types to the end of `src/features/roles/types.ts`.

```typescript
// ─── My Role (Current User) ─────────────────────────────────────────────────

export interface MyRolePermission {
  featureId: string;
  featureName: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canPrint: boolean;
}

export interface MyRoleData {
  roleName: string;
  permissions: MyRolePermission[];
}

export interface GetMyRoleResponse {
  error: boolean;
  code: number;
  message: string;
  data: MyRoleData;
}
```

- [ ] **Step 2: Add API function to `api.ts`**
Add the `getMyRole` function to `src/features/roles/api.ts`. Note: Ensure you import `GetMyRoleResponse` from `./types`.

```typescript
export async function getMyRole(): Promise<GetMyRoleResponse> {
  const { data } = await api.get<GetMyRoleResponse>('/rbac/roles/me');
  return data;
}
```

### Task 2: Create RBAC Provider and Hook

**Files:**
- Create: `src/features/roles/components/rbac-provider.tsx`

- [ ] **Step 1: Create the RBAC context and provider**
Create `src/features/roles/components/rbac-provider.tsx` with the following implementation. It will use TanStack Query to fetch the user's role and provide a utility function to check permissions.

```tsx
import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyRole } from '../api';
import type { MyRolePermission } from '../types';
import { Loader2 } from 'lucide-react';

interface RbacContextValue {
  roleName?: string;
  permissions: MyRolePermission[];
  hasPermission: (featureName: string, action?: keyof Omit<MyRolePermission, 'featureId' | 'featureName'>) => boolean;
}

const RbacContext = createContext<RbacContextValue | null>(null);

export function RbacProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ['myRole'],
    queryFn: getMyRole,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const roleData = data?.data;

  const hasPermission: RbacContextValue['hasPermission'] = (featureName, action = 'canRead') => {
    if (!roleData) return false;
    const perm = roleData.permissions.find(
      (p) => 
        p.featureName.toLowerCase() === featureName.toLowerCase() || 
        p.featureId.toLowerCase() === featureName.toLowerCase()
    );
    return perm ? Boolean(perm[action]) : false;
  };

  return (
    <RbacContext.Provider value={{ 
      roleName: roleData?.roleName, 
      permissions: roleData?.permissions || [], 
      hasPermission 
    }}>
      {children}
    </RbacContext.Provider>
  );
}

export function useRbac() {
  const context = useContext(RbacContext);
  if (!context) {
    throw new Error('useRbac must be used within an RbacProvider');
  }
  return context;
}
```

### Task 3: Wrap Authenticated Layout with RBAC Provider

**Files:**
- Modify: `src/routes/_authenticated.tsx`

- [ ] **Step 1: Update the layout wrapper**
Modify `src/routes/_authenticated.tsx` to wrap `AppLayout` with `RbacProvider`.

```tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppLayout } from '@/components/layout/app-layout';
import { RbacProvider } from '@/features/roles/components/rbac-provider';

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
    <RbacProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </RbacProvider>
  ),
});
```

### Task 4: Make Sidebar Dynamic

**Files:**
- Modify: `src/components/layout/sidebar.tsx`

- [ ] **Step 1: Conditionally render sidebar links**
Update `src/components/layout/sidebar.tsx` to consume the `useRbac` hook and conditionally render the "Users" and "RBAC" links. Map the user feature to `'user_management'` and the RBAC feature to `'RBAC_management'` as required.

```tsx
import { Link } from '@tanstack/react-router';
import { LayoutDashboard, Users, ShieldAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRbac } from '@/features/roles/components/rbac-provider';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { hasPermission } = useRbac();

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
        {hasPermission('user_management', 'canRead') && (
          <Link
            to="/users"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground [&.active]:bg-accent [&.active]:text-accent-foreground"
          >
            <Users className="w-4 h-4" />
            Users
          </Link>
        )}
        {hasPermission('RBAC_management', 'canRead') && (
          <Link
            to="/rbac/roles"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground [&.active]:bg-accent [&.active]:text-accent-foreground"
          >
            <ShieldAlert className="w-4 h-4" />
            RBAC
          </Link>
        )}
      </nav>
    </div>
  );
}
```
