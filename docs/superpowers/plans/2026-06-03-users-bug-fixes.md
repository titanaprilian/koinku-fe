# Users Bug Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix three reported bugs on the Users page: active/inactive dropdown state persistence, role dropdown displaying ID instead of name, and adding debounce to the search input.

**Architecture:** We will fix the boolean coercion in TanStack Router's `validateSearch`, enhance the role `<SelectValue>` with a fallback lookup to display the name even during initial load, and introduce local state with a `useEffect` timeout for debouncing the search input.

**Tech Stack:** React, TanStack Router, shadcn/ui.

---

### Task 1: Fix Route Search Validation (Active Status Bug)

**Files:**
- Modify: `src/routes/_authenticated/users/index.tsx`

- [ ] **Step 1: Fix boolean parsing in validateSearch**

TanStack Router can pass booleans directly into `validateSearch` when navigating locally, causing `search.isActive === 'true'` to fail if `search.isActive` is already a boolean `true`.

```tsx
// In src/routes/_authenticated/users/index.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useUsers } from '@/features/users/hooks/use-users';
import { UsersFilters } from '@/features/users/components/users-filters';
import { UsersTable } from '@/features/users/components/users-table';
import type { GetUsersParams } from '@/features/users/types';

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: (search: Record<string, unknown>): GetUsersParams => {
    // Safely parse isActive whether it's a string 'true'/'false' or an actual boolean
    let parsedIsActive: boolean | undefined = undefined;
    if (search.isActive !== undefined) {
      parsedIsActive = search.isActive === 'true' || search.isActive === true;
    }

    return {
      page: Number(search?.page) || 1,
      limit: Number(search?.limit) || 10,
      search: search.search as string | undefined,
      roleId: search.roleId as string | undefined,
      isActive: parsedIsActive,
    };
  },
  component: UsersPage,
});

function UsersPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  
  // Ensure we are fetching the right data for the current URL params
  const { data, isLoading } = useUsers(searchParams);

  const updateFilters = (newFilters: Partial<GetUsersParams>) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...newFilters,
        page: 1, // Reset page on filter change
      }),
    });
  };

  const handlePageChange = (page: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page,
      }),
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
      </div>
      
      <UsersFilters
        search={searchParams.search || ''}
        roleId={searchParams.roleId || ''}
        isActive={searchParams.isActive}
        onFilterChange={updateFilters}
      />
      
      <UsersTable
        data={data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
```

### Task 2: Fix Role Label and Implement Search Debounce

**Files:**
- Modify: `src/features/users/components/users-filters.tsx`

- [ ] **Step 1: Update UsersFilters component**

Add local state for the search input and a `useEffect` for debouncing.
Also, look up the selected role's name to pass as children to `<SelectValue>` so it doesn't display the raw ID while loading or if it's pre-filled.

```tsx
// In src/features/users/components/users-filters.tsx
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRoleOptions } from '@/features/roles/hooks/use-role-options';

interface UsersFiltersProps {
  search: string;
  roleId: string;
  isActive?: boolean;
  onFilterChange: (filters: { search?: string; roleId?: string; isActive?: boolean }) => void;
}

export function UsersFilters({ search, roleId, isActive, onFilterChange }: UsersFiltersProps) {
  const { data: rolesData, isLoading: isLoadingRoles } = useRoleOptions({ limit: 100 });
  const roles = rolesData?.data || [];
  
  // Local state for debounce
  const [localSearch, setLocalSearch] = useState(search);

  // Sync local search if parent search changes externally
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        onFilterChange({ search: localSearch });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, search, onFilterChange]);

  // Find the selected role to display its name safely
  const selectedRole = roles.find(r => r.id === roleId);

  return (
    <div className="flex gap-4 mb-4">
      <Input
        placeholder="Search users..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="max-w-sm"
      />
      
      <Select
        value={roleId || 'all'}
        onValueChange={(val) =>
          onFilterChange({ roleId: (!val || val === 'all') ? undefined : val })
        }
        disabled={isLoadingRoles}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={isLoadingRoles ? "Loading roles..." : "All Roles"}>
            {selectedRole ? selectedRole.name : (roleId && roleId !== 'all' ? 'Loading...' : 'All Roles')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              {role.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={isActive === undefined ? 'all' : isActive ? 'true' : 'false'}
        onValueChange={(val) =>
          onFilterChange({ isActive: val === 'all' ? undefined : val === 'true' })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="true">Active</SelectItem>
          <SelectItem value="false">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```
