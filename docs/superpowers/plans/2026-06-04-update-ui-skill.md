# UI Update for Dashboard, Users, and RBAC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the newly defined UI system rules (Cards, Dialogs, Action Buttons, Badges, Tables, Pagination) to the Dashboard, Users, and RBAC features.

**Architecture:** We will systematically update existing React components in `src/routes` and `src/features` to implement the styling changes. We will use `className` overrides where standard shadcn variants do not provide the requested aesthetic, particularly focusing on minimalist dialogs, vibrant badges, spaced tables, pill pagination, and responsive cards with hover effects.

**Tech Stack:** React, Tailwind CSS v4, shadcn/ui

---

### Task 1: Update Dashboard Cards Layout and Styling

**Files:**
- Modify: `src/routes/_authenticated/index.tsx`

- [ ] **Step 1: Update the Stats Cards**
Update the 4 stats cards (Total Users, Active Users, Total Roles, Total Features) to have hover effects. Add `className="hover:shadow-md hover:border-primary/50 transition-all"` to `<Card>`.

```tsx
<Card className="hover:shadow-md hover:border-primary/50 transition-all">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    {/* ... */}
  </CardHeader>
</Card>
```

- [ ] **Step 2: Update the User Distribution Card**
Modify the "User Distribution" card to prevent it from taking full width on large screens. Wrap it in a grid container and apply hover effects.

```tsx
// Inside src/routes/_authenticated/index.tsx
// Find the stats?.userDistribution block and wrap the Card in a grid:

{stats?.userDistribution && stats.userDistribution.length > 0 && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6 mt-6">
    <Card className="hover:shadow-md hover:border-primary/50 transition-all">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">User Distribution</CardTitle>
        <CardDescription>Breakdown of users by role</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ... */}
      </CardContent>
    </Card>
  </div>
)}
```

### Task 2: Update Users Table and Pagination

**Files:**
- Modify: `src/features/users/components/users-table.tsx`

- [ ] **Step 1: Apply Table Styles and Vibrant Badges**
Update the `<TableHead>` and `<TableCell>` components to use generous padding. Add soft hover states to `<TableRow>`. Update the active/inactive `<Badge>` to use vibrant styles.

```tsx
<TableRow className="border-b border-border/50 hover:bg-transparent">
  <TableHead className="px-4 py-3 text-muted-foreground font-medium">Name</TableHead>
  <TableHead className="px-4 py-3 text-muted-foreground font-medium">Email</TableHead>
  <TableHead className="px-4 py-3 text-muted-foreground font-medium">Role</TableHead>
  <TableHead className="px-4 py-3 text-muted-foreground font-medium">Status</TableHead>
  <TableHead className="px-4 py-3 text-right text-muted-foreground font-medium">Actions</TableHead>
</TableRow>

{/* In TableBody loop: */}
<TableRow key={user.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
  <TableCell className="px-4 py-4 font-medium">{user.name}</TableCell>
  <TableCell className="px-4 py-4">{user.email}</TableCell>
  <TableCell className="px-4 py-4">{user.roleName}</TableCell>
  <TableCell className="px-4 py-4">
    {user.isActive ? (
      <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 border-transparent">Active</Badge>
    ) : (
      <Badge className="bg-gray-500 text-white hover:bg-gray-600 border-transparent">Inactive</Badge>
    )}
  </TableCell>
```

- [ ] **Step 2: Apply Subtle Action Buttons**
Update the "Detail", "Edit", and "Delete" buttons to icon-only ghost buttons to reduce clutter.

```tsx
<TableCell className="text-right space-x-1 px-4 py-4">
  <Button variant="ghost" size="icon" id={`detail-user-${user.id}`} className="hover:bg-muted text-muted-foreground" onClick={() => onDetail(user.id)} title="Detail">
    <EyeIcon className="h-4 w-4" />
    <span className="sr-only">Detail</span>
  </Button>
  <Button variant="ghost" size="icon" id={`edit-user-${user.id}`} className="hover:bg-muted text-muted-foreground" onClick={() => onEdit(user.id)} title="Edit">
    <PencilIcon className="h-4 w-4" />
    <span className="sr-only">Edit</span>
  </Button>
  <Button variant="ghost" size="icon" id={`delete-user-${user.id}`} className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive" onClick={() => onDelete?.(user.id)} title="Delete">
    <Trash2Icon className="h-4 w-4" />
    <span className="sr-only">Delete</span>
  </Button>
</TableCell>
```

