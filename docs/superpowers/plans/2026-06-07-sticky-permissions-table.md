# Plan: Scroll Container and Sticky Headers for Large Permissions Table

## Objective
Ensure the permissions table remains highly usable and visually clean even when a role has a very large number of permissions (features). Currently, a large list of features causes the entire dialog to stretch vertically, and the table headers scroll out of view, making it hard to track columns.

## Proposed Solution
1. **Add Max-Height and Scroll**: Constrain the permissions table wrapper to a max-height (e.g., `max-h-[350px]`) and enable vertical scrolling (`overflow-y-auto`).
2. **Implement Sticky Table Headers**: Make the table header (`TableHeader`) sticky at the top (`sticky top-0`) with a solid background (e.g., `bg-slate-50 dark:bg-zinc-900`) and a higher z-index (`z-10`) so columns remain anchored and visible as the list of permissions is scrolled.

## Target Files

### 1. Create Role Dialog
**File**: `src/features/roles/components/create-role-dialog.tsx`
- Wrap the table in `<div className="w-full max-h-[350px] overflow-y-auto border rounded-lg relative">`.
- Apply `sticky top-0 bg-slate-50 dark:bg-zinc-900 z-10` to the `<TableHeader>`.

### 2. Edit Role Dialog
**File**: `src/features/roles/components/edit-role-dialog.tsx`
- Wrap the table in `<div className="w-full max-h-[350px] overflow-y-auto border rounded-lg relative">`.
- Apply `sticky top-0 bg-slate-50 dark:bg-zinc-900 z-10` to the `<TableHeader>`.

### 3. Role Detail Permissions Table
**File**: `src/features/roles/components/role-permissions-table.tsx`
- Change `<div className="w-full overflow-x-auto border rounded-lg">` to `<div className="w-full max-h-[350px] overflow-y-auto border rounded-lg relative">`.
- Apply `sticky top-0 bg-slate-50 dark:bg-zinc-900 z-10` to the `<TableHeader>`.

## Verification
1. Run `bun run lint` to verify syntax and formatting.
2. Run `bun run build` to verify type checking and build sanity.
