# Create User (POST /users/) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Create User" flow to the Users page: a form dialog that calls `POST /users/`, validates with TypeBox, populates a role dropdown from the existing roles API, and invalidates the users list on success.

**Architecture:** A `CreateUserForm` component lives in `src/features/users/components/` and is wired into `src/routes/_authenticated/users/index.tsx` via a trigger button on the page header. The API call and TanStack Query mutation live in the `users` feature folder (`api.ts` and a new `use-create-user.ts` hook). TypeBox schema validation is shared between the hook and the form.

**Tech Stack:** React, TypeBox (`@sinclair/typebox`), `@hookform/resolvers/typebox`, `react-hook-form`, TanStack Query (`useMutation`), shadcn/ui (`Dialog`, `Form`, `Input`, `Select`, `Button`, `Switch`), Lucide React icons.

---

## File Map

| Action   | File                                                          | Responsibility                                    |
|----------|---------------------------------------------------------------|---------------------------------------------------|
| Modify   | `src/features/users/types.ts`                                 | Add `CreateUserSchema`, `CreateUserPayload`, `CreateUserResponse` |
| Modify   | `src/features/users/api.ts`                                   | Add `createUser()` API function                   |
| Create   | `src/features/users/hooks/use-create-user.ts`                 | `useMutation` hook with cache invalidation        |
| Create   | `src/features/users/components/create-user-form.tsx`          | Form dialog with TypeBox validation + role dropdown |
| Modify   | `src/routes/_authenticated/users/index.tsx`                   | Add "Add User" button + wire dialog open state    |

---

## Task 1: Add TypeBox types for Create User

**Files:**
- Modify: `src/features/users/types.ts`

- [ ] **Step 1: Append `CreateUserSchema` and response types**

  Add the following to the **top** of `src/features/users/types.ts` (before the existing interfaces), adding the `Type` import:

  ```ts
  import { Type, type Static } from '@sinclair/typebox';

  export const CreateUserSchema = Type.Object({
    email: Type.String({ format: 'email', minLength: 1 }),
    name: Type.String({ minLength: 2, maxLength: 50 }),
    password: Type.String({ minLength: 8 }),
    roleId: Type.String({ minLength: 1 }),
    isActive: Type.Boolean(),
  });

  export type CreateUserPayload = Static<typeof CreateUserSchema>;

  export interface CreateUserResponse {
    error: boolean;
    code: number;
    message: string;
    data: {
      id: string;
      email: string;
      name: string;
      isActive: boolean;
      roleId: string;
      createdAt: string;
      updatedAt: string;
    };
  }

  export interface ApiErrorResponse {
    error: boolean;
    code: number;
    message: string;
    issues: { path: string; message: string }[] | null;
  }
  ```

  > **Note:** `@sinclair/typebox` is already a project dependency. The `@hookform/resolvers/typebox` resolver is used in the form (Task 4) — do not import zod.

- [ ] **Step 2: Verify TypeScript compiles cleanly**

  Run: `bun run build 2>&1 | head -40`
  Expected: No type errors related to `types.ts`.

---

## Task 2: Add `createUser` API function

**Files:**
- Modify: `src/features/users/api.ts`

- [ ] **Step 1: Add `createUser()` to `api.ts`**

  Final file content of `src/features/users/api.ts`:

  ```ts
  import { api } from '@/api/client';
  import type {
    GetUsersParams,
    PaginatedUsersResponse,
    CreateUserPayload,
    CreateUserResponse,
  } from './types';

  export async function getUsers(params: GetUsersParams): Promise<PaginatedUsersResponse> {
    const { data } = await api.get<PaginatedUsersResponse>('/users', { params });
    return data;
  }

  export async function createUser(payload: CreateUserPayload): Promise<CreateUserResponse> {
    const { data } = await api.post<CreateUserResponse>('/users/', payload);
    return data;
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

  Run: `bun run build 2>&1 | head -40`
  Expected: No type errors.

---

## Task 3: Create `useCreateUser` mutation hook

**Files:**
- Create: `src/features/users/hooks/use-create-user.ts`

- [ ] **Step 1: Write the hook**

  ```ts
  import { useMutation, useQueryClient } from '@tanstack/react-query';
  import { createUser } from '../api';
  import type { CreateUserPayload } from '../types';

  export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (payload: CreateUserPayload) => createUser(payload),
      onSuccess: () => {
        // Invalidate all paginated users queries so the list refreshes
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    });
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

  Run: `bun run build 2>&1 | head -40`
  Expected: No type errors.

---

## Task 4: Build the `CreateUserForm` component

**Files:**
- Create: `src/features/users/components/create-user-form.tsx`

- [ ] **Step 1: Install any missing shadcn/ui components**

  Check which are present:
  ```bash
  ls src/components/ui/
  ```

  For each of `dialog`, `form`, `switch` that is **missing**, run the matching install command:
  ```bash
  # if dialog.tsx is missing:
  bunx shadcn@latest add dialog

  # if form.tsx is missing:
  bunx shadcn@latest add form

  # if switch.tsx is missing:
  bunx shadcn@latest add switch
  ```

