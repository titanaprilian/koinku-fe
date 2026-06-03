# Users CRUD - Get All Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Get All Users page with a data table, pagination, and filters (search, roleId, isActive).

**Architecture:** We will use TanStack Router for URL state management, syncing search params with the TanStack Query hook `useUsers`. The UI will rely on shadcn components.

**Tech Stack:** React, TanStack Query, TanStack Router, shadcn/ui.

---

### Task 1: Install shadcn UI components

**Files:**
- Create: `src/components/ui/table.tsx`
- Create: `src/components/ui/select.tsx`

- [ ] **Step 1: Add components using shadcn CLI**

Run: `bunx --bun shadcn@latest add table select`
Expected: CLI output confirming successful installation of the components.

### Task 2: Define Types

**Files:**
- Create: `src/features/users/types.ts`

- [ ] **Step 1: Write type definitions**

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  roleId: string;
  roleName: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  roleId?: string;
  isActive?: boolean;
}

export interface PaginatedUsersResponse {
  error: boolean;
  code: number;
  message: string;
  data: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

### Task 3: API Service and Query Hook

**Files:**
- Create: `src/features/users/api.ts`
- Create: `src/features/users/hooks/use-users.ts`

- [ ] **Step 1: Create API functions**

```typescript
import { api } from '@/api/client';
import { GetUsersParams, PaginatedUsersResponse } from './types';

export async function getUsers(params: GetUsersParams): Promise<PaginatedUsersResponse> {
  const { data } = await api.get<PaginatedUsersResponse>('/users', { params });
  return data;
}
```

- [ ] **Step 2: Create Query hook**

```typescript
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getUsers } from '../api';
import { GetUsersParams } from '../types';

export function useUsers(params: GetUsersParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
  });
}
```

### Task 4: UI Components

**Files:**
- Create: `src/features/users/components/users-filters.tsx`
- Create: `src/features/users/components/users-table.tsx`

- [ ] **Step 1: Create filters component**

```tsx
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UsersFiltersProps {
  search: string;
  roleId: string;
  isActive?: boolean;
  onFilterChange: (filters: { search?: string; roleId?: string; isActive?: boolean }) => void;
}

export function UsersFilters({ search, roleId, isActive, onFilterChange }: UsersFiltersProps) {
  return (
    <div className="flex gap-4 mb-4">
      <Input
        placeholder="Search users..."
        value={search}
        onChange={(e) => onFilterChange({ search: e.target.value })}
        className="max-w-sm"
      />
      <Input
        placeholder="Role ID"
        value={roleId}
        onChange={(e) => onFilterChange({ roleId: e.target.value })}
        className="max-w-xs"
      />
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
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="true">Active</SelectItem>
          <SelectItem value="false">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

- [ ] **Step 2: Create table component**

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, PaginatedUsersResponse } from '../types';

interface UsersTableProps {
  data?: PaginatedUsersResponse;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function UsersTable({ data, isLoading, onPageChange }: UsersTableProps) {
  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Loading users...</div>;
  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.roleName}</TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? 'default' : 'secondary'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {data.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {data.data.length > 0 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(data.pagination.page - 1)}
            disabled={data.pagination.page <= 1}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground font-medium px-2">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(data.pagination.page + 1)}
            disabled={data.pagination.page >= data.pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
```

### Task 5: Route Page

**Files:**
- Create: `src/routes/_authenticated/users/index.tsx`

- [ ] **Step 1: Create the route component**

```tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useUsers } from '@/features/users/hooks/use-users';
import { UsersFilters } from '@/features/users/components/users-filters';
import { UsersTable } from '@/features/users/components/users-table';
import { GetUsersParams } from '@/features/users/types';

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: (search: Record<string, unknown>): GetUsersParams => {
    return {
      page: Number(search?.page) || 1,
      limit: Number(search?.limit) || 10,
      search: search.search as string | undefined,
      roleId: search.roleId as string | undefined,
      isActive: search.isActive !== undefined ? search.isActive === 'true' : undefined,
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
