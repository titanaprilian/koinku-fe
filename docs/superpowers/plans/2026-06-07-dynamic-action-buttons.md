# Dynamic Action Buttons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dynamically render Edit and Delete action buttons in the Users and RBAC tables based on the logged-in user's permissions (`canUpdate` and `canDelete`).

**Architecture:** We will consume the `useRbac` hook inside the `UsersTable` and `RolesTable` components. We will wrap the Edit buttons with a `canUpdate` permission check and the Delete buttons with a `canDelete` permission check, mapping to the appropriate feature keys (`user_management` and `RBAC_management` respectively).

**Tech Stack:** React, TanStack Router, TanStack Query, Tailwind CSS, lucide-react

---

### Task 1: Make Users Table Buttons Dynamic

**Files:**
- Modify: `src/features/users/components/users-table.tsx`

- [ ] **Step 1: Import and consume `useRbac`**
Import `useRbac` at the top of the file and invoke it at the start of the `UsersTable` component.

```tsx
import { useRbac } from '@/features/roles/components/rbac-provider';

// Inside UsersTable:
const { hasPermission } = useRbac();
```

- [ ] **Step 2: Conditionally render the Edit and Delete buttons**
Wrap the edit and delete buttons in the table row's actions column with permission checks.

```tsx
                  {hasPermission('user_management', 'canUpdate') && (
                    <Button
                      variant="ghost"
                      size="icon"
                      id={`edit-user-${user.id}`}
                      className="hover:bg-muted text-muted-foreground"
                      onClick={() => onEdit(user.id)}
                      title="Edit"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  )}
                  {hasPermission('user_management', 'canDelete') && (
                    <Button
                      variant="ghost"
                      size="icon"
                      id={`delete-user-${user.id}`}
                      className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete?.(user.id)}
                      title="Delete"
                    >
                      <Trash2Icon className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
```

### Task 2: Make Roles Table Buttons Dynamic

**Files:**
- Modify: `src/features/roles/components/roles-table.tsx`

- [ ] **Step 1: Import and consume `useRbac`**
Import `useRbac` at the top of the file and invoke it at the start of the `RolesTable` component.

```tsx
import { useRbac } from './rbac-provider';

// Inside RolesTable:
const { hasPermission } = useRbac();
```

- [ ] **Step 2: Conditionally render the Edit and Delete buttons**
Wrap the edit and delete buttons in the table row's actions column with permission checks.

```tsx
                  {hasPermission('RBAC_management', 'canUpdate') && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-muted text-muted-foreground"
                      onClick={() => onEdit(role.id)}
                      title="Edit"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  )}
                  {hasPermission('RBAC_management', 'canDelete') && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                      onClick={() => onDelete(role)}
                      title="Delete"
                    >
                      <Trash2Icon className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
```

### Task 3: Build & Lint Validation

- [ ] **Step 1: Run project validation**
Run `bun run build && bun run lint` to ensure that all changes compile properly and no lint errors are introduced.
