# Plan: Refine Role Detail Dialog Typography & Emphasize Active Permissions

## Objective
Enhance the visual hierarchy and clarity in the Role Detail Dialog and Role Permissions Table.

## Tasks

### 1. Refine Typography in Role Detail Dialog
**Target File**: `src/features/roles/components/role-detail-dialog.tsx`
- **Soften Labels**: Modify the uppercase header labels ("ROLE ID", "NAME", "DESCRIPTION") to be smaller and lighter so they recede into the background, pushing the actual data forward.
  - Proposed Classes: `text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase`
- **Add Copy Action**: Add a subtle `Copy` icon from `lucide-react` next to the Role ID.
  - Implement an `onClick` handler that writes the Role ID to `navigator.clipboard`.
  - Trigger a success toast notification using `toast` from `'sonner'`.
  - The copy button should appear seamlessly aligned with the Role ID. A hover effect (`opacity-0 group-hover:opacity-100`) will make it discoverable without adding clutter.

### 2. Emphasize Active Permissions in the Table
**Target File**: `src/features/roles/components/role-permissions-table.tsx`
- **Mute Inactive States**: The current table displays 'X' marks for inactive permissions, which causes visual noise.
  - Replace the `<X>` icon with a `<Minus>` icon from `lucide-react`.
  - Use a faint, muted color (e.g., `text-slate-300 dark:text-slate-700`) to significantly push it into the background.
  - This change allows the active green `<Check>` marks to stand out and makes scanning the table effortless.

## Execution
Once this plan is approved, I will implement these changes and run lint/type checks to verify everything remains strictly formatted and correct.
