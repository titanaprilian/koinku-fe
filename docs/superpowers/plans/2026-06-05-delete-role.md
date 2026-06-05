# Delete Role Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the "Delete Role" feature utilizing the `DELETE /rbac/roles/{id}` API endpoint. The feature should include a confirmation dialog to prevent accidental deletions.

**Architecture:** A confirmation dialog (`DeleteRoleDialog`) built using shadcn/ui's `AlertDialog`. The `RolesTable` will have a new "Delete" action button that passes the selected role object to the parent page state. The main `RolesPage` will manage the open state of the dialog and trigger the deletion via a `useDeleteRole` mutation hook, which invalidates the roles list upon success.

**Tech Stack:** React, TanStack Query, shadcn/ui (AlertDialog).

---

## File Structure

| Action | Path | Responsibility |
|--------|------|----------------|
| **Modify** | `src/features/roles/types.ts` | Add `DeleteRoleResponse` interface |
| **Modify** | `src/features/roles/api.ts` | Add `deleteRole()` API function |
| **Create** | `src/features/roles/hooks/use-delete-role.ts` | TanStack mutation hook for deleting a role |
| **Create** | `src/features/roles/components/delete-role-dialog.tsx` | The confirmation dialog component |
| **Modify** | `src/features/roles/components/roles-table.tsx` | Add "Delete" button to the actions column |
| **Modify** | `src/routes/_authenticated/rbac/roles.tsx` | Add `deleteRole` state and wire `DeleteRoleDialog` |

---

### Task 1: Add types for Delete Role

**Files:**
- Modify: `src/features/roles/types.ts`

- [ ] **Step 1: Append Delete Role type to the end of the file**

```ts
// ─── Delete Role ────────────────────────────────────────────────────────────

export interface DeleteRoleResponse {
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

---

### Task 2: Add `deleteRole` API function

**Files:**
- Modify: `src/features/roles/api.ts`

- [ ] **Step 1: Update imports in `api.ts`**
Add `DeleteRoleResponse` to the imports from `./types`.

- [ ] **Step 2: Append the `deleteRole` function**
```ts
export async function deleteRole(id: string): Promise<DeleteRoleResponse> {
  const { data } = await api.delete<DeleteRoleResponse>(`/rbac/roles/${id}`);
  return data;
}
```

---

### Task 3: Create `useDeleteRole` mutation hook

**Files:**
- Create: `src/features/roles/hooks/use-delete-role.ts`

- [ ] **Step 1: Create the hook file**
```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRole } from '../api';

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}
```

---

### Task 4: Build the `DeleteRoleDialog` component

**Files:**
- Create: `src/features/roles/components/delete-role-dialog.tsx`

- [ ] **Step 1: Create the component file using `AlertDialog`**
Imports: `AlertDialog`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogCancel`, `AlertDialogAction` from `@/components/ui/alert-dialog`, and `Loader2` from `lucide-react`.

Props should be:
```ts
interface DeleteRoleDialogProps {
  role: Role | null;
  onOpenChange: (open: boolean) => void;
}
```

The component should display the role name in the description (e.g., `"Are you sure you want to delete the role 'Admin'? This action cannot be undone."`) and call the `useDeleteRole` mutate function when the user clicks the delete action button. Handle the loading state by disabling the buttons and showing a spinner.

---

### Task 5: Update `RolesTable` with Delete button

**Files:**
- Modify: `src/features/roles/components/roles-table.tsx`

- [ ] **Step 1: Add `onDelete` prop**
In `RolesTableProps`, add `onDelete: (role: Role) => void;`.

- [ ] **Step 2: Add Delete button**
Import `TrashIcon` from `lucide-react`.
Add a destructive ghost button to the actions column.

```tsx
<Button
  variant="ghost"
  size="icon"
  className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
  onClick={() => onDelete(role)}
  title="Delete"
>
  <TrashIcon className="h-4 w-4" />
  <span className="sr-only">Delete</span>
</Button>
```

---

### Task 6: Wire the dialog into the Roles page

**Files:**
- Modify: `src/routes/_authenticated/rbac/roles.tsx`

- [ ] **Step 1: Add state**
```ts
const [deleteRole, setDeleteRole] = useState<Role | null>(null);
```

- [ ] **Step 2: Pass `onDelete` to `RolesTable`**
```tsx
<RolesTable
  // ... existing props
  onDelete={setDeleteRole}
/>
```

- [ ] **Step 3: Mount `DeleteRoleDialog`**
```tsx
<DeleteRoleDialog
  role={deleteRole}
  onOpenChange={(open) => {
    if (!open) setDeleteRole(null);
  }}
/>
```

---

### Task 7: Verify build

- [ ] **Step 1: Run type check, build, and lint**
```bash
bun run build && bun run lint
```
Expected: Succeeds with no errors.
