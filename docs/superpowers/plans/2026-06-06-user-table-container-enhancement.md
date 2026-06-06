# User Table Container Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the visual hierarchy and usability of the User Management table by introducing a dedicated card container, enhancing header contrast, and refining internal spacing according to the PRD.

**Architecture:** 
We will wrap the `UsersFilters` and `UsersTable` components in `src/routes/_authenticated/users/index.tsx` within a new `bg-card` container with shadow and border. In `src/features/users/components/users-table.tsx`, we will remove the outer borders around the table to let it span the full width of the new container, and apply `p-6` padding to the pagination area for comfortable spacing. The table header already uses `bg-muted/50`, satisfying the contrast requirement using our design system tokens.

**Tech Stack:** React, Tailwind CSS, shadcn/ui

---

### Task 1: Introduce Dedicated Table Container

**Files:**
- Modify: `src/routes/_authenticated/users/index.tsx`

- [ ] **Step 1: Wrap filters and table in a card container**

In the `UsersPage` component's return statement, locate the `UsersFilters` and `UsersTable` components. Wrap them in a new `div` with card styling, and wrap `UsersFilters` in a padded container with a bottom border.

```tsx
// Replace the existing UsersFilters and UsersTable with:
      <div className="bg-card text-card-foreground shadow-sm border rounded-xl">
        <div className="p-6 border-b border-border">
          <UsersFilters
            search={searchParams.search || ''}
            roleId={searchParams.roleId || ''}
            isActive={searchParams.isActive}
            onFilterChange={updateFilters}
          />
        </div>

        <UsersTable
          data={data}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onDetail={setSelectedUserId}
          onEdit={setEditUserId}
          onDelete={setDeleteUserId}
        />
      </div>
```

- [ ] **Step 2: Run build to verify syntax**

Run: `bun run build`
Expected: Passes without errors.

---

### Task 2: Refine Table Component Spacing

**Files:**
- Modify: `src/features/users/components/users-table.tsx`

- [ ] **Step 1: Update loading state padding**

Update the loading state to include consistent padding.

```tsx
  if (isLoading) return <div className="p-6 text-center text-muted-foreground">Loading users...</div>;
```

- [ ] **Step 2: Remove inner borders and add full width**

Replace the outer wrappers around the `<Table>` component. Remove the `space-y-4` and `border rounded-md` wrappers so the table spans the full width of the new card container.

```tsx
// Change the outer wrapper from:
// <div className="space-y-4">
//   <div className="border rounded-md">
//     <Table>
// To:
    <div className="w-full">
      <div className="w-full overflow-auto">
        <Table>
```

- [ ] **Step 3: Update pagination spacing**

At the bottom of the component, locate the pagination container (`<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">`). Update its classes to use `p-6` padding and a top border instead of `mt-4`.

```tsx
// Replace the pagination wrapper div with:
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-border">
          <div className="flex items-center space-x-2">
```

- [ ] **Step 4: Close tags properly**

Ensure the closing `</div>` tags match the new structure.

```tsx
      {data.data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-border">
          {/* ... pagination content ... */}
        </div>
      )}
    </div>
```

- [ ] **Step 5: Run build to verify changes**

Run: `bun run build`
Expected: Passes without errors.

---

## Local Testing

- Start the development server (`bun run dev`).
- Navigate to the Users page.
- Verify the table is enclosed within a white card container (`bg-white shadow-sm border rounded-xl`).
- Verify the Search & Filters area has `p-6` padding and a border separating it from the table.
- Verify the table header has a subtle background (`bg-muted/50`).
- Verify the pagination area has `p-6` padding and a top border.