- [ ] **Step 2: Create `create-user-form.tsx`**

  ```tsx
  import { useForm } from 'react-hook-form';
  import { typeboxResolver } from '@hookform/resolvers/typebox';
  import { Loader2 } from 'lucide-react';

  import { Button } from '@/components/ui/button';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/components/ui/form';
  import { Input } from '@/components/ui/input';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  import { Switch } from '@/components/ui/switch';

  import { useRoleOptions } from '@/features/roles/hooks/use-role-options';
  import { useCreateUser } from '../hooks/use-create-user';
  import { CreateUserSchema, type CreateUserPayload } from '../types';

  interface CreateUserFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }

  export function CreateUserForm({ open, onOpenChange }: CreateUserFormProps) {
    const { mutate: createUser, isPending, error } = useCreateUser();
    const { data: rolesData, isLoading: isLoadingRoles } = useRoleOptions({ limit: 100 });
    const roles = rolesData?.data ?? [];

    const form = useForm<CreateUserPayload>({
      resolver: typeboxResolver(CreateUserSchema),
      defaultValues: {
        email: '',
        name: '',
        password: '',
        roleId: '',
        isActive: true,
      },
    });

    function handleSubmit(values: CreateUserPayload) {
      createUser(values, {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      });
    }

    // Extract server-side field errors from 400 / 409 responses
    const serverError = error as {
      response?: { data?: { message?: string; issues?: { path: string; message: string }[] } };
    } | null;
    const serverMessage = serverError?.response?.data?.message;
    const serverIssues = serverError?.response?.data?.issues ?? [];

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new user account.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              id="create-user-form"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Global server error (e.g. 409 conflict message) */}
              {serverMessage && (
                <p className="text-sm text-destructive">{serverMessage}</p>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                    {serverIssues.find((i) => i.path === 'name') && (
                      <p className="text-sm text-destructive">
                        {serverIssues.find((i) => i.path === 'name')!.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    {serverIssues.find((i) => i.path === 'email') && (
                      <p className="text-sm text-destructive">
                        {serverIssues.find((i) => i.path === 'email')!.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Min. 8 characters" {...field} />
                    </FormControl>
                    <FormMessage />
                    {serverIssues.find((i) => i.path === 'password') && (
                      <p className="text-sm text-destructive">
                        {serverIssues.find((i) => i.path === 'password')!.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoadingRoles}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={isLoadingRoles ? 'Loading roles…' : 'Select a role'}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    {serverIssues.find((i) => i.path === 'roleId') && (
                      <p className="text-sm text-destructive">
                        {serverIssues.find((i) => i.path === 'roleId')!.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <FormLabel className="mb-0">Active</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                onOpenChange(false);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" form="create-user-form" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  ```

- [ ] **Step 3: Verify TypeScript compiles cleanly**

  Run: `bun run build 2>&1 | head -40`
  Expected: No type errors.

---

## Task 5: Wire the form into the Users page

**Files:**
- Modify: `src/routes/_authenticated/users/index.tsx`

- [ ] **Step 1: Replace the full file with the version that includes the "Add User" button**

  ```tsx
  import { useState } from 'react';
  import { createFileRoute, useNavigate } from '@tanstack/react-router';
  import { PlusIcon } from 'lucide-react';

  import { Button } from '@/components/ui/button';
  import { useUsers } from '@/features/users/hooks/use-users';
  import { UsersFilters } from '@/features/users/components/users-filters';
  import { UsersTable } from '@/features/users/components/users-table';
  import { CreateUserForm } from '@/features/users/components/create-user-form';
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
        />

        <CreateUserForm open={createOpen} onOpenChange={setCreateOpen} />
      </div>
    );
  }
  ```

- [ ] **Step 2: Final build check**

  Run: `bun run build 2>&1 | head -60`
  Expected: Clean build, no TypeScript errors.

- [ ] **Step 3: Manual smoke-test in browser**

  Run: `bun run dev`

  Checks:
  1. Navigate to `/users` — **"Add User"** button appears top-right in the header.
  2. Click **"Add User"** — Dialog opens with Name, Email, Password, Role (dropdown), Active (toggle).
  3. Submit with all fields empty — TypeBox client-side errors appear under each field.
  4. Submit with valid data — `POST /users/` fires; on 200 the dialog closes and the table refreshes automatically.
  5. Submit with a duplicate email — 409 message appears at the top of the form.
  6. Submit with an invalid email or password < 8 chars — 400 per-field server errors appear under the relevant inputs.

---

## Commit

After all tasks pass:

```bash
git add \
  src/features/users/types.ts \
  src/features/users/api.ts \
  src/features/users/hooks/use-create-user.ts \
  src/features/users/components/create-user-form.tsx \
  src/routes/_authenticated/users/index.tsx
git commit -m "feat(users): add Create User form with POST /users/ integration"
```
