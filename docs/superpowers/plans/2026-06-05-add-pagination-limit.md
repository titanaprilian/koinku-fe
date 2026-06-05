# Pagination Limit Dropdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dropdown to the pagination component so users can choose the page limit (rows per page) in the users and roles tables.

**Architecture:** We will add an `onLimitChange` callback to `UsersTable` and `RolesTable` properties. We'll add Shadcn's `Select` component to the pagination section of both tables to select the limit from preset options (10, 20, 30, 40, 50). We will update the route files to implement the `onLimitChange` handler and update the URL search parameters to reflect the new limit and reset the page back to 1.

**Tech Stack:** React, TanStack Router, Shadcn UI (`Select` component), TailwindCSS.

---

### Task 1: Update RolesTable to support Limit Dropdown

**Files:**
- Modify: `src/features/roles/components/roles-table.tsx`

- [ ] **Step 1: Update Imports**
  Add the `Select` component imports from Shadcn at the top of the file.

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
```

- [ ] **Step 2: Update RolesTableProps**
  Add the `onLimitChange` prop to `RolesTableProps`.

```tsx
interface RolesTableProps {
  data?: PaginatedRolesResponse;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void; // Added prop
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (role: Role) => void;
}
```

- [ ] **Step 3: Update RolesTable signature**
  Destructure the new `onLimitChange` prop.

```tsx
export function RolesTable({ data, isLoading, onPageChange, onLimitChange, onView, onEdit, onDelete }: RolesTableProps) {
```

- [ ] **Step 4: Add the Select component to the pagination section**
  Replace the current pagination wrapper `div` starting at `{data.data.length > 0 && (` with the new layout that includes the dropdown.

```tsx
      {data.data.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Rows per page</span>
            <Select
              value={data.pagination.limit.toString()}
              onValueChange={(val) => onLimitChange(Number(val))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={data.pagination.limit.toString()} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              className="rounded-full hover:bg-muted px-4"
              onClick={() => onPageChange(data.pagination.page - 1)}
              disabled={data.pagination.page <= 1}
            >
              Previous
            </Button>
            <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground h-9 px-4 text-sm font-medium">
              {data.pagination.page}
            </div>
            <Button
              variant="ghost"
              className="rounded-full hover:bg-muted px-4"
              onClick={() => onPageChange(data.pagination.page + 1)}
              disabled={data.pagination.page >= data.pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
```

### Task 2: Implement onLimitChange in Roles Page

**Files:**
- Modify: `src/routes/_authenticated/rbac/roles.tsx`

- [ ] **Step 1: Add handleLimitChange function**
  Add the handler in `RolesPage` right below `handlePageChange`.

```tsx
  const handleLimitChange = (limit: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        limit,
        page: 1, // Reset page when limit changes
      }),
    });
  };
```

- [ ] **Step 2: Pass onLimitChange to RolesTable**
  Update the `RolesTable` rendering to pass the new prop.

```tsx
      <RolesTable
        data={data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onView={setViewRoleId}
        onEdit={setEditRoleId}
        onDelete={setDeleteRole}
      />
```

### Task 3: Update UsersTable to support Limit Dropdown

**Files:**
- Modify: `src/features/users/components/users-table.tsx`

- [ ] **Step 1: Update Imports**
  Add the `Select` component imports from Shadcn at the top of the file.

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
```

- [ ] **Step 2: Update UsersTableProps**
  Add the `onLimitChange` prop to `UsersTableProps`.

```tsx
interface UsersTableProps {
  data?: PaginatedUsersResponse;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void; // Added prop
  onDetail: (userId: string) => void;
  onEdit: (userId: string) => void;
  onDelete?: (userId: string) => void;
}
```

- [ ] **Step 3: Update UsersTable signature**
  Destructure the new `onLimitChange` prop.

```tsx
export function UsersTable({ data, isLoading, onPageChange, onLimitChange, onDetail, onEdit, onDelete }: UsersTableProps) {
```

- [ ] **Step 4: Add the Select component to the pagination section**
  Replace the current pagination wrapper `div` starting at `{data.data.length > 0 && (` with the new layout that includes the dropdown.

```tsx
      {data.data.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Rows per page</span>
            <Select
              value={data.pagination.limit.toString()}
              onValueChange={(val) => onLimitChange(Number(val))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={data.pagination.limit.toString()} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              className="rounded-full hover:bg-muted px-4"
              onClick={() => onPageChange(data.pagination.page - 1)}
              disabled={data.pagination.page <= 1}
            >
              Previous
            </Button>
            <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground h-9 px-4 text-sm font-medium">
              {data.pagination.page}
            </div>
            <Button
              variant="ghost"
              className="rounded-full hover:bg-muted px-4"
              onClick={() => onPageChange(data.pagination.page + 1)}
              disabled={data.pagination.page >= data.pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
```

### Task 4: Implement onLimitChange in Users Page

**Files:**
- Modify: `src/routes/_authenticated/users/index.tsx`

- [ ] **Step 1: Add handleLimitChange function**
  Add the handler in `UsersPage` right below `handlePageChange`.

```tsx
  const handleLimitChange = (limit: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        limit,
        page: 1, // Reset page when limit changes
      }),
    });
  };
```

- [ ] **Step 2: Pass onLimitChange to UsersTable**
  Update the `UsersTable` rendering to pass the new prop.

```tsx
      <UsersTable
        data={data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onDetail={setSelectedUserId}
        onEdit={setEditUserId}
        onDelete={setDeleteUserId}
      />
```
