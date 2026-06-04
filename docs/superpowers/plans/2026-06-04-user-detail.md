# User Detail (GET /users/{id}) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Detail" action button to each row in the Users table that fetches `GET /users/{id}` and displays the full user record in a read-only dialog.

**Architecture:** A `UserDetailDialog` component in `src/features/users/components/` fetches and renders a single user on demand via a `useUserById` hook. `UsersTable` receives an `onDetail` callback prop and renders an Actions column with a "Detail" button per row. The table state (which user ID is selected) is owned by the `UsersPage` route component.

**Tech Stack:** React, TanStack Query (`useQuery`), shadcn/ui (`Dialog`, `Badge`, `Skeleton`), Lucide React (`EyeIcon`, `Loader2`).

---

## File Map

| Action   | File                                                                | Responsibility                                       |
|----------|---------------------------------------------------------------------|------------------------------------------------------|
| Modify   | `src/features/users/types.ts`                                       | Add `GetUserByIdResponse` interface                  |
| Modify   | `src/features/users/api.ts`                                         | Add `getUserById()` API function                     |
| Create   | `src/features/users/hooks/use-user-by-id.ts`                        | `useQuery` hook for single-user fetch                |
| Create   | `src/features/users/components/user-detail-dialog.tsx`              | Read-only detail dialog with loading & error states  |
| Modify   | `src/features/users/components/users-table.tsx`                     | Add Actions column + Detail button per row           |
| Modify   | `src/routes/_authenticated/users/index.tsx`                         | Own `selectedUserId` state, wire to table + dialog   |

---

## Task 1: Add `GetUserByIdResponse` type

**Files:**
- Modify: `src/features/users/types.ts`

