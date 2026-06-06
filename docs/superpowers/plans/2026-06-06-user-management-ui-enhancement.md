# User Management UI Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the usability, visual hierarchy, and overall polish of the User Management data table.

**Architecture:** Update the styling of the existing `UsersTable` component to align with the PRD requirements and the project's `ui-system` design rules. This involves adding background colors to headers, refining row hover states, introducing user initials badges using semantic primary colors, and softening status badges.

**Tech Stack:** React, Tailwind CSS, shadcn/ui

---

### Task 1: Elevate the Data Table Styling

**Files:**
- Modify: `src/features/users/components/users-table.tsx`

- [ ] **Step 1: Update Table Header styling**

Apply a subtle background to the table header and ensure border consistency to distinguish it from data rows. We map the requested `slate-50` to `bg-muted/50`.

```tsx
// In src/features/users/components/users-table.tsx
// Update the TableHeader className:
<TableHeader className="bg-muted/50">
  <TableRow className="border-b border-border hover:bg-transparent">
```

- [ ] **Step 2: Add User Initials Badge**

Add a visual identifier next to each user's name in the table. We map the requested `indigo-100` to `bg-primary/10` and `indigo-700` to `text-primary`.

```tsx
// Inside the TableBody map function, update the Name TableCell:
<TableCell className="px-4 py-4 font-medium">
  <div className="flex items-center gap-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
      {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
    </div>
    <span>{user.name}</span>
  </div>
</TableCell>
```

- [ ] **Step 3: Refine Status Badges**

Replace solid status badges with softer, modern variants using the `ui-system` feedback colors.

```tsx
// Inside the TableBody map function, update the Status TableCell:
<TableCell className="px-4 py-4">
  {user.isActive ? (
    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100">Active</Badge>
  ) : (
    <Badge className="border-border bg-muted text-muted-foreground hover:bg-muted/80">Inactive</Badge>
  )}
</TableCell>
```

- [ ] **Step 4: Verify UI Changes Locally**

Run: `bun run build`
Expected: Type checks and build succeed without errors.
Run: `bun run dev`
Expected: Open the application in the browser, navigate to the User Management page, and visually confirm the new header styles, avatar badges, and status badges match the expected premium feel.
