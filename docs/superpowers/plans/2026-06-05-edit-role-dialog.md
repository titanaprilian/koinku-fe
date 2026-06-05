# Edit Role Dialog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an "Edit Role" dialog that allows users to modify an existing role's name, description, and permissions matrix via `PATCH /rbac/roles/{id}`.

**Architecture:** A Dialog component (`EditRoleDialog`) that fetches the selected role's details (`useRoleById`) and the full list of features (`useFeatures`). The form is pre-filled with the role's current name and description. The permissions matrix is pre-filled by mapping the role's existing permissions to the features list. Submission sends the updated name, description, and the full permissions array to the backend. The roles table will have a new "Edit" action button.

**Tech Stack:** React, TanStack Query, react-hook-form + TypeBox, shadcn/ui.

---

## File Structure

| Action | Path | Responsibility |
|--------|------|----------------|
| **Modify** | `src/features/roles/types.ts` | Add `EditRoleSchema`, `EditRoleFormValues`, `EditRolePayload`, `EditRoleResponse` |
| **Modify** | `src/features/roles/api.ts` | Add `editRole()` API function |
| **Create** | `src/features/roles/hooks/use-edit-role.ts` | TanStack mutation hook for editing a role |
| **Create** | `src/features/roles/components/edit-role-dialog.tsx` | The dialog component with pre-filled form + permissions table |
| **Modify** | `src/features/roles/components/roles-table.tsx` | Add "Edit" button to actions column |
| **Modify** | `src/routes/_authenticated/rbac/roles.tsx` | Add `editRoleId` state and wire `EditRoleDialog` |

---

### Task 1: Add types for Edit Role

**Files:**
- Modify: `src/features/roles/types.ts`

- [ ] **Step 1: Append Edit Role types to the end of the file**

Append the following:

```ts
// ─── Edit Role ──────────────────────────────────────────────────────────────

export const EditRoleSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  description: Type.Optional(Type.String()),
});

export type EditRoleFormValues = Static<typeof EditRoleSchema>;

export interface EditRolePayload {
  name: string;
  description: string | null;
  permissions: PermissionPayload[];
}

export interface EditRoleResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}
```

- [ ] **Step 2: Verify the file has no TypeScript errors**

Run:
```bash
bunx tsc --noEmit --pretty 2>&1 | grep "roles/types" || echo "No errors"
```
Expected: No errors.

---

### Task 3: Create `useEditRole` mutation hook

**Files:**
- Create: `src/features/roles/hooks/use-edit-role.ts`

- [ ] **Step 1: Create the hook file**

Create `src/features/roles/hooks/use-edit-role.ts`:

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editRole } from '../api';
import type { EditRolePayload } from '../types';

interface EditRoleParams {
  id: string;
  payload: EditRolePayload;
}

export function useEditRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: EditRoleParams) => editRole(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', variables.id] });
    },
  });
}
```

---

### Task 4: Build the `EditRoleDialog` component

**Files:**
- Create: `src/features/roles/components/edit-role-dialog.tsx`

- [ ] **Step 1: Create the component file**

Create `src/features/roles/components/edit-role-dialog.tsx`.
Ensure it fetches `useRoleById` and `useFeatures`, pre-fills the form using `useEffect`, and updates `editRoleMutation`.

---

### Task 5: Update `RolesTable` with Edit button

**Files:**
- Modify: `src/features/roles/components/roles-table.tsx`

- [ ] **Step 1: Add Edit button to the actions column**

Add the edit button next to the view button in the table row.

---

### Task 6: Wire the dialog into the Roles page

**Files:**
- Modify: `src/routes/_authenticated/rbac/roles.tsx`

- [ ] **Step 1: Mount `EditRoleDialog`**

```tsx
<EditRoleDialog
  roleId={editRoleId}
  onOpenChange={(open) => {
    if (!open) setEditRoleId(null);
  }}
/>
```