- [ ] **Step 1: Append `GetUserByIdResponse` to `src/features/users/types.ts`**

  The API response for `GET /users/{id}` returns the full user including `roleName`. Add this interface after the existing `ApiErrorResponse`:

  ```ts
  export interface GetUserByIdResponse {
    error: boolean;
    code: number;
    message: string;
    data: {
      id: string;
      email: string;
      name: string;
      isActive: boolean;
      roleId: string;
      roleName: string;
      createdAt: string;
      updatedAt: string;
    };
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

  Run: `bun run build 2>&1 | head -30`
  Expected: No errors.

---

## Task 2: Add `getUserById` API function and `useUserById` hook

**Files:**
- Modify: `src/features/users/api.ts`
- Create: `src/features/users/hooks/use-user-by-id.ts`

- [ ] **Step 1: Add `getUserById()` to `src/features/users/api.ts`**

  Final content of `src/features/users/api.ts`:

  ```ts
  import { api } from '@/api/client';
  import type {
    GetUsersParams,
    PaginatedUsersResponse,
    CreateUserPayload,
    CreateUserResponse,
    GetUserByIdResponse,
  } from './types';

  export async function getUsers(params: GetUsersParams): Promise<PaginatedUsersResponse> {
    const { data } = await api.get<PaginatedUsersResponse>('/users', { params });
    return data;
  }

  export async function createUser(payload: CreateUserPayload): Promise<CreateUserResponse> {
    const { data } = await api.post<CreateUserResponse>('/users/', payload);
    return data;
  }

  export async function getUserById(id: string): Promise<GetUserByIdResponse> {
    const { data } = await api.get<GetUserByIdResponse>(`/users/${id}`);
    return data;
  }
  ```

- [ ] **Step 2: Create `src/features/users/hooks/use-user-by-id.ts`**

  ```ts
  import { useQuery } from '@tanstack/react-query';
  import { getUserById } from '../api';

  export function useUserById(id: string | null) {
    return useQuery({
      queryKey: ['users', id],
      queryFn: () => getUserById(id!),
      enabled: id !== null,
    });
  }
  ```

  > `enabled: id !== null` ensures the query only fires when a user ID is selected (dialog is open). When the dialog closes and `id` resets to `null`, no stale request is made.

- [ ] **Step 3: Verify TypeScript compiles cleanly**

  Run: `bun run build 2>&1 | head -30`
  Expected: No errors.

---

## Task 3: Build `UserDetailDialog` component

**Files:**
- Create: `src/features/users/components/user-detail-dialog.tsx`

> `Dialog`, `Badge`, and `Skeleton` are already present in `src/components/ui/`. No installs needed.

- [ ] **Step 1: Create `src/features/users/components/user-detail-dialog.tsx`**

  ```tsx
  import { Loader2 } from 'lucide-react';
  import { Badge } from '@/components/ui/badge';
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from '@/components/ui/dialog';
  import { Skeleton } from '@/components/ui/skeleton';
  import { useUserById } from '../hooks/use-user-by-id';

  interface UserDetailDialogProps {
    userId: string | null;
    onOpenChange: (open: boolean) => void;
  }

  export function UserDetailDialog({ userId, onOpenChange }: UserDetailDialogProps) {
    const open = userId !== null;
    const { data, isLoading, isError } = useUserById(userId);
    const user = data?.data;

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Detail</DialogTitle>
            <DialogDescription>
              Read-only view of the selected user account.
            </DialogDescription>
          </DialogHeader>

          {isLoading && (
            <div className="space-y-3 py-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          )}

          {isError && (
            <p className="text-sm text-destructive py-2">
              User not found or an error occurred.
            </p>
          )}

          {user && !isLoading && (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground font-medium">Name</dt>
                <dd className="font-semibold">{user.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground font-medium">Email</dt>
                <dd>{user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground font-medium">Role</dt>
                <dd>{user.roleName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground font-medium">Status</dt>
                <dd>
                  <Badge variant={user.isActive ? 'default' : 'secondary'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground font-medium">Created</dt>
                <dd>{new Date(user.createdAt).toLocaleDateString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground font-medium">Updated</dt>
                <dd>{new Date(user.updatedAt).toLocaleDateString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground font-medium">ID</dt>
                <dd className="font-mono text-xs break-all">{user.id}</dd>
              </div>
            </dl>
          )}
        </DialogContent>
      </Dialog>
    );
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

  Run: `bun run build 2>&1 | head -30`
  Expected: No errors.

---

## Task 4: Add Actions column to `UsersTable` and wire into `UsersPage`

**Files:**
- Modify: `src/features/users/components/users-table.tsx`
- Modify: `src/routes/_authenticated/users/index.tsx`

- [ ] **Step 1: Update `src/features/users/components/users-table.tsx`**

  Add an `onDetail` prop and an Actions column with a "Detail" button per row. Final file content:

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
  import { EyeIcon } from 'lucide-react';
  import type { User, PaginatedUsersResponse } from '../types';

  interface UsersTableProps {
    data?: PaginatedUsersResponse;
    isLoading: boolean;
    onPageChange: (page: number) => void;
    onDetail: (userId: string) => void;
  }

  export function UsersTable({ data, isLoading, onPageChange, onDetail }: UsersTableProps) {
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
                <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      id={`detail-user-${user.id}`}
                      onClick={() => onDetail(user.id)}
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {data.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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

- [ ] **Step 2: Update `src/routes/_authenticated/users/index.tsx`**

  Add `selectedUserId` state, pass `onDetail` to `UsersTable`, and render `UserDetailDialog`. Final file content:

  ```tsx
  import { useState } from 'react';
  import { createFileRoute, useNavigate } from '@tanstack/react-router';
  import { PlusIcon } from 'lucide-react';

  import { Button } from '@/components/ui/button';
  import { useUsers } from '@/features/users/hooks/use-users';
  import { UsersFilters } from '@/features/users/components/users-filters';
  import { UsersTable } from '@/features/users/components/users-table';
  import { CreateUserForm } from '@/features/users/components/create-user-form';
  import { UserDetailDialog } from '@/features/users/components/user-detail-dialog';
  import type { GetUsersParams } from '@/features/users/types';

  export const Route = createFileRoute('/_authenticated/users/')({
    validateSearch: (search: Record<string, unknown>): GetUsersParams => {
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
    const [createOpen, setCreateOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const { data, isLoading } = useUsers(searchParams);

    const updateFilters = (newFilters: Partial<GetUsersParams>) => {
      navigate({
        search: (prev) => ({
          ...prev,
          ...newFilters,
          page: 1,
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
          <Button id="add-user-button" onClick={() => setCreateOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add User
          </Button>
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
          onDetail={setSelectedUserId}
        />

        <CreateUserForm open={createOpen} onOpenChange={setCreateOpen} />

        <UserDetailDialog
          userId={selectedUserId}
          onOpenChange={(open) => {
            if (!open) setSelectedUserId(null);
          }}
        />
      </div>
    );
  }
  ```

- [ ] **Step 3: Final build check**

  Run: `bun run build 2>&1 | head -60`
  Expected: Clean build, no TypeScript errors.

- [ ] **Step 4: Manual smoke-test in browser**

  Run: `bun run dev`

  Checks:
  1. Navigate to `/users` — table now has an **Actions** column with an **Detail** button per row.
  2. Click **Detail** on any row — dialog opens immediately with skeleton loading state.
  3. When data loads, dialog shows the user's Name, Email, Role, Status badge, Created/Updated dates, and ID.
  4. If the API returns 404 (deleted user) — dialog shows "User not found or an error occurred." error message.
  5. Close dialog — `selectedUserId` resets to `null`, dialog closes cleanly.

---

## Commit

After all tasks pass:

```bash
git add \
  src/features/users/types.ts \
  src/features/users/api.ts \
  src/features/users/hooks/use-user-by-id.ts \
  src/features/users/components/user-detail-dialog.tsx \
  src/features/users/components/users-table.tsx \
  src/routes/_authenticated/users/index.tsx
git commit -m "feat(users): add Detail action button with GET /users/{id} dialog"
```
