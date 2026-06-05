# Table Row Index Column (No.) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "No." row index column to both the Users and Roles tables that displays the overall sequence number of each record, taking pagination into account.

**Architecture:** We will compute the base offset number for the current page (`(page - 1) * limit`). We will map over the data arrays with the row index, display `baseOffset + index + 1` in the first column, and adjust the `colSpan` of the empty/fallback rows accordingly.

**Tech Stack:** React, Tailwind CSS, Shadcn UI.

---

### Task 1: Add Row Index Column to UsersTable

**Files:**
- Modify: `src/features/users/components/users-table.tsx`

- [ ] **Step 1: Calculate the start number offset**
  Near the top of the `UsersTable` component function, define the base starting number based on current page and limit.

```tsx
  const startNumber = (data.pagination.page - 1) * data.pagination.limit;
```

- [ ] **Step 2: Add 'No.' header to TableHeader**
  Add a new `<TableHead>` as the first column in the header.

```tsx
          <TableHeader>
            <TableRow className="border-b border-border/50 hover:bg-transparent">
              <TableHead className="w-[80px] px-4 py-3 text-muted-foreground font-medium">No.</TableHead>
              <TableHead className="px-4 py-3 text-muted-foreground font-medium">Name</TableHead>
              <TableHead className="px-4 py-3 text-muted-foreground font-medium">Email</TableHead>
              <TableHead className="px-4 py-3 text-muted-foreground font-medium">Role</TableHead>
              <TableHead className="px-4 py-3 text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="px-4 py-3 text-right text-muted-foreground font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
```

- [ ] **Step 3: Update map and add index cell in TableBody**
  Modify `data.data.map` to receive `index` and insert the row number cell.

```tsx
            {data.data.map((user: User, index: number) => (
              <TableRow key={user.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <TableCell className="px-4 py-4 text-muted-foreground font-medium">{startNumber + index + 1}</TableCell>
                <TableCell className="px-4 py-4 font-medium">{user.name}</TableCell>
                <TableCell className="px-4 py-4">{user.email}</TableCell>
                <TableCell className="px-4 py-4">{user.roleName}</TableCell>
```

- [ ] **Step 4: Update colSpan for fallback empty row**
  Increase `colSpan` from `5` to `6` to account for the new column.

```tsx
            {data.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
```

### Task 2: Add Row Index Column to RolesTable

**Files:**
- Modify: `src/features/roles/components/roles-table.tsx`

- [ ] **Step 1: Calculate the start number offset**
  Near the top of the `RolesTable` component function, define the base starting number based on current page and limit.

```tsx
  const startNumber = (data.pagination.page - 1) * data.pagination.limit;
```

- [ ] **Step 2: Add 'No.' header to TableHeader**
  Add a new `<TableHead>` as the first column in the header.

```tsx
          <TableHeader>
            <TableRow className="border-b border-border/50 hover:bg-transparent">
              <TableHead className="w-[80px] px-4 py-3 text-muted-foreground font-medium">No.</TableHead>
              <TableHead className="px-4 py-3 text-muted-foreground font-medium">Name</TableHead>
              <TableHead className="px-4 py-3 text-muted-foreground font-medium">Description</TableHead>
              <TableHead className="px-4 py-3 text-muted-foreground font-medium">Created At</TableHead>
              <TableHead className="px-4 py-3 text-right text-muted-foreground font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
```

- [ ] **Step 3: Update map and add index cell in TableBody**
  Modify `data.data.map` to receive `index` and insert the row number cell.

```tsx
            {data.data.map((role: Role, index: number) => (
              <TableRow key={role.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <TableCell className="px-4 py-4 text-muted-foreground font-medium">{startNumber + index + 1}</TableCell>
                <TableCell className="px-4 py-4 font-medium">{role.name}</TableCell>
                <TableCell className="px-4 py-4 text-muted-foreground">{role.description}</TableCell>
```

- [ ] **Step 4: Update colSpan for fallback empty row**
  Increase `colSpan` from `4` to `5` to account for the new column.

```tsx
            {data.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No roles found.
                </TableCell>
              </TableRow>
            )}
```