- [ ] **Step 3: Update Pagination Controls**
Update the pagination rendering to use soft numbered pills instead of standard outline buttons.

```tsx
{data.data.length > 0 && (
  <div className="flex items-center justify-end space-x-2 mt-4">
    <Button
      variant="ghost"
      className="rounded-full hover:bg-muted px-4"
      onClick={() => onPageChange(data.pagination.page - 1)}
      disabled={data.pagination.page <= 1}
    >
      Previous
    </Button>
    <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground h-9 px-4 text-sm font-medium">
      {data.pagination.page}
    </div>
    <Button
      variant="ghost"
      className="rounded-full hover:bg-muted px-4"
      onClick={() => onPageChange(data.pagination.page + 1)}
      disabled={data.pagination.page >= data.pagination.totalPages}
    >
      Next
    </Button>
  </div>
)}
```

### Task 3: Update Users Dialogs

**Files:**
- Modify: `src/features/users/components/user-detail-dialog.tsx`
- Modify: `src/features/users/components/delete-user-dialog.tsx`
- Modify: `src/features/users/components/create-user-form.tsx` 
- Modify: `src/features/users/components/edit-user-form.tsx` 

- [ ] **Step 1: Update DialogContent styling**
Add `rounded-sm border shadow-sm bg-white dark:bg-zinc-950` to `<DialogContent>` in all User-related dialogs to enforce the sleek & minimalist style.

```tsx
<DialogContent className="sm:max-w-md rounded-sm border shadow-sm bg-white dark:bg-zinc-950">
```

### Task 4: Update RBAC Roles Table and Pagination

**Files:**
- Modify: `src/features/roles/components/roles-table.tsx`

- [ ] **Step 1: Apply Table Styles and Action Buttons**
Similar to the Users Table, apply `px-4 py-4`, `hover:bg-muted/50` to `<TableRow>`, and use ghost icon-buttons for actions (like View Details).

```tsx
<TableRow className="border-b border-border/50 hover:bg-muted/50 transition-colors">
  <TableCell className="px-4 py-4 font-medium">{role.name}</TableCell>
  <TableCell className="px-4 py-4 text-muted-foreground">{role.description}</TableCell>
  <TableCell className="text-right space-x-1 px-4 py-4">
    <Button variant="ghost" size="icon" className="hover:bg-muted text-muted-foreground" onClick={() => onView(role.id)} title="Detail">
      <EyeIcon className="h-4 w-4" />
      <span className="sr-only">Detail</span>
    </Button>
  </TableCell>
</TableRow>
```

- [ ] **Step 2: Update Pagination Controls**
Apply the pill styling to the roles pagination similar to `users-table.tsx`.

```tsx
<div className="flex items-center justify-end space-x-2 mt-4">
  <Button
    variant="ghost"
    className="rounded-full hover:bg-muted px-4"
    onClick={() => onPageChange(data.pagination.page - 1)}
    disabled={data.pagination.page <= 1}
  >
    Previous
  </Button>
  <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground h-9 px-4 text-sm font-medium">
    {data.pagination.page}
  </div>
  <Button
    variant="ghost"
    className="rounded-full hover:bg-muted px-4"
    onClick={() => onPageChange(data.pagination.page + 1)}
    disabled={data.pagination.page >= data.pagination.totalPages}
  >
    Next
  </Button>
</div>
```

### Task 5: Update RBAC Roles Dialog and Tables

**Files:**
- Modify: `src/features/roles/components/role-detail-dialog.tsx`
- Modify: `src/features/roles/components/role-permissions-table.tsx`

- [ ] **Step 1: Update Role Detail Dialog**
Update `<DialogContent>` to use the minimalist style `rounded-sm border shadow-sm bg-white dark:bg-zinc-950`.

```tsx
<DialogContent className="sm:max-w-xl rounded-sm border shadow-sm bg-white dark:bg-zinc-950">
```

- [ ] **Step 2: Update Role Permissions Table**
Apply the clean table styling with generous padding (`px-4 py-3`) and soft row hover (`hover:bg-muted/50`) to the permissions table. Replace any generic badges with vibrant colored badges if used.
