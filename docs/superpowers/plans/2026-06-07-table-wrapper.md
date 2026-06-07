# Table Wrapper Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract a reusable `TableWrapper` component to standardise the structural styling (white background, header/footer borders, padding) for data tables across the app, and update Users and Roles to use it.

**Architecture:** We will create a composable `TableWrapper` set of components in the `ui` folder. The page-level routes will wrap their respective filters and tables in this new component. The table components will be updated to return Fragments containing the content and footer (pagination) areas, removing their hardcoded structural classes.

**Tech Stack:** React, Tailwind CSS v4, shadcn/ui

---

### Task 1: Create the TableWrapper Component

**Files:**
- Create: `src/components/ui/table-wrapper.tsx`
- Modify: `src/components/ui/index.ts` (if it exists, though typically shadcn components are just imported directly)

- [ ] **Step 1: Write the minimal implementation**

Create `src/components/ui/table-wrapper.tsx` with the following code:

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const TableWrapper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("bg-card text-card-foreground shadow-sm border rounded-xl overflow-hidden", className)}
      {...props}
    />
  )
)
TableWrapper.displayName = "TableWrapper"

const TableWrapperHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 border-b border-border", className)}
      {...props}
    />
  )
)
TableWrapperHeader.displayName = "TableWrapperHeader"

const TableWrapperContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("w-full overflow-auto", className)}
      {...props}
    />
  )
)
TableWrapperContent.displayName = "TableWrapperContent"

const TableWrapperFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-border bg-card", className)}
      {...props}
    />
  )
)
TableWrapperFooter.displayName = "TableWrapperFooter"

export {
  TableWrapper,
  TableWrapperHeader,
  TableWrapperContent,
  TableWrapperFooter,
}
```

### Task 2: Refactor Users Page and Table

**Files:**
- Modify: `src/routes/_authenticated/users/index.tsx`
- Modify: `src/features/users/components/users-table.tsx`

- [ ] **Step 1: Update Users Route to use TableWrapper**

In `src/routes/_authenticated/users/index.tsx`, import the new component:

```tsx
import {
  TableWrapper,
  TableWrapperHeader,
} from '@/components/ui/table-wrapper';
```

Replace the existing `<div className="bg-card text-card-foreground shadow-sm border rounded-xl">` wrapper around the filters and table with `TableWrapper`:

```tsx
      <TableWrapper>
        <TableWrapperHeader>
          <UsersFilters
            search={searchParams.search || ''}
            roleId={searchParams.roleId || ''}
            isActive={searchParams.isActive}
            onFilterChange={updateFilters}
          />
        </TableWrapperHeader>

        <UsersTable
          data={data}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onDetail={setSelectedUserId}
          onEdit={setEditUserId}
          onDelete={setDeleteUserId}
        />
      </TableWrapper>
```

- [ ] **Step 2: Update UsersTable component to use inner wrappers**

In `src/features/users/components/users-table.tsx`, import the sub-components:

```tsx
import { TableWrapperContent, TableWrapperFooter } from '@/components/ui/table-wrapper';
```

Replace the outer `<div className="w-full">` and inner wrappers with Fragments and the new wrapper components:

```tsx
  return (
    <>
      <TableWrapperContent>
        <Table>
          {/* TableHeader and TableBody content remains unchanged */}
          ...
        </Table>
      </TableWrapperContent>
      
      {data.data.length > 0 && (
        <TableWrapperFooter>
          {/* Pagination controls inside remain unchanged */}
          ...
        </TableWrapperFooter>
      )}
    </>
  );
```

### Task 3: Refactor Roles Page and Table

**Files:**
- Modify: `src/routes/_authenticated/rbac/roles.tsx`
- Modify: `src/features/roles/components/roles-table.tsx`

- [ ] **Step 1: Update Roles Route to use TableWrapper**

In `src/routes/_authenticated/rbac/roles.tsx`, import the new component:

```tsx
import {
  TableWrapper,
  TableWrapperHeader,
} from '@/components/ui/table-wrapper';
```

Wrap `RolesFilters` and `RolesTable` in the new `TableWrapper`:

```tsx
      <TableWrapper>
        <TableWrapperHeader>
          <RolesFilters
            search={searchParams.search || ''}
            onFilterChange={updateFilters}
          />
        </TableWrapperHeader>

        <RolesTable
          data={data}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onView={setViewRoleId}
          onEdit={setEditRoleId}
          onDelete={setDeleteRole}
        />
      </TableWrapper>
```

- [ ] **Step 2: Update RolesTable component to use inner wrappers**

In `src/features/roles/components/roles-table.tsx`, import the sub-components:

```tsx
import { TableWrapperContent, TableWrapperFooter } from '@/components/ui/table-wrapper';
```

Replace the outer `<div className="space-y-4">` and its nested `<div className="border rounded-md">` and pagination div with Fragments and the new wrapper components:

```tsx
  return (
    <>
      <TableWrapperContent>
        <Table>
          {/* TableHeader and TableBody content remains unchanged */}
          ...
        </Table>
      </TableWrapperContent>
      
      {data.data.length > 0 && (
        <TableWrapperFooter>
          {/* Pagination controls inside remain unchanged */}
          ...
        </TableWrapperFooter>
      )}
    </>
  );
```

### Task 4: Update UI System Documentation

**Files:**
- Modify: `.agents/skills/ui-system/rules/components.md`

- [ ] **Step 1: Add TableWrapper to the Tables section**

In `.agents/skills/ui-system/rules/components.md`, locate the `### Tables` section. Append the following documentation snippet showing how to use `TableWrapper`:

```markdown
**Table Wrapper Composition:**

Always wrap Tables and their associated Filters/Pagination in a `TableWrapper` to maintain consistent structural styling (white background, borders, and padding).

```tsx
import { TableWrapper, TableWrapperHeader, TableWrapperContent, TableWrapperFooter } from "@/components/ui/table-wrapper"

<TableWrapper>
  <TableWrapperHeader>
    <Filters />
  </TableWrapperHeader>
  <TableWrapperContent>
    <Table>
      {/* table content */}
    </Table>
  </TableWrapperContent>
  <TableWrapperFooter>
    <Pagination />
  </TableWrapperFooter>
</TableWrapper>
```
```

- [ ] **Step 2: Verify application builds without errors**

Run: `bun run build`
Expected: Passes without TypeScript errors.
