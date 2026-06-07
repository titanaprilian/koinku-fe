# Dynamic Create Buttons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dynamically render the "Add User" and "Create Role" buttons in the Users and RBAC pages based on the logged-in user's permissions (`canCreate`).

**Architecture:** We will consume the `useRbac` hook in the Users page route component and the Roles page route component. We will wrap the "Add User" button with a `canCreate` permission check for the `user_management` feature, and wrap the "Create Role" button with a `canCreate` permission check for the `RBAC_management` feature.

**Tech Stack:** React, TanStack Router, TanStack Query

---

### Task 1: Make "Add User" Button Dynamic

**Files:**
- Modify: `src/routes/_authenticated/users/index.tsx`

- [ ] **Step 1: Import and consume `useRbac`**
Import `useRbac` and call it at the beginning of the `UsersPage` component.

```tsx
import { useRbac } from '@/features/roles/components/rbac-provider';

// Inside UsersPage:
const { hasPermission } = useRbac();
```

- [ ] **Step 2: Conditionally render the "Add User" button**
Wrap the "Add User" button with `hasPermission('user_management', 'canCreate')` check.

```tsx
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        {hasPermission('user_management', 'canCreate') && (
          <Button id="add-user-button" onClick={() => setCreateOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add User
          </Button>
        )}
      </div>
```

### Task 2: Make "Create Role" Button Dynamic

**Files:**
- Modify: `src/routes/_authenticated/rbac/roles.tsx`

- [ ] **Step 1: Import and consume `useRbac`**
Import `useRbac` and call it at the beginning of the `RolesPage` component.

```tsx
import { useRbac } from '@/features/roles/components/rbac-provider';

// Inside RolesPage:
const { hasPermission } = useRbac();
```

- [ ] **Step 2: Conditionally render the "Create Role" button**
Wrap the "Create Role" button with `hasPermission('RBAC_management', 'canCreate')` check.

```tsx
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
        {hasPermission('RBAC_management', 'canCreate') && (
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        )}
      </div>
```

### Task 3: Build & Lint Validation

- [ ] **Step 1: Run project validation**
Run `bun run build && bun run lint` to ensure that all changes compile properly and no lint errors are introduced.
